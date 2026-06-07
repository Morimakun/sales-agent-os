"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OPPORTUNITY_SOURCE_TYPES, OPPORTUNITY_SOURCE_LABELS, TELECOM_AGENCY_Z_TEMPLATE } from "@/lib/constants";

const RESEARCH_CHECKLIST = [
  "通信商材を扱っている",
  "携帯ショップ、通信代理店、光回線販売の事業がある",
  "複数店舗を運営している",
  "店舗スタッフ、携帯販売スタッフ、通信販売スタッフの求人がある",
  "料金、規約、キャンペーン説明が多そう",
  "PDFマニュアル、FAQ、料金表、キャンペーン資料がありそう",
  "本部・店舗間の確認業務が多そう",
  "新人スタッフ教育が必要そう",
  "Salesforce、CRM、Google Drive、社内チャットを使っていそう",
  "問い合わせフォームまたは代表メールがある",
  "社長、役員、営業責任者、事業責任者の連絡先が確認できる",
  "営業連絡禁止の記載がない",
  "全国展開、複数拠点、イベント販売など横展開余地がある",
];

export default function NewOpportunityPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    sourceType: "x_post",
    sourceName: "",
    url: "",
    companyName: "",
    personName: "",
    industry: "",
    budgetHint: "",
    rawText: "",
    candidateType: "z",
    referrerName: "",
    painPoints: "",
    tools: "",
    temperature: "medium",
    memo: "",
  });

  function applyTemplate() {
    setForm({
      ...form,
      candidateType: TELECOM_AGENCY_Z_TEMPLATE.candidateType,
      industry: TELECOM_AGENCY_Z_TEMPLATE.industry,
      painPoints: TELECOM_AGENCY_Z_TEMPLATE.painHypothesis,
      tools: TELECOM_AGENCY_Z_TEMPLATE.tools,
      temperature: TELECOM_AGENCY_Z_TEMPLATE.temperature,
    });
  }

  const field = "w-full border border-slate-300 rounded px-3 py-2 text-sm";

  async function submit(analyze: boolean) {
    setBusy(true);
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const { opportunity } = await res.json();
    setBusy(false);
    if (analyze) {
      router.push(`/opportunities/${opportunity.id}?analyze=1`);
    } else {
      router.push(`/opportunities/${opportunity.id}`);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold mb-1">案件候補を登録</h1>
      <p className="text-sm text-slate-500 mb-4">
        見つけた案件・投稿・募集・会社URL・紹介情報を登録します。本文を貼り付けると AI 分析の精度が上がります。
      </p>

      <div className="grid grid-cols-3 gap-4">
        {/* メインフォーム */}
        <div className="col-span-2 space-y-4">
          {/* テンプレボタン */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm font-semibold mb-2">クイック登録テンプレ</p>
            <button
              onClick={applyTemplate}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 disabled:opacity-50"
              disabled={busy}
            >
              通信代理店Zテンプレを適用
            </button>
            <p className="text-xs text-slate-600 mt-2">
              困りごと、ツール、温度感が自動入力されます。会社名・URLを追加してください。
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm">
            情報ソース種別
            <select className={field} value={form.sourceType} onChange={(e) => setForm({ ...form, sourceType: e.target.value })}>
              {OPPORTUNITY_SOURCE_TYPES.map((s) => (
                <option key={s} value={s}>{OPPORTUNITY_SOURCE_LABELS[s]}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            ソース名 (例: クラウドワークス, 〇〇さん紹介)
            <input className={field} value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} />
          </label>
          <label className="text-sm sm:col-span-2">
            URL
            <input className={field} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
          </label>
          <label className="text-sm">
            会社名 / 相手
            <input className={field} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </label>
          <label className="text-sm">
            担当者名
            <input className={field} value={form.personName} onChange={(e) => setForm({ ...form, personName: e.target.value })} />
          </label>
          <label className="text-sm">
            業種
            <input className={field} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="例: 飲食, 美容, 士業" />
          </label>
          <label className="text-sm">
            予算ヒント
            <input className={field} value={form.budgetHint} onChange={(e) => setForm({ ...form, budgetHint: e.target.value })} placeholder="例: 月5万円程度" />
          </label>
          <label className="text-sm">
            営業対象の分類
            <p className="text-xs text-slate-500 mb-1">初回はZ（完全新規）を優先</p>
            <select className={field} value={form.candidateType} onChange={(e) => setForm({ ...form, candidateType: e.target.value })}>
              <option value="z">Z: 完全新規（Google マップ、Instagram、会社HP などから見つけた相手）</option>
              <option value="y">Y: 紹介経由（既知人脈Xからの紹介）</option>
            </select>
          </label>
          <label className="text-sm">
            紹介元X（Y：紹介経由の場合）
            <input className={field} value={form.referrerName} onChange={(e) => setForm({ ...form, referrerName: e.target.value })} placeholder="例: 〇〇さん（友人）" />
          </label>
        </div>
        <label className="text-sm block">
          案件本文 / 投稿本文
          <textarea className={field} rows={6} value={form.rawText} onChange={(e) => setForm({ ...form, rawText: e.target.value })} placeholder="募集文や投稿内容をそのまま貼り付け" />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm">
            困っていそうな作業 (仮説)
            <textarea className={field} rows={3} value={form.painPoints} onChange={(e) => setForm({ ...form, painPoints: e.target.value })} placeholder="例: メール返信が多い\nExcel作業が手作業" />
          </label>
          <label className="text-sm">
            使っているツール
            <textarea className={field} rows={3} value={form.tools} onChange={(e) => setForm({ ...form, tools: e.target.value })} placeholder="例: Gmail, Excel\nLINE" />
          </label>
          <label className="text-sm">
            温度感（購買意欲）
            <select className={field} value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })}>
              <option value="high">高（今すぐ探している）</option>
              <option value="medium">中（悩んでいる）</option>
              <option value="low">低（情報収集段階）</option>
            </select>
          </label>
        </div>
        <label className="text-sm block">
          メモ
          <textarea className={field} rows={2} value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} placeholder="相談後メモやクロージング文を保存" />
        </label>

        <div className="flex flex-wrap gap-2 pt-2">
          <button disabled={busy} onClick={() => submit(true)} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
            登録してAI分析へ
          </button>
          <button disabled={busy} onClick={() => submit(false)} className="px-4 py-2 border border-slate-300 rounded-md text-sm disabled:opacity-50">
            登録のみ
          </button>
        </div>
          </div>
        </div>

        {/* サイドバー - リサーチチェックリスト */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h2 className="font-semibold text-sm mb-3">Z候補リサーチチェックリスト</h2>
          <div className="space-y-2">
            {RESEARCH_CHECKLIST.map((item, i) => (
              <label key={i} className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist[item] || false}
                  onChange={(e) => setChecklist({ ...checklist, [item]: e.target.checked })}
                  className="mt-0.5"
                />
                <span className="text-sm text-slate-700">{item}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            候補を探す時にこれらが当てはまるか確認してください（記録はローカルのみ）
          </p>
        </div>
      </div>
    </div>
  );
}
