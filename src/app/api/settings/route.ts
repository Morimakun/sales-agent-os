import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, saveSettings, type SettingKey } from "@/lib/settings";

export async function GET() {
  const settings = await getAllSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Record<SettingKey, string>>;
  await saveSettings(body);
  const settings = await getAllSettings();
  return NextResponse.json({ settings });
}
