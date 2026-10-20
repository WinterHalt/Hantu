import { getMaxSlot, loadDoctors } from "./master";
import type { Visit, VisitInput, VisitStatus } from "./types";

const STORAGE_KEY = "visits";
const MAX_DAYS_AHEAD = 10;

// ---------- tanggal (waktu lokal, hindari geser UTC dari toISOString) ----------

function toLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// dipakai untuk <input type="date" min=... max=...>
export function getVisitDateRange() {
  const today = new Date();
  const max = new Date();
  max.setDate(today.getDate() + MAX_DAYS_AHEAD);
  return { min: toLocalDate(today), max: toLocalDate(max) };
}

// ---------- storage (ganti dua fungsi ini dengan fetch() ke API Go nanti) ----------

export function loadVisits(): Visit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Visit[]) : [];
  } catch {
    return [];
  }
}

function saveVisits(visits: Visit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
}

// ---------- slot ----------

// slot terisi = kunjungan aktif (bukan CANCELLED) untuk dokter dan tanggal ini
export function countFilled(doctorId: string, visitDate: string): number {
  return loadVisits().filter(
    (v) => v.doctorId === doctorId && v.visitDate === visitDate && v.status !== "CANCELLED"
  ).length;
}

export function getSlotInfo(doctorId: string, visitDate: string) {
  const doctor = loadDoctors().find((d) => d.id === Number(doctorId));
  const max = doctor ? getMaxSlot(doctor) : 0;
  const filled = countFilled(doctorId, visitDate);
  return { filled, max, full: filled >= max };
}

// ---------- insert & modify ----------

export type InsertResult =
  | { ok: true; visit: Visit }
  | { ok: false; error: string };

export function insertVisit(input: VisitInput): InsertResult {
  const { min, max } = getVisitDateRange();

  if (!input.patientName.trim()) return { ok: false, error: "Nama pasien wajib diisi" };
  const visitDate = String(input.visitDate);
  if (visitDate < min || visitDate > max)
    return { ok: false, error: `Tanggal kunjungan harus antara ${min} dan ${max}` };

  const doctor = loadDoctors().find((d) => d.id === Number(input.doctorId));
  if (!doctor) return { ok: false, error: "Dokter tidak ditemukan" };
  if (!doctor.clinic_types.includes(input.clinicType))
    return { ok: false, error: "Dokter tidak melayani poli ini" };

  if (getSlotInfo(input.doctorId, input.visitDate).full)
    return { ok: false, error: "Slot dokter pada tanggal ini sudah penuh" };

  const visits = loadVisits();

  // urutan menghitung yang CANCELLED juga, jadi nomor antrean tidak dipakai ulang
  const seq =
    visits.filter((v) => v.doctorId === input.doctorId && v.visitDate === input.visitDate).length + 1;

  const visit: Visit = {
    ...input,
    patientName: input.patientName.trim(),
    id: crypto.randomUUID(),
    queueNumber: `${input.doctorId}-${String(seq).padStart(3, "0")}`,
    status: "WAITING",
    createdAt: new Date().toISOString(),
  };

  saveVisits([...visits, visit]);
  return { ok: true, visit };
}

export function updateVisit(
  id: string,
  patch: Partial<Pick<Visit, "patientName" | "paymentType" | "status">>
): Visit | null {
  const visits = loadVisits();
  const idx = visits.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  visits[idx] = { ...visits[idx], ...patch };
  saveVisits(visits);
  return visits[idx];
}

export function setVisitStatus(id: string, status: VisitStatus) {
  return updateVisit(id, { status });
}

