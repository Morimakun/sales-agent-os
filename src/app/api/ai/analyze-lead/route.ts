import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AIError, aiConfigured, callAIJson } from "@/lib/ai";
import { leadAnalysisSystem, leadContextUser, PROMPT_VERSION } from "@/lib/prompts";
import { loadAIContext } from "@/lib/opportunity-ai";

interface LeadAnalysis {
  priority?: string;
  score?: number;
  pain_hypothesis?: string;
  offer_hypothesis?: string;
  reason?: string;
  first_angle?: string;
  recommended_channel?: string;
  risks?: string[];
  next_action?: string;
}

export async function POST(req: NextRequest) {
  const { leadId } = await req.json();
  if (!leadId) return NextResponse.json({ error: "leadId が必要です" }, { status: 400 });
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return NextResponse.json({ error: "リードが見つかりません" }, { status: 404 });

  const conf = aiConfigured();
  if (!conf.ok) {
    return NextResponse.json({ error: `AI APIキーが未設定です (provider: ${conf.provider})。` }, { status: 400 });
  }

  const { profileBlock, productsBlock } = await loadAIContext();
  try {
    const { data, model } = await callAIJson<LeadAnalysis>(
      leadAnalysisSystem(profileBlock, productsBlock),
      leadContextUser(lead)
    );
    const priority = ["A", "B", "C"].includes(String(data.priority)) ? String(data.priority) : "unknown";
    const score = typeof data.score === "number" ? Math.max(0, Math.min(100, Math.round(data.score))) : null;
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        priority,
        score,
        painHypothesis: data.pain_hypothesis || "",
        offerHypothesis: data.offer_hypothesis || "",
        status: lead.status === "new" ? "analyzed" : lead.status,
      },
    });
    await prisma.aiOutput.create({
      data: { leadId, type: "lead_analysis", content: JSON.stringify(data, null, 2), model, promptVersion: PROMPT_VERSION },
    });
    return NextResponse.json({ analysis: data });
  } catch (e) {
    const msg = e instanceof AIError ? e.message : "分析中にエラーが発生しました";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
