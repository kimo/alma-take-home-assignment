import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFormConfig, setFormConfig } from "@/lib/formConfigStore";

// GET /api/form-config — Public (the public form needs it)
export async function GET() {
  const schema = getFormConfig();
  return NextResponse.json(schema);
}

// PUT /api/form-config — Auth required
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Schema must be a JSON object" },
      { status: 400 }
    );
  }

  const schema = body as Record<string, unknown>;

  if (schema.type !== "object" || typeof schema.properties !== "object") {
    return NextResponse.json(
      {
        error:
          "Invalid JSON Schema: must have type 'object' and a properties field",
      },
      { status: 400 }
    );
  }

  // Validate country enum if present
  const properties = schema.properties as Record<string, unknown>;
  const country = properties.country as Record<string, unknown> | undefined;
  if (country?.enum) {
    if (
      !Array.isArray(country.enum) ||
      !country.enum.every((v: unknown) => typeof v === "string")
    ) {
      return NextResponse.json(
        { error: "country.enum must be an array of strings" },
        { status: 400 }
      );
    }
  }

  setFormConfig(schema);
  return NextResponse.json({ success: true, schema: getFormConfig() });
}
