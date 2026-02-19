import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllLeads, createLead } from "@/lib/store";
import { leadFormSchema } from "@/lib/schema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET /api/leads — List leads with pagination, search, and status filter
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  let leads = getAllLeads();

  // Filter by status
  if (status && status !== "all") {
    leads = leads.filter((lead) => lead.status === status);
  }

  // Filter by search (name)
  if (search) {
    const query = search.toLowerCase();
    leads = leads.filter(
      (lead) =>
        lead.firstName.toLowerCase().includes(query) ||
        lead.lastName.toLowerCase().includes(query)
    );
  }

  const total = leads.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedLeads = leads.slice(start, start + limit);

  return NextResponse.json({
    leads: paginatedLeads,
    total,
    page,
    totalPages,
  });
}

// POST /api/leads — Create a new lead (multipart FormData)
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const rawData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    country: formData.get("country") as string,
    linkedIn: formData.get("linkedIn") as string,
    visaInterests: JSON.parse(formData.get("visaInterests") as string || "[]"),
    helpMessage: formData.get("helpMessage") as string,
  };

  // Validate with Zod
  const result = leadFormSchema.safeParse(rawData);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Handle file upload
  let resumePath: string | null = null;
  let resumeFileName: string | null = null;
  const file = formData.get("resume") as File | null;

  if (file && file.size > 0) {
    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    resumePath = `/uploads/${fileName}`;
    resumeFileName = file.name;
  }

  const lead = createLead({
    ...result.data,
    resumePath,
    resumeFileName,
  });

  return NextResponse.json({ id: lead.id, status: lead.status }, { status: 201 });
}
