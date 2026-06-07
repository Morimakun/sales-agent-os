import Link from "next/link";
import { prisma } from "@/lib/db";
import LeadRow from "./LeadRow";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const where: Prisma.LeadWhereInput = {};
  if (sp.status) where.status = sp.status;
  if (sp.priority) where.priority = sp.priority;
  if (sp.q) where.OR = [{ companyName: { contains: sp.q } }, { memo: { contains: sp.q } }];

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { aiOutputs: { select: { type: true } } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">リード一覧 (CSV営業リスト・副次)</h1>
        <Link href="/upload" className="px-3 py-1.5 border border-slate-300 rounded-md text-sm">CSV取込</Link>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2">会社名</th>
              <th className="px-3 py-2">業種</th>
              <th className="px-3 py-2">地域</th>
              <th className="px-3 py-2">ソース</th>
              <th className="px-3 py-2">優先度</th>
              <th className="px-3 py-2">ステータス</th>
              <th className="px-3 py-2">分析</th>
              <th className="px-3 py-2">文面</th>
              <th className="px-3 py-2">最終接触</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-slate-400">リードがありません。CSVを取り込んでください。</td></tr>
            )}
            {leads.map((l) => (
              <LeadRow key={l.id} o={{
                id: l.id,
                companyName: l.companyName,
                industry: l.industry,
                area: l.area,
                source: l.source,
                priority: l.priority,
                status: l.status,
                hasAnalysis: l.aiOutputs.some((a) => a.type === "lead_analysis"),
                hasDraft: l.aiOutputs.some((a) => a.type !== "lead_analysis" && a.type !== "risk_check"),
                lastContactedAt: l.lastContactedAt ? l.lastContactedAt.toISOString() : null,
              }} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
