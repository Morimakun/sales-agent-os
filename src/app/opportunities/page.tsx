import Link from "next/link";
import { prisma } from "@/lib/db";
import { OPPORTUNITY_STATUSES, OPPORTUNITY_SOURCE_TYPES } from "@/lib/constants";
import OpportunityFilterBar from "./OpportunityFilterBar";
import OpportunityRow from "./OpportunityRow";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; sourceType?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const where: Prisma.OpportunityWhereInput = {};
  if (sp.status) where.status = sp.status;
  if (sp.priority) where.priority = sp.priority;
  if (sp.sourceType) where.sourceType = sp.sourceType;
  if (sp.q) {
    where.OR = [
      { companyName: { contains: sp.q } },
      { rawText: { contains: sp.q } },
      { memo: { contains: sp.q } },
    ];
  }

  const opportunities = await prisma.opportunity.findMany({ where, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Opportunity 一覧</h1>
        <Link href="/opportunities/new" className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm">
          新規追加
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
        <span>エクスポート</span>
        <a href="/api/export/opps-csv" className="text-blue-600 hover:underline">Opportunity CSV</a>
        <a href="/api/export/today-md" className="text-blue-600 hover:underline">今日のアクション MD</a>
        <a href="/api/export/candidates-md" className="text-blue-600 hover:underline">候補 MD</a>
        <a href="/api/export/drafts-md" className="text-blue-600 hover:underline">下書き MD</a>
      </div>

      <OpportunityFilterBar
        statuses={OPPORTUNITY_STATUSES as readonly string[]}
        sourceTypes={OPPORTUNITY_SOURCE_TYPES as readonly string[]}
        current={sp}
      />

      <div className="mt-4 overflow-x-auto bg-white border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2">会社名</th>
              <th className="px-3 py-2">ソース</th>
              <th className="px-3 py-2">優先度</th>
              <th className="px-3 py-2">スコア</th>
              <th className="px-3 py-2">ステータス</th>
              <th className="px-3 py-2">送信</th>
              <th className="px-3 py-2">返信</th>
              <th className="px-3 py-2">次回対応日</th>
              <th className="px-3 py-2">LP</th>
              <th className="px-3 py-2">推奨オファー</th>
              <th className="px-3 py-2">次アクション</th>
              <th className="px-3 py-2">作成日</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 && (
              <tr>
                <td colSpan={12} className="px-3 py-6 text-center text-slate-400">
                  まだ案件がありません
                </td>
              </tr>
            )}
            {opportunities.map((o) => (
              <OpportunityRow
                key={o.id}
                o={{
                  id: o.id,
                  companyName: o.companyName,
                  sourceType: o.sourceType,
                  priority: o.priority,
                  fitScore: o.fitScore,
                  status: o.status,
                  sentAt: o.sentAt ? o.sentAt.toISOString() : null,
                  replyStatus: o.replyStatus,
                  nextActionDate: o.nextActionDate ? o.nextActionDate.toISOString() : null,
                  lpVisited: o.lpVisited,
                  lpFormSubmitted: o.lpFormSubmitted,
                  difyOpened: o.difyOpened,
                  recommendedOffer: o.recommendedOffer,
                  nextAction: o.nextAction,
                  createdAt: o.createdAt.toISOString(),
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
