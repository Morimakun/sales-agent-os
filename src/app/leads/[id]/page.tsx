import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import LeadDetail from "./LeadDetail";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = await prisma.lead.findUnique({
    where: { id },
    include: {
      aiOutputs: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!l) notFound();

  return (
    <LeadDetail
      l={{
        id: l.id,
        companyName: l.companyName,
        contactName: l.contactName,
        email: l.email,
        websiteUrl: l.websiteUrl,
        contactFormUrl: l.contactFormUrl,
        industry: l.industry,
        area: l.area,
        source: l.source,
        memo: l.memo,
        status: l.status,
        priority: l.priority,
        score: l.score,
        painHypothesis: l.painHypothesis,
        offerHypothesis: l.offerHypothesis,
        doNotContact: l.doNotContact,
      }}
      outputs={l.aiOutputs.map((a) => ({
        id: a.id,
        type: a.type,
        content: a.content,
        riskLevel: a.riskLevel,
        createdAt: a.createdAt.toISOString(),
      }))}
      activities={l.activities.map((a) => ({ id: a.id, type: a.type, note: a.note, createdAt: a.createdAt.toISOString() }))}
    />
  );
}
