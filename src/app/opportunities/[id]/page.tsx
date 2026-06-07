import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import OpportunityDetail from "./OpportunityDetail";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ analyze?: string }>;
}) {
  const { id } = await params;
  const { analyze } = await searchParams;
  const o = await prisma.opportunity.findUnique({
    where: { id },
    include: { drafts: { orderBy: { createdAt: "desc" } } },
  });
  if (!o) notFound();

  return (
    <OpportunityDetail
      autoAnalyze={analyze === "1"}
      o={{
        id: o.id,
        sourceType: o.sourceType,
        sourceName: o.sourceName,
        url: o.url,
        rawText: o.rawText,
        companyName: o.companyName,
        personName: o.personName,
        industry: o.industry,
        budgetHint: o.budgetHint,
        candidateType: o.candidateType,
        referrerName: o.referrerName,
        painPoints: o.painPoints,
        tools: o.tools,
        temperature: o.temperature,
        memo: o.memo,
        fitScore: o.fitScore,
        priority: o.priority,
        status: o.status,
        painHypothesis: o.painHypothesis,
        offerHypothesis: o.offerHypothesis,
        recommendedOffer: o.recommendedOffer,
        reason: o.reason,
        nextAction: o.nextAction,
        sentAt: o.sentAt ? o.sentAt.toISOString() : null,
        sentChannel: o.sentChannel,
        sentTo: o.sentTo,
        sentUrl: o.sentUrl,
        sentMessage: o.sentMessage,
        replyStatus: o.replyStatus,
        lastReplyAt: o.lastReplyAt ? o.lastReplyAt.toISOString() : null,
        replySummary: o.replySummary,
        replyBody: o.replyBody,
        nextActionDate: o.nextActionDate ? o.nextActionDate.toISOString() : null,
        lpSourceId: o.lpSourceId,
        lpUrl: o.lpUrl,
        lpVisited: o.lpVisited,
        lpFormSubmitted: o.lpFormSubmitted,
        difyOpened: o.difyOpened,
        doNotContact: o.doNotContact,
        createdAt: o.createdAt.toISOString(),
      }}
      drafts={o.drafts.map((d) => ({
        id: d.id,
        type: d.type,
        title: d.title,
        body: d.body,
        riskLevel: d.riskLevel,
        createdAt: d.createdAt.toISOString(),
      }))}
    />
  );
}
