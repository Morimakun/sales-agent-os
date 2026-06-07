import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const where: Record<string, unknown> = {};
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const sourceType = searchParams.get("sourceType");
  const q = searchParams.get("q");
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (sourceType) where.sourceType = sourceType;
  if (q) {
    where.OR = [
      { companyName: { contains: q } },
      { rawText: { contains: q } },
      { memo: { contains: q } },
    ];
  }
  const opportunities = await prisma.opportunity.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
  });
  return NextResponse.json({ opportunities });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const opportunity = await prisma.opportunity.create({
    data: {
      sourceType: String(b.sourceType || "other"),
      sourceName: String(b.sourceName || ""),
      url: String(b.url || ""),
      rawText: String(b.rawText || ""),
      companyName: String(b.companyName || ""),
      personName: String(b.personName || ""),
      industry: String(b.industry || ""),
      budgetHint: String(b.budgetHint || ""),
      candidateType: String(b.candidateType || "z"),
      referrerName: String(b.referrerName || ""),
      painPoints: String(b.painPoints || ""),
      tools: String(b.tools || ""),
      temperature: String(b.temperature || "medium"),
      memo: String(b.memo || ""),
    },
  });
  return NextResponse.json({ opportunity });
}
