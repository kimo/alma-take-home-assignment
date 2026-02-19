import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLeadById } from "@/lib/store";
import { readFile } from "fs/promises";
import path from "path";

// GET /api/leads/[id]/download — Download lead's resume
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = getLeadById(id);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  if (!lead.resumePath || !lead.resumeFileName) {
    return NextResponse.json({ error: "No resume uploaded" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), lead.resumePath);

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${lead.resumeFileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }
}
