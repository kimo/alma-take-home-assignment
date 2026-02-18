import { Lead } from "./types";
import { seedLeads } from "./seed";

// In-memory store — data persists during server lifetime
const leads = new Map<string, Lead>();

// Initialize with seed data
seedLeads.forEach((lead) => {
  leads.set(lead.id, lead);
});

let nextId = seedLeads.length + 1;

export function getAllLeads(): Lead[] {
  return Array.from(leads.values()).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function getLeadById(id: string): Lead | undefined {
  return leads.get(id);
}

export function createLead(
  data: Omit<Lead, "id" | "status" | "submittedAt">
): Lead {
  const id = String(nextId++);
  const lead: Lead = {
    ...data,
    id,
    status: "PENDING",
    submittedAt: new Date().toISOString(),
  };
  leads.set(id, lead);
  return lead;
}

export function updateLeadStatus(
  id: string,
  status: Lead["status"]
): Lead | null {
  const lead = leads.get(id);
  if (!lead) return null;
  lead.status = status;
  leads.set(id, lead);
  return lead;
}
