import { NextResponse } from "next/server";
import { prisma } from "./db";
import { AIError, aiConfigured, callAIText } from "./ai";
import { getAllSettings, profileToPromptBlock } from "./settings";
import { productsToBlock, type ProductInfo, PROMPT_VERSION } from "./prompts";
import { guardOpportunity } from "./risk-guard";
import type { OutreachDraftType } from "./constants";

export async function loadAIContext(): Promise<{ profileBlock: string; productsBlock: string }> {
  const [settings, products] = await Promise.all([
    getAllSettings(),
    prisma.product.findMany({ orderBy: { createdAt: "asc" } }),
  ]);
  const profileBlock = profileToPromptBlock(settings);
  const productsBlock = productsToBlock(products as unknown as ProductInfo[]);
  return { profileBlock, productsBlock };
}

type OppForUser = {
  companyName: string;
  personName: string;
  industry: string;
  rawText: string;
  memo: string;
  painHypothesis: string;
  offerHypothesis: string;
  recommendedOffer: string;
  lpSourceId: string;
  lpUrl: string;
};

/**
 * 共通: 案件候補向けのテキスト文面生成 + OutreachDraft 保存。
 * doNotContact ガードを必ず通す。
 */
export async function runOpportunityTextGeneration(
  opportunityId: string,
  draftType: OutreachDraftType,
  buildSystem: (profileBlock: string, productsBlock: string, opportunity?: OppForUser) => string,
  buildUser: (o: OppForUser) => string
): Promise<NextResponse> {
  if (!opportunityId) {
    return NextResponse.json({ error: "opportunityId が必要です" }, { status: 400 });
  }
  const guard = await guardOpportunity(opportunityId);
  if (guard.blocked) {
    const status = guard.reason?.includes("見つかりません") ? 404 : 403;
    return NextResponse.json({ error: guard.reason }, { status });
  }
  const conf = aiConfigured();
  if (!conf.ok) {
    return NextResponse.json(
      { error: `AI APIキーが未設定です (provider: ${conf.provider})。.env.local を確認してください。` },
      { status: 400 }
    );
  }
  const o = guard.opportunity!;
  const { profileBlock, productsBlock } = await loadAIContext();
  try {
    const opportunityForPrompt = {
      companyName: o.companyName || "",
      personName: o.personName || "",
      industry: o.industry || "",
      rawText: o.rawText || "",
      memo: o.memo || "",
      painHypothesis: o.painHypothesis || "",
      offerHypothesis: o.offerHypothesis || "",
      recommendedOffer: o.recommendedOffer || "",
      lpSourceId: o.lpSourceId || "",
      lpUrl: o.lpUrl || "",
    };
    const { text, model } = await callAIText(
      buildSystem(profileBlock, productsBlock, opportunityForPrompt),
      buildUser(opportunityForPrompt)
    );
    const draft = await prisma.outreachDraft.create({
      data: {
        opportunityId,
        type: draftType,
        body: text,
        model,
        promptVersion: PROMPT_VERSION,
      },
    });
    return NextResponse.json({ draft });
  } catch (e) {
    const msg = e instanceof AIError ? e.message : "生成中にエラーが発生しました";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
