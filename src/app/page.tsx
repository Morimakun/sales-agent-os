import Link from "next/link";
import { getDashboardBuckets } from "@/lib/dashboard";
import { aiConfigured } from "@/lib/ai";
import { OPPORTUNITY_SOURCE_LABELS } from "@/lib/constants";
import { PriorityBadge } from "@/components/Badges";
import type { OppLite } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

function MiniList({ items, empty }: { items: OppLite[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-slate-400">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {items.slice(0, 5).map((o) => (
        <li key={o.id} className="flex items-center gap-2 text-sm">
          <PriorityBadge priority={o.priority} />
          <Link href={`/opportunities/${o.id}`} className="font-medium hover:underline truncate">
            {o.companyName || "(名称未設定)"}
          </Link>
          <span className="text-slate-400 text-xs">{OPPORTUNITY_SOURCE_LABELS[o.sourceType]}</span>
        </li>
      ))}
      {items.length > 5 && <li className="text-xs text-slate-400">他 {items.length - 5} 件</li>}
    </ul>
  );
}

function Card({
  title,
  count,
  children,
  href,
  accent,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  href?: string;
  accent: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-sm">{title}</h2>
        <span className={`text-2xl font-bold ${accent}`}>{count}</span>
      </div>
      {children}
      {href && (
        <Link href={href} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
          一覧を見る →
        </Link>
      )}
    </div>
  );
}

export default async function Dashboard() {
  const b = await getDashboardBuckets();
  const conf = aiConfigured();

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">ダッシュボード</h1>
      <p className="text-sm text-slate-500 mb-4">
        案件候補を中心に、今日やるべきことを表示します。アクティブな案件候補: {b.totalActive} 件
      </p>

      {!conf.ok && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm mb-4">
          AI APIキーが未設定です (provider: {conf.provider})。候補登録・一覧は使えますが、AI分析・文面生成には{" "}
          <code className="bg-amber-100 px-1 rounded">.env.local</code> でのキー設定が必要です。
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card title="今日応募すべき案件" count={b.toApply.length} accent="text-red-600" href="/opportunities?status=apply_ready">
          <MiniList items={b.toApply} empty="応募準備OKの案件はありません" />
        </Card>
        <Card title="今日連絡すべき候補" count={b.toContact.length} accent="text-orange-600" href="/opportunities?status=contact_ready">
          <MiniList items={b.toContact} empty="連絡準備OKの候補はありません" />
        </Card>
        <Card title="今日紹介依頼を送る相手" count={b.toReferral.length} accent="text-purple-600" href="/opportunities?sourceType=referral">
          <MiniList items={b.toReferral} empty="紹介ソースの候補はありません" />
        </Card>
        <Card title="今日追客すべき相手" count={b.toFollowUp.length} accent="text-blue-600" href="/opportunities?status=follow_up">
          <MiniList items={b.toFollowUp} empty="追客予定はありません" />
        </Card>
        <Card title="商談化候補" count={b.meetingCandidates.length} accent="text-emerald-600" href="/opportunities?status=meeting_candidate">
          <MiniList items={b.meetingCandidates} empty="商談化候補はありません" />
        </Card>
        <Card title="無料診断に進める候補" count={b.freeDiagnosis.length} accent="text-teal-600">
          <MiniList items={b.freeDiagnosis} empty="無料診断オファー向けの候補はありません" />
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Card title="受注" count={b.won.length} accent="text-green-600" href="/opportunities?status=won">
          <span className="text-sm text-slate-400">獲得済みの案件</span>
        </Card>
        <Card title="失注" count={b.lost.length} accent="text-slate-500" href="/opportunities?status=lost">
          <span className="text-sm text-slate-400">見送りになった案件</span>
        </Card>
      </div>

      <div className="mt-5 flex gap-2">
        <Link href="/opportunities/new" className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm">
          ＋ 案件候補を登録
        </Link>
        <Link href="/today" className="px-4 py-2 border border-slate-300 rounded-md text-sm">
          今日のアクションを見る
        </Link>
      </div>
    </div>
  );
}
