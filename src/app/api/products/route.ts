import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const product = await prisma.product.create({
    data: {
      name: String(b.name || "").trim() || "無題の商品",
      priceMin: Number(b.priceMin) || 0,
      priceMax: Number(b.priceMax) || 0,
      description: String(b.description || ""),
      target: String(b.target || ""),
      deliverables: String(b.deliverables || ""),
      salesAngle: String(b.salesAngle || ""),
    },
  });
  return NextResponse.json({ product });
}
