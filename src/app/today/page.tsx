import Link from "next/link";
import { getDashboardBuckets } from "@/lib/dashboard";
import TodayItem from "./TodayItem";
import type { OppLite } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

function Section({ title, items, hint }: { title: string; items: OppLite[]; hint: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-sm">
          {title} <span className="text-slate-400">({items.length})</span>
        </h2>
      </div>
      <p className="text-xs text-slate-400 mb-1">{hint}</p>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400 py-2">対象なし</p>
      ) : (
        items.map((o) => <TodayItem key={o.id} o={o} />)
      )}
    </div>
  );
}

export default async function TodayPage() {
  const b = await getDashboardBuckets();
  const total =
    b.toApply.length + b.toContact.length + b.toReferral.length + b.toFollowUp.length + b.meetingCandidates.length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">今日のアクション</h1>
        <p className="text-sm text-slate-500">今日対応すべき案件候補だけを表示します。合計 {total} 件。</p>
      </div>

      <Section title="今日応募すべき案件" items={b.toApply} hint="応募準備OK。応募文を確認してコピー→手動応募。" />
      <Section title="今日連絡すべき候補" items={b.toContact} hint="連絡準備OK。初回連絡文を確認してコピー→手動送信。" />
      <Section title="今日紹介依頼を送る相手" items={b.toReferral} hint="紹介ソースの候補。紹介依頼文を確認してコピー。" />
      <Section title="今日追客すべき相手" items={b.toFollowUp} hint="追客予定。追客文を確認してコピー。しつこくしない。" />
      <Section title="商談化候補" items={b.meetingCandidates} hint="商談につながりそうな候補。準備を進める。" />

      <div className="text-sm">
        <Link href="/opportunities/new" className="text-blue-600 hover:underline">＋ 新しい案件候補を登録する</Link>
      </div>
    </div>
  );
}
