import { getAllLeads, createLead, getLeadById, updateLeadStatus } from "@/lib/store";

describe("Leads Store", () => {
  it("returns all seed leads", () => {
    const leads = getAllLeads();
    expect(leads.length).toBeGreaterThanOrEqual(8);
  });

  it("creates a new lead with PENDING status", () => {
    const lead = createLead({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      country: "Canada",
      linkedIn: "https://linkedin.com/in/testuser",
      visaInterests: ["O-1"],
      resumePath: null,
      resumeFileName: null,
      helpMessage: "Test message",
    });

    expect(lead.id).toBeDefined();
    expect(lead.status).toBe("PENDING");
    expect(lead.firstName).toBe("Test");
    expect(lead.submittedAt).toBeDefined();
  });

  it("finds a lead by id", () => {
    const lead = getLeadById("1");
    expect(lead).toBeDefined();
    expect(lead?.firstName).toBe("Jorge");
  });

  it("returns undefined for non-existent lead", () => {
    const lead = getLeadById("9999");
    expect(lead).toBeUndefined();
  });

  it("updates lead status to REACHED_OUT", () => {
    const updated = updateLeadStatus("1", "REACHED_OUT");
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("REACHED_OUT");
  });

  it("returns null when updating non-existent lead", () => {
    const result = updateLeadStatus("9999", "REACHED_OUT");
    expect(result).toBeNull();
  });
});
