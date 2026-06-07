import { NextRequest, NextResponse } from "next/server";
import { getTemplates, saveTemplates } from "@/lib/templates";

export async function GET() {
  return NextResponse.json({ templates: await getTemplates() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, string>;
  await saveTemplates(body);
  return NextResponse.json({ templates: await getTemplates() });
}
