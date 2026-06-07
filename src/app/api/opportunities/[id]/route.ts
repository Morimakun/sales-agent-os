import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: { drafts: { orderBy: { createdAt: "desc" } } },
  });
  if (!opportunity) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ opportunity });
}

const EDITABLE = [
  "sourceType",
  "sourceName",
  "url",
  "rawText",
  "companyName",
  "personName",
  "industry",
  "budgetHint",
  "memo",
  "status",
  "priority",
  "nextAction",
];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of EDITABLE) if (b[k] !== undefined) data[k] = b[k];

  if (b.doNotContact !== undefined) {
    data.doNotContact = Boolean(b.doNotContact);
    if (b.doNotContact) data.status = "do_not_contact";
  }
  if (b.nextActionAt !== undefined) {
    data.nextActionAt = b.nextActionAt ? new Date(b.nextActionAt) : null;
  }
  // ステータスが do_not_contact に変わったらフラグも立てる
  if (b.status === "do_not_contact") data.doNotContact = true;

  const opportunity = await prisma.opportunity.update({ where: { id }, data });
  return NextResponse.json({ opportunity });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.opportunity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
