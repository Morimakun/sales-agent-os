"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
  OUTREACH_DRAFT_LABELS,
} from "@/lib/constants";
import { buildTelecomDemoLpUrl } from "@/lib/telecom";
import { PriorityBadge, RiskBadge } from "@/components/Badges";
import CopyButton from "@/components/CopyButton";

type TrackingState = {
  sentAt: string;
  sentChannel: string;
  sentTo: string;
  sentUrl: string;
  sentMessage: string;
  replyStatus: string;
  lastReplyAt: string;
  replySummary: string;
  replyBody: string;
  nextAction: string;
  nextActionDate: string;
  lpSourceId: string;
  lpUrl: string;
  lpVisited: boolean;
  lpFormSubmitted: boolean;
  difyOpened: boolean;
};

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
  sentAt: string | null;
  sentChannel: string;
  sentTo: string;
  sentUrl: string;
  sentMessage: string;
  replyStatus: string;
  lastReplyAt: string | null;
  replySummary: string;
  replyBody: string;
  nextActionDate: string | null;
  lpSourceId: string;
  lpUrl: string;
  lpVisited: boolean;
  lpFormSubmitted: boolean;
  difyOpened: boolean;
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
  { key: "application", endpoint: "generate-application", label: "蠢懷供譁・ｒ逕滓・" },
  { key: "first_contact", endpoint: "generate-first-contact", label: "蛻晏屓騾｣邨｡譁・ｒ逕滓・" },
  { key: "referral_request", endpoint: "generate-referral-request", label: "邏ｹ莉倶ｾ晞ｼ譁・ｒ逕滓・" },
  { key: "free_diagnosis_offer", endpoint: "generate-free-diagnosis", label: "辟｡譁呵ｨｺ譁ｭ繧ｪ繝輔ぃ繝ｼ譁・ｒ逕滓・" },
  { key: "follow_up", endpoint: "generate-outreach-follow-up", label: "霑ｽ螳｢譁・ｒ逕滓・" },
];

const REPLY_STATUS_OPTIONS = [
  { value: "none", label: "なし" },
  { value: "replied", label: "返信あり" },
  { value: "interested", label: "興味あり" },
  { value: "question", label: "質問あり" },
  { value: "not_interested", label: "不要" },
  { value: "do_not_contact", label: "配信停止" },
  { value: "bounced", label: "不達" },
  { value: "needs_followup", label: "要フォロー" },
];

const SENT_CHANNEL_OPTIONS = [
  { value: "", label: "未設定" },
  { value: "form", label: "フォーム" },
  { value: "email", label: "メール" },
  { value: "dm", label: "DM" },
  { value: "other", label: "その他" },
];

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}

function toDateValue(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function toIsoOrNull(value: string) {
  if (!value) return null;
  return new Date(value).toISOString();
}

function initTracking(o: Opp): TrackingState {
  return {
    sentAt: toDatetimeLocal(o.sentAt),
    sentChannel: o.sentChannel || "",
    sentTo: o.sentTo || "",
    sentUrl: o.sentUrl || "",
    sentMessage: o.sentMessage || "",
    replyStatus: o.replyStatus || "none",
    lastReplyAt: toDatetimeLocal(o.lastReplyAt),
    replySummary: o.replySummary || "",
    replyBody: o.replyBody || "",
    nextAction: o.nextAction || "",
    nextActionDate: toDateValue(o.nextActionDate),
    lpSourceId: o.lpSourceId || "",
    lpUrl: o.lpUrl || "",
    lpVisited: o.lpVisited || false,
    lpFormSubmitted: o.lpFormSubmitted || false,
    difyOpened: o.difyOpened || false,
  };
}

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
  const [tracking, setTracking] = useState<TrackingState>(() => initTracking(o));
  const analyzed = useRef(false);

  const blocked = o.doNotContact || o.status === "do_not_contact";
  const isAnalyzed = o.fitScore !== null || o.priority !== "unknown";
  const card = "bg-white border border-slate-200 rounded-lg p-4";

  async function analyze() {
    setBusy("analyze");
    setError(null);
    try {
      const res = await fetch("/api/ai/analyze-opportunity", {
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

  async function saveTracking() {
    setBusy("tracking");
    setError(null);
    const fallbackLpUrl = buildTelecomDemoLpUrl(tracking.lpSourceId || undefined);
    const payload = {
      sentAt: toIsoOrNull(tracking.sentAt),
      sentChannel: tracking.sentChannel,
      sentTo: tracking.sentTo,
      sentUrl: tracking.sentUrl.trim() || fallbackLpUrl,
      sentMessage: tracking.sentMessage,
      replyStatus: tracking.replyStatus,
      lastReplyAt: toIsoOrNull(tracking.lastReplyAt),
      replySummary: tracking.replySummary,
      replyBody: tracking.replyBody,
      nextAction: tracking.nextAction,
      nextActionDate: tracking.nextActionDate ? toIsoOrNull(`${tracking.nextActionDate}T00:00:00`) : null,
      lpSourceId: tracking.lpSourceId,
      lpUrl: tracking.lpUrl.trim() || fallbackLpUrl,
      lpVisited: tracking.lpVisited,
      lpFormSubmitted: tracking.lpFormSubmitted,
      difyOpened: tracking.difyOpened,
    };
    try {
      await patch(payload);
      setTracking((prev) => ({
        ...prev,
        sentUrl: String(payload.sentUrl || ""),
        lpUrl: String(payload.lpUrl || ""),
      }));
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    if (autoAnalyze && !analyzed.current) {
      analyzed.current = true;
      analyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAnalyze]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h1 className="text-xl font-bold">{o.companyName || "(名称未設定)"}</h1>
          <p className="text-sm text-slate-500">
            {OPPORTUNITY_SOURCE_LABELS[o.sourceType] || o.sourceType}
            {o.sourceName ? ` / ${o.sourceName}` : ""}
            {" / "}
            {o.createdAt.slice(0, 10)}
          </p>
        </div>
        <PriorityBadge priority={o.priority} />
      </div>

      {blocked && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          この案件は <b>do_not_contact</b> に設定されています。下書き生成や送信は行えません。
        </div>
      )}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">アクション</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={analyze} disabled={busy !== null} className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
            {busy === "analyze" ? "分析中…" : "AI分析をする"}
          </button>
          {GEN_ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => generate(a.endpoint, a.key)}
              disabled={busy !== null || blocked}
              title={blocked ? "do_not_contact のため生成できません" : ""}
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
            {OPPORTUNITY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {OPPORTUNITY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <label className="text-sm flex items-center gap-1 ml-2">
            <input type="checkbox" checked={o.doNotContact} onChange={(e) => patch({ doNotContact: e.target.checked })} />
            do_not_contact
          </label>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">AI分析結果</h2>
        {!isAnalyzed ? (
          <p className="text-sm text-slate-400">まだ分析していません。AI分析をするを押してください。</p>
        ) : (
          <div className="text-sm space-y-1">
            <p><span className="text-slate-400">スコア:</span> {o.fitScore ?? "—"} / 100</p>
            <p><span className="text-slate-400">推奨オファー:</span> {o.recommendedOffer || "—"}</p>
            <p><span className="text-slate-400">課題仮説:</span> {o.painHypothesis || "—"}</p>
            <p><span className="text-slate-400">価値仮説:</span> {o.offerHypothesis || "—"}</p>
            <p><span className="text-slate-400">理由:</span> {o.reason || "—"}</p>
            <p><span className="text-slate-400">次アクション:</span> {o.nextAction || "—"}</p>
          </div>
        )}
      </div>

      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">送信後管理</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">
            送信日
            <input type="datetime-local" className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.sentAt} onChange={(e) => setTracking({ ...tracking, sentAt: e.target.value })} />
          </label>
          <label className="text-sm">
            送信チャネル
            <select className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={tracking.sentChannel} onChange={(e) => setTracking({ ...tracking, sentChannel: e.target.value })}>
              {SENT_CHANNEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            送信先
            <input className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.sentTo} onChange={(e) => setTracking({ ...tracking, sentTo: e.target.value })} />
          </label>
          <label className="text-sm">
            送信LP URL
            <input className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.sentUrl} onChange={(e) => setTracking({ ...tracking, sentUrl: e.target.value })} placeholder="https://telecom-staff-ai-demo.vercel.app/?src=..." />
          </label>
          <label className="text-sm md:col-span-2">
            送信本文
            <textarea className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" rows={4} value={tracking.sentMessage} onChange={(e) => setTracking({ ...tracking, sentMessage: e.target.value })} />
          </label>
          <label className="text-sm">
            返信ステータス
            <select className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={tracking.replyStatus} onChange={(e) => setTracking({ ...tracking, replyStatus: e.target.value })}>
              {REPLY_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            返信日
            <input type="datetime-local" className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.lastReplyAt} onChange={(e) => setTracking({ ...tracking, lastReplyAt: e.target.value })} />
          </label>
          <label className="text-sm md:col-span-2">
            返信要約
            <input className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.replySummary} onChange={(e) => setTracking({ ...tracking, replySummary: e.target.value })} />
          </label>
          <label className="text-sm md:col-span-2">
            返信原文
            <textarea className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" rows={4} value={tracking.replyBody} onChange={(e) => setTracking({ ...tracking, replyBody: e.target.value })} />
          </label>
          <label className="text-sm md:col-span-2">
            次回アクション
            <input className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.nextAction} onChange={(e) => setTracking({ ...tracking, nextAction: e.target.value })} />
          </label>
          <label className="text-sm">
            次回対応日
            <input type="date" className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.nextActionDate} onChange={(e) => setTracking({ ...tracking, nextActionDate: e.target.value })} />
          </label>
          <label className="text-sm">
            LP source ID
            <input className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.lpSourceId} onChange={(e) => setTracking({ ...tracking, lpSourceId: e.target.value })} placeholder="heartland / bellpark / t-gaia" />
          </label>
          <label className="text-sm md:col-span-2">
            LP URL
            <input className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-sm" value={tracking.lpUrl} onChange={(e) => setTracking({ ...tracking, lpUrl: e.target.value })} placeholder={buildTelecomDemoLpUrl(tracking.lpSourceId || undefined)} />
          </label>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={tracking.lpVisited} onChange={(e) => setTracking({ ...tracking, lpVisited: e.target.checked })} />
            LP訪問
          </label>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={tracking.lpFormSubmitted} onChange={(e) => setTracking({ ...tracking, lpFormSubmitted: e.target.checked })} />
            フォーム送信
          </label>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={tracking.difyOpened} onChange={(e) => setTracking({ ...tracking, difyOpened: e.target.checked })} />
            Dify閲覧
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <button
            onClick={saveTracking}
            disabled={busy === "tracking"}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50"
          >
            {busy === "tracking" ? "保存中…" : "送信後情報を保存"}
          </button>
          <span className="text-xs text-slate-500">
            入力済みの LP source ID から `?src=` 付き URL を自動補完します。
          </span>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-sm mb-2">案件情報</h2>
        <div className="text-sm space-y-1">
          {o.url && (
            <p>
              <span className="text-slate-400">URL:</span>{" "}
              <a href={o.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all underline">
                {o.url}
              </a>
            </p>
          )}
          {o.personName && <p><span className="text-slate-400">担当者:</span> {o.personName}</p>}
          {o.industry && <p><span className="text-slate-400">業種:</span> {o.industry}</p>}
          {o.budgetHint && <p><span className="text-slate-400">予算ヒント:</span> {o.budgetHint}</p>}
          <p>
            <span className="text-slate-400">候補種別:</span>{" "}
            {o.candidateType === "y" ? `Y: 紹介・既存接点あり / ${o.referrerName || "紹介元なし"}` : "Z: 新規候補"}
          </p>
          {o.painPoints && <p><span className="text-slate-400">課題メモ:</span> {o.painPoints.split("\n").join(" / ")}</p>}
          {o.tools && <p><span className="text-slate-400">使用ツール:</span> {o.tools}</p>}
          <p>
            <span className="text-slate-400">温度感:</span>{" "}
            {o.temperature === "high" ? "高" : o.temperature === "low" ? "低" : "中"}
          </p>
          {o.memo && <p><span className="text-slate-400">メモ:</span> {o.memo}</p>}
        </div>
        {o.rawText && (
          <div className="mt-2">
            <p className="text-slate-400 text-sm mb-1">原文</p>
            <pre className="whitespace-pre-wrap text-sm bg-slate-50 border border-slate-100 rounded p-2 max-h-60 overflow-auto">{o.rawText}</pre>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-sm">生成済み下書き</h2>
        {drafts.length === 0 && <p className="text-sm text-slate-400">まだ下書きはありません。</p>}
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
