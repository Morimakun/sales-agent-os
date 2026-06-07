"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PriorityBadge } from "@/components/Badges";
import { OPPORTUNITY_SOURCE_LABELS } from "@/lib/constants";
import type { OppLite } from "@/lib/dashboard";

export default function TodayItem({ o }: { o: OppLite }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function complete() {
    setBusy(true);
    await fetch(`/api/opportunities/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "contacted", nextActionAt: null }),
    });
    setBusy(false);
    setDone(true);
    router.refresh();
  }

  return (
    <div className={`flex items-center gap-2 py-2 border-t border-slate-100 ${done ? "opacity-40" : ""}`}>
      <PriorityBadge priority={o.priority} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{o.companyName || "(名称未設定)"}</div>
        <div className="text-xs text-slate-400 truncate">
          {OPPORTUNITY_SOURCE_LABELS[o.sourceType]}
          {o.recommendedOffer && ` · ${o.recommendedOffer}`}
          {o.nextAction && ` · ${o.nextAction}`}
        </div>
      </div>
      <button onClick={() => router.push(`/opportunities/${o.id}`)} className="px-2.5 py-1 text-xs border border-slate-300 rounded bg-white">
        開く
      </button>
      <button onClick={complete} disabled={busy || done} className="px-2.5 py-1 text-xs border border-slate-300 rounded bg-white disabled:opacity-50">
        {done ? "完了 ✓" : "完了"}
      </button>
    </div>
  );
}
