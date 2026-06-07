"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
} from "@/lib/constants";
import { PriorityBadge } from "@/components/Badges";

interface Row {
  id: string;
  companyName: string;
  sourceType: string;
  priority: string;
  fitScore: number | null;
  status: string;
  recommendedOffer: string;
  nextAction: string;
  createdAt: string;
}

export default function OpportunityRow({ o }: { o: Row }) {
  const router = useRouter();
  const [status, setStatus] = useState(o.status);
  const [busy, setBusy] = useState(false);

  async function changeStatus(next: string) {
    setBusy(true);
    setStatus(next);
    await fetch(`/api/opportunities/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  const open = () => router.push(`/opportunities/${o.id}`);

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-3 py-2">
        <button onClick={open} className="text-slate-900 font-medium hover:underline text-left">
          {o.companyName || "(名称未設定)"}
        </button>
      </td>
      <td className="px-3 py-2 text-slate-500">{OPPORTUNITY_SOURCE_LABELS[o.sourceType] || o.sourceType}</td>
      <td className="px-3 py-2"><PriorityBadge priority={o.priority} /></td>
      <td className="px-3 py-2">{o.fitScore ?? "—"}</td>
      <td className="px-3 py-2">
        <select
          disabled={busy}
          value={status}
          onChange={(e) => changeStatus(e.target.value)}
          className="border border-slate-200 rounded px-1 py-0.5 text-xs bg-white"
        >
          {OPPORTUNITY_STATUSES.map((s) => (
            <option key={s} value={s}>{OPPORTUNITY_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2 text-slate-600 max-w-[140px] truncate">{o.recommendedOffer || "—"}</td>
      <td className="px-3 py-2 text-slate-600 max-w-[160px] truncate">{o.nextAction || "—"}</td>
      <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{o.createdAt.slice(0, 10)}</td>
    </tr>
  );
}
