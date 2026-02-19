import { COUNTRIES, VISA_OPTIONS } from "./schema";

// Build the default JSON Schema from existing constants
function buildDefaultSchema(): Record<string, unknown> {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Lead Assessment Form",
    description: "Immigration case assessment intake form",
    type: "object",
    required: [
      "firstName",
      "lastName",
      "email",
      "country",
      "linkedIn",
      "visaInterests",
      "helpMessage",
    ],
    properties: {
      firstName: {
        type: "string",
        title: "First Name",
        minLength: 1,
      },
      lastName: {
        type: "string",
        title: "Last Name",
        minLength: 1,
      },
      email: {
        type: "string",
        title: "Email",
        format: "email",
      },
      country: {
        type: "string",
        title: "Country of Citizenship",
        enum: [...COUNTRIES],
      },
      linkedIn: {
        type: "string",
        title: "LinkedIn / Website URL",
        format: "uri",
      },
      visaInterests: {
        type: "array",
        title: "Visa Categories of Interest",
        items: {
          type: "string",
          enum: [...VISA_OPTIONS],
        },
        minItems: 1,
      },
      helpMessage: {
        type: "string",
        title: "How can we help you?",
        minLength: 1,
      },
    },
  };
}

// Deep clone via JSON round-trip (safe for plain JSON Schema objects)
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

let currentSchema: Record<string, unknown> = buildDefaultSchema();

export function getFormConfig(): Record<string, unknown> {
  return deepClone(currentSchema);
}

export function setFormConfig(schema: Record<string, unknown>): void {
  currentSchema = deepClone(schema);
}

export function getDefaultFormSchema(): Record<string, unknown> {
  return buildDefaultSchema();
}
