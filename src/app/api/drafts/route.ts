import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// OutreachDraft の取得 (過去版を含む)。?opportunityId=... で絞り込み。
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const opportunityId = searchParams.get("opportunityId") || undefined;
  const drafts = await prisma.outreachDraft.findMany({
    where: opportunityId ? { opportunityId } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ drafts });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.outreachDraft.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
