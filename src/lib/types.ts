export type ClinicType = "REGULER" | "EKSEKUTIF";
export type PaymentType = "JKN" | "UMUM";
export type VisitStatus = "WAITING" | "IN_SERVICE" | "DONE" | "CANCELLED";

export interface SubSpecialist {
  id: string;
  name: string;
}

export interface Specialist {
  id: string;
  name: string;
  subSpecialists: SubSpecialist[];
}

export interface Doctor {
  id: number;
  name: string;
  display_name: string;
  specialty_id: number;
  specialty_code: string;
  specialty_name: string;
  subspecialty_id: number | null;
  subspecialty_code: string | null;
  subspecialty_name: string | null;
  consultant: boolean;
  clinic_types: ClinicType[];
  max_slot?: number;
}

export interface Visit {
  id: string;
  queueNumber: string; // contoh: "D001-001"
  patientName: string;
  clinicType: ClinicType;
  paymentType: PaymentType;
  visitDate: string; // "YYYY-MM-DD"
  specialistId: string;
  subSpecialistId: string | null;
  doctorId: string;
  status: VisitStatus;
  createdAt: string; // ISO
}

// input insertVisit: id, queueNumber, status, createdAt diisi sistem
export type VisitInput = Omit<Visit, "id" | "queueNumber" | "status" | "createdAt">;