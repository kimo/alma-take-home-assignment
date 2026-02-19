import {
  getFormConfig,
  setFormConfig,
  getDefaultFormSchema,
} from "@/lib/formConfigStore";

describe("Form Config Store", () => {
  // Reset to default before each test
  beforeEach(() => {
    setFormConfig(getDefaultFormSchema());
  });

  it("returns default schema with correct JSON Schema version", () => {
    const config = getFormConfig();
    expect(config.$schema).toBe("http://json-schema.org/draft-07/schema#");
    expect(config.type).toBe("object");
  });

  it("default schema has country enum with 100+ entries", () => {
    const config = getFormConfig();
    const props = config.properties as Record<
      string,
      { enum?: string[] }
    >;
    expect(props.country.enum).toBeDefined();
    expect(Array.isArray(props.country.enum)).toBe(true);
    expect(props.country.enum!.length).toBeGreaterThan(100);
  });

  it("default schema includes all 7 form fields", () => {
    const config = getFormConfig();
    const props = config.properties as Record<string, unknown>;
    expect(props.firstName).toBeDefined();
    expect(props.lastName).toBeDefined();
    expect(props.email).toBeDefined();
    expect(props.country).toBeDefined();
    expect(props.linkedIn).toBeDefined();
    expect(props.visaInterests).toBeDefined();
    expect(props.helpMessage).toBeDefined();
  });

  it("updates schema via setFormConfig", () => {
    const custom = getDefaultFormSchema();
    const props = custom.properties as Record<
      string,
      { enum?: string[] }
    >;
    props.country.enum = ["TestCountry1", "TestCountry2"];

    setFormConfig(custom);

    const result = getFormConfig();
    const resultProps = result.properties as Record<
      string,
      { enum?: string[] }
    >;
    expect(resultProps.country.enum).toEqual([
      "TestCountry1",
      "TestCountry2",
    ]);
  });

  it("getFormConfig returns a clone, not a reference", () => {
    const config1 = getFormConfig();
    const config2 = getFormConfig();
    expect(config1).not.toBe(config2);
    expect(config1).toEqual(config2);
  });

  it("setFormConfig stores a clone of the input", () => {
    const custom = getDefaultFormSchema();
    setFormConfig(custom);

    // Mutate the input after setting
    (custom as Record<string, unknown>).type = "array";

    // Stored config should be unaffected
    const stored = getFormConfig();
    expect(stored.type).toBe("object");
  });
});
