import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      aiOutputs: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

const EDITABLE = [
  "companyName",
  "contactName",
  "email",
  "phone",
  "websiteUrl",
  "contactFormUrl",
  "industry",
  "area",
  "source",
  "memo",
  "status",
  "priority",
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
  if (b.status === "do_not_contact") data.doNotContact = true;
  if (b.status === "sent") data.lastContactedAt = new Date();

  const lead = await prisma.lead.update({ where: { id }, data });

  // 簡易アクティビティ記録
  if (b.status) {
    await prisma.activity.create({ data: { leadId: id, type: b.status, note: "ステータス変更" } });
  }
  return NextResponse.json({ lead });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
