import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const data: Record<string, unknown> = {};
  if (b.name !== undefined) data.name = String(b.name);
  if (b.priceMin !== undefined) data.priceMin = Number(b.priceMin) || 0;
  if (b.priceMax !== undefined) data.priceMax = Number(b.priceMax) || 0;
  if (b.description !== undefined) data.description = String(b.description);
  if (b.target !== undefined) data.target = String(b.target);
  if (b.deliverables !== undefined) data.deliverables = String(b.deliverables);
  if (b.salesAngle !== undefined) data.salesAngle = String(b.salesAngle);
  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
