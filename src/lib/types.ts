export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedIn: string;
  visaInterests: string[];
  resumePath: string | null;
  resumeFileName: string | null;
  helpMessage: string;
  status: "PENDING" | "REACHED_OUT";
  submittedAt: string; // ISO string
}

export type LeadStatus = Lead["status"];

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateLeadResponse {
  id: string;
  status: LeadStatus;
}
