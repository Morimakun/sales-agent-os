import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { leadId, type, note } = await req.json();
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });
  const activity = await prisma.activity.create({
    data: { leadId, type: String(type || "note"), note: String(note || "") },
  });
  return NextResponse.json({ activity });
}
