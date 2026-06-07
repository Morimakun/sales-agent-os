"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEAD_STATUSES } from "@/lib/constants";
import { PriorityBadge } from "@/components/Badges";

interface Row {
  id: string;
  companyName: string;
  industry: string;
  area: string;
  source: string;
  priority: string;
  status: string;
  hasAnalysis: boolean;
  hasDraft: boolean;
  lastContactedAt: string | null;
}

export default function LeadRow({ o }: { o: Row }) {
  const router = useRouter();
  const [status, setStatus] = useState(o.status);
  const [busy, setBusy] = useState(false);

  async function change(next: string) {
    setBusy(true);
    setStatus(next);
    await fetch(`/api/leads/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-3 py-2">
        <button onClick={() => router.push(`/leads/${o.id}`)} className="font-medium hover:underline text-left">
          {o.companyName || "(名称未設定)"}
        </button>
      </td>
      <td className="px-3 py-2 text-slate-500">{o.industry || "—"}</td>
      <td className="px-3 py-2 text-slate-500">{o.area || "—"}</td>
      <td className="px-3 py-2 text-slate-400">{o.source || "—"}</td>
      <td className="px-3 py-2"><PriorityBadge priority={o.priority} /></td>
      <td className="px-3 py-2">
        <select disabled={busy} value={status} onChange={(e) => change(e.target.value)} className="border border-slate-200 rounded px-1 py-0.5 text-xs bg-white">
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="px-3 py-2 text-xs">{o.hasAnalysis ? "✓" : "—"}</td>
      <td className="px-3 py-2 text-xs">{o.hasDraft ? "✓" : "—"}</td>
      <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{o.lastContactedAt ? o.lastContactedAt.slice(0, 10) : "—"}</td>
    </tr>
  );
}
