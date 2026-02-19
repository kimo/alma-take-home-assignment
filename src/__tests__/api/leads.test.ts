import {
  getAllLeads,
  createLead,
  getLeadById,
  updateLeadStatus,
} from "@/lib/store";

describe("Leads Store", () => {
  it("returns all seed leads", () => {
    const leads = getAllLeads();
    expect(leads.length).toBeGreaterThanOrEqual(20);
  });

  it("returns leads sorted by submittedAt descending", () => {
    const leads = getAllLeads();
    for (let i = 1; i < leads.length; i++) {
      expect(
        new Date(leads[i - 1].submittedAt).getTime()
      ).toBeGreaterThanOrEqual(new Date(leads[i].submittedAt).getTime());
    }
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

  it("creates a lead with resume data", () => {
    const lead = createLead({
      firstName: "Resume",
      lastName: "Test",
      email: "resume@example.com",
      country: "Mexico",
      linkedIn: "https://linkedin.com/in/resumetest",
      visaInterests: ["EB-1A"],
      resumePath: "/uploads/test-resume.pdf",
      resumeFileName: "test-resume.pdf",
      helpMessage: "Has resume",
    });

    expect(lead.resumePath).toBe("/uploads/test-resume.pdf");
    expect(lead.resumeFileName).toBe("test-resume.pdf");
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
    const updated = updateLeadStatus("2", "REACHED_OUT");
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("REACHED_OUT");
  });

  it("returns null when updating non-existent lead", () => {
    const result = updateLeadStatus("9999", "REACHED_OUT");
    expect(result).toBeNull();
  });

  it("newly created lead appears in getAllLeads", () => {
    const lead = createLead({
      firstName: "Findable",
      lastName: "Lead",
      email: "findable@example.com",
      country: "Japan",
      linkedIn: "https://linkedin.com/in/findable",
      visaInterests: ["O-1"],
      resumePath: null,
      resumeFileName: null,
      helpMessage: "Should appear in list",
    });

    const all = getAllLeads();
    const found = all.find((l) => l.id === lead.id);
    expect(found).toBeDefined();
    expect(found?.firstName).toBe("Findable");
  });

  it("seed data includes leads with various statuses", () => {
    const leads = getAllLeads();
    const pending = leads.filter((l) => l.status === "PENDING");
    const reachedOut = leads.filter((l) => l.status === "REACHED_OUT");
    expect(pending.length).toBeGreaterThan(0);
    expect(reachedOut.length).toBeGreaterThan(0);
  });

  it("seed data includes leads with and without resumes", () => {
    const leads = getAllLeads();
    const withResume = leads.filter((l) => l.resumePath !== null);
    const withoutResume = leads.filter((l) => l.resumePath === null);
    expect(withResume.length).toBeGreaterThan(0);
    expect(withoutResume.length).toBeGreaterThan(0);
  });
});
