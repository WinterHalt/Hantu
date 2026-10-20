import doctors from "@/data/doctors.json";
import type { ClinicType, Doctor } from "./types";

export const DEFAULT_MAX_SLOT = 15;

export function loadDoctors(): Doctor[] {
  return doctors as unknown as Doctor[];
}

export function loadSpecialists() {
  const map = new Map<number, string>();
  loadDoctors().forEach((d) => map.set(d.specialty_id, d.specialty_name));
  return [...map].map(([id, name]) => ({ id, name }));
}

export function getSubSpecialists(specialtyId: number) {
  const map = new Map<number, string>();
  loadDoctors()
    .filter((d) => d.specialty_id === specialtyId && d.subspecialty_id != null)
    .forEach((d) => map.set(d.subspecialty_id!, d.subspecialty_name!));
  return [...map].map(([id, name]) => ({ id, name }));
}

export function findDoctors(opts: {
  clinicType: ClinicType;
  specialtyId: number;
  subspecialtyId?: number | null;
}): Doctor[] {
  return loadDoctors().filter(
    (d) =>
      d.clinic_types.includes(opts.clinicType) &&
      d.specialty_id === opts.specialtyId &&
      (!opts.subspecialtyId || d.subspecialty_id === opts.subspecialtyId)
  );
}

export function getMaxSlot(d: Doctor): number {
  return d.max_slot ?? DEFAULT_MAX_SLOT;
}