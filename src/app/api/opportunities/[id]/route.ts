import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function parseDateValue(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseStringValue(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return String(value ?? "");
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: { drafts: { orderBy: { createdAt: "desc" } } },
  });
  if (!opportunity) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ opportunity });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const data: Record<string, unknown> = {};

  const stringFields = [
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
    "sentChannel",
    "sentTo",
    "sentUrl",
    "sentMessage",
    "replyStatus",
    "replySummary",
    "replyBody",
    "nextActionDate",
    "lpSourceId",
    "lpUrl",
  ] as const;

  for (const key of stringFields) {
    if (b[key] !== undefined) data[key] = parseStringValue(b[key]);
  }

  if (b.doNotContact !== undefined) {
    data.doNotContact = Boolean(b.doNotContact);
    if (b.doNotContact) data.status = "do_not_contact";
  }
  if (b.sentAt !== undefined) data.sentAt = parseDateValue(b.sentAt);
  if (b.lastReplyAt !== undefined) data.lastReplyAt = parseDateValue(b.lastReplyAt);
  if (b.nextActionAt !== undefined) data.nextActionAt = parseDateValue(b.nextActionAt);
  if (b.nextActionDate !== undefined) data.nextActionDate = parseDateValue(b.nextActionDate);
  if (b.lpVisited !== undefined) data.lpVisited = Boolean(b.lpVisited);
  if (b.lpFormSubmitted !== undefined) data.lpFormSubmitted = Boolean(b.lpFormSubmitted);
  if (b.difyOpened !== undefined) data.difyOpened = Boolean(b.difyOpened);
  if (b.status === "do_not_contact") data.doNotContact = true;

  const opportunity = await prisma.opportunity.update({ where: { id }, data });
  return NextResponse.json({ opportunity });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.opportunity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
