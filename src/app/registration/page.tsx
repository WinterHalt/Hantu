"use client";

import { useEffect, useState } from "react";
import { findDoctors, getSubSpecialists, loadSpecialists } from "@/lib/master";
import { getSlotInfo, getVisitDateRange, insertVisit } from "@/lib/visit";
import type { ClinicType, PaymentType } from "@/lib/types";

export default function RegistrationPage() {
  const [clinicType, setClinicType] = useState<ClinicType>("REGULER");
  const [paymentType, setPaymentType] = useState<PaymentType>("JKN");
  const [visitDate, setVisitDate] = useState("");
  const [specialistId, setSpecialistId] = useState("");
  const [subSpecialistId, setSubSpecialistId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [mounted, setMounted] = useState(false);
  const [, setVersion] = useState(0); 

  const { min, max } = getVisitDateRange();

  useEffect(() => {
    setVisitDate(getVisitDateRange().min);
    setMounted(true);
  }, []);

  // diturunkan saat render, tidak disimpan di state
  const specialists = loadSpecialists();
  const subSpecialists = specialistId ? getSubSpecialists(Number(specialistId)) : [];
  const doctors = specialistId
    ? findDoctors({
        clinicType,
        specialtyId: Number(specialistId),
        subspecialtyId: subSpecialistId ? Number(subSpecialistId) : null,
      })
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = insertVisit({
      patientName,
      clinicType,
      paymentType,
      visitDate,
      specialistId,
      subSpecialistId: subSpecialistId || null,
      doctorId,
    });

    if (result.ok) {
      setMessage({ ok: true, text: `Berhasil. No. antrean: ${result.visit.queueNumber}` });
      setPatientName("");
      setDoctorId("");
      setVersion((v) => v + 1); // refresh angka slot
    } else {
      setMessage({ ok: false, text: result.error });
    }
  }

  return (
    <div>
      <h2>Pendaftaran</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Poli Klinik
          <select
            value={clinicType}
            onChange={(e) => {
              setClinicType(e.target.value as ClinicType);
              setDoctorId("");
            }}
          >
            <option value="REGULER">Reguler</option>
            <option value="EKSEKUTIF">Eksekutif</option>
          </select>
        </label>

        <label>
          Cara Bayar
          <select value={paymentType} onChange={(e) => setPaymentType(e.target.value as PaymentType)}>
            <option value="JKN">JKN</option>
            <option value="UMUM">Umum</option>
          </select>
        </label>

        <label>
          Tanggal Kunjungan
          <input
            type="date"
            value={visitDate}
            min={min}
            max={max}
            onChange={(e) => {
              setVisitDate(e.target.value);
              setDoctorId("");
            }}
          />
        </label>

        <label>
          Spesialis
          <select
            value={specialistId}
            onChange={(e) => {
              setSpecialistId(e.target.value);
              setSubSpecialistId("");
              setDoctorId("");
            }}
          >
            <option value="">-- Pilih --</option>
            {specialists.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>

        <label>
          Sub Spesialis
          <select
            value={subSpecialistId}
            disabled={subSpecialists.length === 0}
            onChange={(e) => {
              setSubSpecialistId(e.target.value);
              setDoctorId("");
            }}
          >
            <option value="">-- Semua / Tidak ada --</option>
            {subSpecialists.map((ss) => (
              <option key={ss.id} value={ss.id}>{ss.name}</option>
            ))}
          </select>
        </label>

        <label>
          Dokter
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} disabled={!specialistId}>
            <option value="">-- Pilih dokter --</option>
            {doctors.map((d) => {
              const slot = mounted && visitDate ? getSlotInfo(String(d.id), visitDate) : null;
              return (
                <option key={d.id} value={d.id} disabled={slot?.full}>
                  {d.display_name}
                </option>
              );
            })}
          </select>
        </label>

        <label className="full">
          Nama Pasien
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Nama lengkap"
          />
        </label>

        <div className="full">
          <button type="submit" disabled={!doctorId || !patientName.trim()}>Daftar</button>
        </div>

        {message && (
          <p className={`full msg ${message.ok ? "msg-ok" : "msg-err"}`}>{message.text}</p>
        )}
      </form>
    </div>
  );
}