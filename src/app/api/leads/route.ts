import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const where: Prisma.LeadWhereInput = {};
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const industry = searchParams.get("industry");
  const area = searchParams.get("area");
  const q = searchParams.get("q");
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (industry) where.industry = industry;
  if (area) where.area = area;
  if (q) where.OR = [{ companyName: { contains: q } }, { memo: { contains: q } }];
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const lead = await prisma.lead.create({
    data: {
      companyName: String(b.companyName || ""),
      contactName: String(b.contactName || ""),
      email: String(b.email || ""),
      phone: String(b.phone || ""),
      websiteUrl: String(b.websiteUrl || ""),
      contactFormUrl: String(b.contactFormUrl || ""),
      industry: String(b.industry || ""),
      area: String(b.area || ""),
      source: String(b.source || ""),
      memo: String(b.memo || ""),
    },
  });
  return NextResponse.json({ lead });
}
