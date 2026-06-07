import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AIError, aiConfigured, callAIJson } from "@/lib/ai";
import { analyzeOpportunitySystem, analyzeOpportunityUser } from "@/lib/prompts";
import { loadAIContext } from "@/lib/opportunity-ai";

interface AnalysisResult {
  fit_score?: number;
  priority?: string;
  pain_hypothesis?: string;
  offer_hypothesis?: string;
  recommended_offer?: string;
  reason?: string;
  risks?: string[];
  next_action?: string;
  should_contact?: boolean;
}

export async function POST(req: NextRequest) {
  const { opportunityId } = await req.json();
  if (!opportunityId) return NextResponse.json({ error: "opportunityId が必要です" }, { status: 400 });

  const o = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!o) return NextResponse.json({ error: "案件候補が見つかりません" }, { status: 404 });

  const conf = aiConfigured();
  if (!conf.ok) {
    return NextResponse.json(
      { error: `AI APIキーが未設定です (provider: ${conf.provider})。.env.local を確認してください。` },
      { status: 400 }
    );
  }

  const { profileBlock, productsBlock } = await loadAIContext();
  try {
    const { data } = await callAIJson<AnalysisResult>(
      analyzeOpportunitySystem(profileBlock, productsBlock),
      analyzeOpportunityUser(o)
    );

    const priority = ["A", "B", "C"].includes(String(data.priority)) ? String(data.priority) : "unknown";
    const fitScore =
      typeof data.fit_score === "number" ? Math.max(0, Math.min(100, Math.round(data.fit_score))) : null;

    const updated = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        fitScore,
        priority,
        painHypothesis: data.pain_hypothesis || "",
        offerHypothesis: data.offer_hypothesis || "",
        recommendedOffer: data.recommended_offer || "",
        reason: data.reason || "",
        nextAction: data.next_action || "",
        status: o.status === "new" ? "analyzed" : o.status,
      },
    });
    return NextResponse.json({ opportunity: updated, analysis: data });
  } catch (e) {
    const msg = e instanceof AIError ? e.message : "分析中にエラーが発生しました";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
