import { NextResponse } from "next/server";
import { prisma } from "./db";
import { AIError, aiConfigured, callAIText } from "./ai";
import { loadAIContext } from "./opportunity-ai";
import { PROMPT_VERSION, leadContextUser } from "./prompts";
import { guardLead } from "./risk-guard";

type LeadForUser = Parameters<typeof leadContextUser>[0];

/**
 * 共通: Lead 向けテキスト生成 + AiOutput 保存。doNotContact ガード付き。
 */
export async function runLeadTextGeneration(
  leadId: string,
  outputType: string,
  buildSystem: (profileBlock: string, productsBlock: string) => string,
  buildUser: (l: LeadForUser) => string,
  opts?: { guard?: boolean }
): Promise<NextResponse> {
  if (!leadId) return NextResponse.json({ error: "leadId が必要です" }, { status: 400 });

  let lead;
  if (opts?.guard !== false) {
    const g = await guardLead(leadId);
    if (g.blocked) {
      const status = g.reason?.includes("見つかりません") ? 404 : 403;
      return NextResponse.json({ error: g.reason }, { status });
    }
    lead = g.lead!;
  } else {
    lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ error: "リードが見つかりません" }, { status: 404 });
  }

  const conf = aiConfigured();
  if (!conf.ok) {
    return NextResponse.json(
      { error: `AI APIキーが未設定です (provider: ${conf.provider})。.env.local を確認してください。` },
      { status: 400 }
    );
  }

  const { profileBlock, productsBlock } = await loadAIContext();
  try {
    const { text, model } = await callAIText(buildSystem(profileBlock, productsBlock), buildUser(lead as LeadForUser));
    const output = await prisma.aiOutput.create({
      data: { leadId, type: outputType, content: text, model, promptVersion: PROMPT_VERSION },
    });
    if (lead.status === "new") {
      await prisma.lead.update({ where: { id: leadId }, data: { status: "draft_created" } });
    }
    return NextResponse.json({ output });
  } catch (e) {
    const msg = e instanceof AIError ? e.message : "生成中にエラーが発生しました";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
