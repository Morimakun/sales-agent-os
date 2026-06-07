"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
  OUTREACH_DRAFT_LABELS,
} from "@/lib/constants";
import { PriorityBadge, RiskBadge } from "@/components/Badges";
import CopyButton from "@/components/CopyButton";

interface Opp {
  id: string;
  sourceType: string;
  sourceName: string;
  url: string;
  rawText: string;
  companyName: string;
  personName: string;
  industry: string;
  budgetHint: string;
  candidateType: string;
  referrerName: string;
  painPoints: string;
  tools: string;
  temperature: string;
  memo: string;
  fitScore: number | null;
  priority: string;
  status: string;
  painHypothesis: string;
  offerHypothesis: string;
  recommendedOffer: string;
  reason: string;
  nextAction: string;
  doNotContact: boolean;
  createdAt: string;
}

interface Draft {
  id: string;
  type: string;
  title: string;
  body: string;
  riskLevel: string;
  createdAt: string;
}

const GEN_ACTIONS: { key: string; endpoint: string; label: string }[] = [
  { key: "application", endpoint: "generate-application", label: "応募文を生成" },
  { key: "first_contact", endpoint: "generate-first-contact", label: "初回連絡文を生成" },
  { key: "referral_request", endpoint: "generate-referral-request", label: "紹介依頼文を生成" },
  { key: "free_diagnosis_offer", endpoint: "generate-free-diagnosis", label: "無料診断オファー文を生成" },
  { key: "follow_up", endpoint: "generate-outreach-follow-up", label: "追客文を生成" },
];

export default function OpportunityDetail({
  o,
  drafts,
  autoAnalyze,
}: {
  o: Opp;
  drafts: Draft[];
  autoAnalyze: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const analyzed = useRef(false);

  const blocked = o.doNotContact || o.status === "do_not_contact";

  async function analyze() {
    setBusy("analyze");
    setError(null);
    try {
      const res = await fetch(`/api/ai/analyze-opportunity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: o.id }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "分析に失敗しました");
      else router.refresh();
    } catch {
      setError("分析に失敗しました");
    }
    setBusy(null);
  }

  async function generate(endpoint: string, key: string) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(`/api/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: o.id }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "生成に失敗しました");
      else router.refresh();
    } catch {
      setError("生成に失敗しました");
    }
    setBusy(null);
  }

  async function patch(body: Record<string, unknown>) {
    await fetch(`/api/opportunities/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  useEffect(() => {
    if (autoAnalyze && !analyzed.current) {
      analyzed.current = true;
      analyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAnalyze]);

  const isAnalyzed = o.fitScore !== null || o.priority !== "unknown";
  const card = "bg-white border border-slate-200 rounded-lg p-4";

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-xl font-bold">{o.companyName || "(名称未設定)"}</h1>
          <p className="text-sm text-slate-500">
            {OPPORTUNITY_SOURCE_LABELS[o.sourceType]} {o.sourceName && `· ${o.sourceName}`} · 登録 {o.createdAt.slice(0, 10)}
          </p>
        </div>
        <PriorityBadge priority={o.priority} />
      </div>

      {blocked && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          この案件候補は <b>連絡停止 (do_not_contact)</b> に設定されています。文面生成・連絡操作はできません。
        </div>
      )}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* アクション */}
      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">アクション</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={analyze} disabled={busy !== null} className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
            {busy === "analyze" ? "分析中…" : "AI分析する"}
          </button>
          {GEN_ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => generate(a.endpoint, a.key)}
              disabled={busy !== null || blocked}
              title={blocked ? "連絡停止のため生成できません" : ""}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm disabled:opacity-40"
            >
              {busy === a.key ? "生成中…" : a.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-3 pt-3 border-t border-slate-100">
          <label className="text-sm text-slate-500">ステータス:</label>
          <select
            value={o.status}
            onChange={(e) => patch({ status: e.target.value })}
            className="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
          >
            {OPPORTUNITY_STATUSES.map((s) => <option key={s} value={s}>{OPPORTUNITY_STATUS_LABELS[s]}</option>)}
          </select>
          <label className="text-sm flex items-center gap-1 ml-2">
            <input type="checkbox" checked={o.doNotContact} onChange={(e) => patch({ doNotContact: e.target.checked })} />
            連絡停止 (do_not_contact)
          </label>
        </div>
      </div>

      {/* AI分析結果 */}
      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">AI分析結果</h2>
        {!isAnalyzed ? (
          <p className="text-sm text-slate-400">まだ分析していません。「AI分析する」を押してください。</p>
        ) : (
          <div className="text-sm space-y-1">
            <p><span className="text-slate-400">適合度スコア:</span> {o.fitScore ?? "—"} / 100</p>
            <p><span className="text-slate-400">推奨オファー:</span> {o.recommendedOffer || "—"}</p>
            <p><span className="text-slate-400">課題仮説:</span> {o.painHypothesis || "—"}</p>
            <p><span className="text-slate-400">提供価値仮説:</span> {o.offerHypothesis || "—"}</p>
            <p><span className="text-slate-400">判定理由:</span> {o.reason || "—"}</p>
            <p><span className="text-slate-400">次アクション:</span> {o.nextAction || "—"}</p>
          </div>
        )}
      </div>

      {/* 案件情報 */}
      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">案件情報</h2>
        <div className="text-sm space-y-1">
          {o.url && <p><span className="text-slate-400">URL:</span> <a href={o.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all underline">{o.url}</a></p>}
          {o.personName && <p><span className="text-slate-400">担当者:</span> {o.personName}</p>}
          {o.industry && <p><span className="text-slate-400">業種:</span> {o.industry}</p>}
          {o.budgetHint && <p><span className="text-slate-400">予算ヒント:</span> {o.budgetHint}</p>}
          <p><span className="text-slate-400">営業対象:</span> {o.candidateType === "y" ? `Y：紹介経由（紹介元：${o.referrerName || "不明"}）` : "Z：完全新規"}</p>
          {o.painPoints && <p><span className="text-slate-400">困りごと仮説:</span> {o.painPoints.split("\n").join(" / ")}</p>}
          {o.tools && <p><span className="text-slate-400">使っているツール:</span> {o.tools}</p>}
          <p><span className="text-slate-400">温度感:</span> {o.temperature === "high" ? "高（今すぐ探している）" : o.temperature === "low" ? "低（情報収集）" : "中（悩んでいる）"}</p>
          {o.memo && <p><span className="text-slate-400">メモ:</span> {o.memo}</p>}
        </div>
        {o.rawText && (
          <div className="mt-2">
            <p className="text-slate-400 text-sm mb-1">本文:</p>
            <pre className="whitespace-pre-wrap text-sm bg-slate-50 border border-slate-100 rounded p-2 max-h-60 overflow-auto">{o.rawText}</pre>
          </div>
        )}
      </div>

      {/* 生成文面 */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm">生成された文面</h2>
        {drafts.length === 0 && <p className="text-sm text-slate-400">まだ文面はありません。</p>}
        {drafts.map((d) => (
          <div key={d.id} className={card}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{OUTREACH_DRAFT_LABELS[d.type] || d.type}</span>
                <RiskBadge level={d.riskLevel} />
                <span className="text-xs text-slate-400">{d.createdAt.slice(0, 16).replace("T", " ")}</span>
              </div>
              <CopyButton text={d.body} />
            </div>
            <pre className="whitespace-pre-wrap text-sm bg-slate-50 border border-slate-100 rounded p-3">{d.body}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
