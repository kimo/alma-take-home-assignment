import { leadFormSchema } from "@/lib/schema";

describe("Lead Form Schema Validation", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    country: "Canada",
    linkedIn: "https://linkedin.com/in/johndoe",
    visaInterests: ["O-1"],
    helpMessage: "Need help with visa",
  };

  it("accepts valid form data", () => {
    const result = leadFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects empty first name", () => {
    const result = leadFormSchema.safeParse({ ...validData, firstName: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.firstName).toBeDefined();
    }
  });

  it("rejects invalid email", () => {
    const result = leadFormSchema.safeParse({ ...validData, email: "notanemail" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects invalid URL for LinkedIn", () => {
    const result = leadFormSchema.safeParse({ ...validData, linkedIn: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.linkedIn).toBeDefined();
    }
  });

  it("rejects empty visa interests", () => {
    const result = leadFormSchema.safeParse({ ...validData, visaInterests: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.visaInterests).toBeDefined();
    }
  });

  it("rejects missing help message", () => {
    const result = leadFormSchema.safeParse({ ...validData, helpMessage: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.helpMessage).toBeDefined();
    }
  });

  it("accepts multiple visa interests", () => {
    const result = leadFormSchema.safeParse({
      ...validData,
      visaInterests: ["O-1", "EB-1A", "EB-2 NIW"],
    });
    expect(result.success).toBe(true);
  });
});
