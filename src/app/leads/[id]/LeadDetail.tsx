"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES } from "@/lib/constants";
import { PriorityBadge, RiskBadge } from "@/components/Badges";
import CopyButton from "@/components/CopyButton";

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  websiteUrl: string;
  contactFormUrl: string;
  industry: string;
  area: string;
  source: string;
  memo: string;
  status: string;
  priority: string;
  score: number | null;
  painHypothesis: string;
  offerHypothesis: string;
  doNotContact: boolean;
}
interface Output {
  id: string;
  type: string;
  content: string;
  riskLevel: string;
  createdAt: string;
}
interface ActivityItem {
  id: string;
  type: string;
  note: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  lead_analysis: "AI分析",
  first_message: "初回営業文",
  contact_form_message: "問い合わせフォーム文",
  follow_up_3days: "追客文(3日)",
  follow_up_7days: "追客文(7日)",
  follow_up_14days: "追客文(14日)",
  meeting_prep: "商談前メモ",
  risk_check: "リスクチェック",
};

export default function LeadDetail({
  l,
  outputs,
  activities,
}: {
  l: Lead;
  outputs: Output[];
  activities: ActivityItem[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const blocked = l.doNotContact || l.status === "do_not_contact";

  async function call(endpoint: string, key: string, body: Record<string, unknown> = {}) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(`/api/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: l.id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "失敗しました");
      else router.refresh();
    } catch {
      setError("失敗しました");
    }
    setBusy(null);
  }

  async function patch(body: Record<string, unknown>) {
    await fetch(`/api/leads/${l.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  const card = "bg-white border border-slate-200 rounded-lg p-4";
  const btn = "px-3 py-1.5 border border-slate-300 rounded-md text-sm disabled:opacity-40";

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold">{l.companyName || "(名称未設定)"}</h1>
          <p className="text-sm text-slate-500">{l.industry} {l.area && `· ${l.area}`} {l.source && `· ${l.source}`}</p>
        </div>
        <PriorityBadge priority={l.priority} />
      </div>

      {blocked && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          このリードは <b>連絡停止</b> です。文面生成・送信操作はできません。
        </div>
      )}
      {error && <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">{error}</div>}

      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">アクション</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => call("analyze-lead", "analyze")} disabled={busy !== null} className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
            {busy === "analyze" ? "分析中…" : "AI分析する"}
          </button>
          <button onClick={() => call("generate-first-message", "first")} disabled={busy !== null || blocked} className={btn}>初回文面を生成</button>
          <button onClick={() => call("generate-contact-form-message", "form")} disabled={busy !== null || blocked} className={btn}>問い合わせフォーム文</button>
          <button onClick={() => call("generate-follow-up", "f3", { stage: "3days" })} disabled={busy !== null || blocked} className={btn}>追客(3日)</button>
          <button onClick={() => call("generate-follow-up", "f7", { stage: "7days" })} disabled={busy !== null || blocked} className={btn}>追客(7日)</button>
          <button onClick={() => call("generate-follow-up", "f14", { stage: "14days" })} disabled={busy !== null || blocked} className={btn}>追客(14日)</button>
          <button onClick={() => call("generate-meeting-prep", "meet")} disabled={busy !== null || blocked} className={btn}>商談メモ</button>
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-3 pt-3 border-t border-slate-100">
          <label className="text-sm text-slate-500">ステータス:</label>
          <select value={l.status} onChange={(e) => patch({ status: e.target.value })} className="border border-slate-300 rounded px-2 py-1 text-sm bg-white">
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="text-sm flex items-center gap-1 ml-2">
            <input type="checkbox" checked={l.doNotContact} onChange={(e) => patch({ doNotContact: e.target.checked })} />
            連絡停止
          </label>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">基本情報</h2>
        <div className="text-sm space-y-1">
          {l.contactName && <p><span className="text-slate-400">担当:</span> {l.contactName}</p>}
          {l.email && <p><span className="text-slate-400">メール:</span> {l.email}</p>}
          {l.websiteUrl && <p><span className="text-slate-400">Web:</span> <a href={l.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{l.websiteUrl}</a></p>}
          {l.score !== null && <p><span className="text-slate-400">スコア:</span> {l.score}</p>}
          {l.painHypothesis && <p><span className="text-slate-400">課題仮説:</span> {l.painHypothesis}</p>}
          {l.offerHypothesis && <p><span className="text-slate-400">提供価値:</span> {l.offerHypothesis}</p>}
          {l.memo && <p><span className="text-slate-400">メモ:</span> {l.memo}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-sm">AI出力</h2>
        {outputs.length === 0 && <p className="text-sm text-slate-400">まだAI出力はありません。</p>}
        {outputs.map((o) => (
          <div key={o.id} className={card}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{TYPE_LABELS[o.type] || o.type}</span>
                <RiskBadge level={o.riskLevel} />
                <span className="text-xs text-slate-400">{o.createdAt.slice(0, 16).replace("T", " ")}</span>
              </div>
              <CopyButton text={o.content} />
            </div>
            <pre className="whitespace-pre-wrap text-sm bg-slate-50 border border-slate-100 rounded p-3">{o.content}</pre>
          </div>
        ))}
      </div>

      {activities.length > 0 && (
        <div className={card}>
          <h2 className="font-semibold text-sm mb-2">活動履歴</h2>
          <ul className="text-sm space-y-1">
            {activities.map((a) => (
              <li key={a.id} className="text-slate-600">
                <span className="text-slate-400">{a.createdAt.slice(0, 16).replace("T", " ")}</span> · {a.type} {a.note && `— ${a.note}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
