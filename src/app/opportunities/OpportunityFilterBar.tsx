"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
} from "@/lib/constants";

export default function OpportunityFilterBar({
  statuses,
  sourceTypes,
  current,
}: {
  statuses: readonly string[];
  sourceTypes: readonly string[];
  current: { status?: string; priority?: string; sourceType?: string; q?: string };
}) {
  const router = useRouter();
  const [q, setQ] = useState(current.q || "");

  function apply(next: Record<string, string | undefined>) {
    const merged = { ...current, ...next };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    router.push(`/opportunities?${params.toString()}`);
  }

  const sel = "border border-slate-300 rounded px-2 py-1 text-sm bg-white";

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select className={sel} value={current.status || ""} onChange={(e) => apply({ status: e.target.value || undefined })}>
        <option value="">ステータス: 全て</option>
        {statuses.map((s) => <option key={s} value={s}>{OPPORTUNITY_STATUS_LABELS[s]}</option>)}
      </select>
      <select className={sel} value={current.priority || ""} onChange={(e) => apply({ priority: e.target.value || undefined })}>
        <option value="">優先度: 全て</option>
        {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
      </select>
      <select className={sel} value={current.sourceType || ""} onChange={(e) => apply({ sourceType: e.target.value || undefined })}>
        <option value="">ソース: 全て</option>
        {sourceTypes.map((s) => <option key={s} value={s}>{OPPORTUNITY_SOURCE_LABELS[s]}</option>)}
      </select>
      <form
        onSubmit={(e) => { e.preventDefault(); apply({ q: q || undefined }); }}
        className="flex gap-1"
      >
        <input className={sel} placeholder="検索 (会社名/本文)" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="px-2 py-1 text-sm border border-slate-300 rounded bg-white">検索</button>
      </form>
      {(current.status || current.priority || current.sourceType || current.q) && (
        <button onClick={() => router.push("/opportunities")} className="px-2 py-1 text-sm text-slate-500 underline">
          クリア
        </button>
      )}
    </div>
  );
}
