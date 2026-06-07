import { prisma } from "./db";

export interface OppLite {
  id: string;
  companyName: string;
  sourceType: string;
  priority: string;
  fitScore: number | null;
  status: string;
  recommendedOffer: string;
  nextAction: string;
  nextActionAt: string | null;
  createdAt: string;
}

export interface DashboardBuckets {
  toApply: OppLite[]; // 今日応募すべき案件
  toContact: OppLite[]; // 今日連絡すべき候補
  toReferral: OppLite[]; // 今日紹介依頼を送る相手
  toFollowUp: OppLite[]; // 今日追客すべき相手
  meetingCandidates: OppLite[]; // 商談化候補
  freeDiagnosis: OppLite[]; // 無料診断に進める候補
  won: OppLite[];
  lost: OppLite[];
  totalActive: number;
}

function lite(o: {
  id: string;
  companyName: string;
  sourceType: string;
  priority: string;
  fitScore: number | null;
  status: string;
  recommendedOffer: string;
  nextAction: string;
  nextActionAt: Date | null;
  createdAt: Date;
}): OppLite {
  return {
    id: o.id,
    companyName: o.companyName,
    sourceType: o.sourceType,
    priority: o.priority,
    fitScore: o.fitScore,
    status: o.status,
    recommendedOffer: o.recommendedOffer,
    nextAction: o.nextAction,
    nextActionAt: o.nextActionAt ? o.nextActionAt.toISOString() : null,
    createdAt: o.createdAt.toISOString(),
  };
}

export async function getDashboardBuckets(): Promise<DashboardBuckets> {
  const all = await prisma.opportunity.findMany({
    where: { doNotContact: false },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });
  const items = all.map(lite);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const dueToday = (o: OppLite) => !o.nextActionAt || new Date(o.nextActionAt) <= endOfToday;

  const isFreeDiagnosisOffer = (o: OppLite) =>
    /無料|診断|相談/.test(o.recommendedOffer);

  return {
    toApply: items.filter((o) => o.status === "apply_ready" && dueToday(o)),
    toContact: items.filter((o) => o.status === "contact_ready" && dueToday(o)),
    toReferral: items.filter(
      (o) => o.sourceType === "referral" && ["new", "analyzed", "contact_ready"].includes(o.status)
    ),
    toFollowUp: items.filter((o) => o.status === "follow_up" && dueToday(o)),
    meetingCandidates: items.filter((o) => o.status === "meeting_candidate"),
    freeDiagnosis: items.filter(
      (o) => isFreeDiagnosisOffer(o) && ["analyzed", "contact_ready", "apply_ready"].includes(o.status)
    ),
    won: all.filter((o) => o.status === "won").map(lite),
    lost: all.filter((o) => o.status === "lost").map(lite),
    totalActive: items.filter((o) => !["won", "lost", "not_fit"].includes(o.status)).length,
  };
}

// won/lost は doNotContact=false に限らず全件カウントしたいので別取得
export async function getWonLostCounts(): Promise<{ won: number; lost: number }> {
  const [won, lost] = await Promise.all([
    prisma.opportunity.count({ where: { status: "won" } }),
    prisma.opportunity.count({ where: { status: "lost" } }),
  ]);
  return { won, lost };
}
