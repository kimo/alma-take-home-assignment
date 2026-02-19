import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLeadById, updateLeadStatus } from "@/lib/store";

// PATCH /api/leads/[id] — Update lead status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!status || !["PENDING", "REACHED_OUT"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be PENDING or REACHED_OUT." },
      { status: 400 }
    );
  }

  const existing = getLeadById(id);
  if (!existing) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const updated = updateLeadStatus(id, status);
  return NextResponse.json({ id: updated!.id, status: updated!.status });
}
