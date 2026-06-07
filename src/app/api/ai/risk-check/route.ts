import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AIError, aiConfigured, callAIJson } from "@/lib/ai";
import { riskCheckSystem, riskCheckUser, PROMPT_VERSION } from "@/lib/prompts";
import { getAllSettings, profileToPromptBlock } from "@/lib/settings";

interface RiskResult {
  risk_level?: string;
  issues?: string[];
  fixed_message?: string;
  send_recommendation?: string;
}

// 任意の文面、または leadId + 既存出力に対するリスクチェック
export async function POST(req: NextRequest) {
  const { message, leadId } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "チェック対象の message が必要です" }, { status: 400 });
  }
  const conf = aiConfigured();
  if (!conf.ok) {
    return NextResponse.json({ error: `AI APIキーが未設定です (provider: ${conf.provider})。` }, { status: 400 });
  }

  const settings = await getAllSettings();
  const profileBlock = profileToPromptBlock(settings);
  try {
    const { data, model } = await callAIJson<RiskResult>(riskCheckSystem(profileBlock), riskCheckUser(message));
    const riskLevel = ["low", "medium", "high"].includes(String(data.risk_level)) ? String(data.risk_level) : "medium";
    if (leadId) {
      await prisma.aiOutput.create({
        data: { leadId, type: "risk_check", content: JSON.stringify(data, null, 2), model, riskLevel, promptVersion: PROMPT_VERSION },
      });
    }
    return NextResponse.json({ risk: { ...data, risk_level: riskLevel } });
  } catch (e) {
    const msg = e instanceof AIError ? e.message : "リスクチェック中にエラーが発生しました";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
