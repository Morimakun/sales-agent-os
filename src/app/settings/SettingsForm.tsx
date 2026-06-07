"use client";

import { useState } from "react";
import { SETTING_KEYS, SETTING_LABELS, type ProfileSettings, type SettingKey } from "@/lib/settings";

const MULTILINE: SettingKey[] = ["services", "achievements", "strengths", "forbidden_phrases"];

const PLACEHOLDERS: Partial<Record<SettingKey, string>> = {
  company_name: "〇〇AIサポート",
  sender_name: "山田 太郎",
  services: "中小企業向けAI業務改善、ChatGPT導入支援、社内FAQボット作成",
  strengths: "現場業務をヒアリングし、最小構成で使えるAIツールを作る",
  price_range: "初期5万円〜30万円",
  cta: "15分だけ無料相談できます",
  sales_tone: "丁寧、押し売りしない、短文、相手の負担を減らす",
  free_offer: "あり（15分無料相談）",
  forbidden_phrases: "絶対に / 必ず儲かる / 100%",
  compliance_footer: "今後のご連絡が不要な場合はお知らせください。",
};

export default function SettingsForm({ initial }: { initial: ProfileSettings }) {
  const [values, setValues] = useState<ProfileSettings>(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const field = "w-full border border-slate-300 rounded px-3 py-2 text-sm";

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
      {SETTING_KEYS.map((k) => (
        <label key={k} className="text-sm block">
          {SETTING_LABELS[k]}
          {MULTILINE.includes(k) ? (
            <textarea
              className={field}
              rows={2}
              value={values[k]}
              placeholder={PLACEHOLDERS[k]}
              onChange={(e) => setValues({ ...values, [k]: e.target.value })}
            />
          ) : (
            <input
              className={field}
              value={values[k]}
              placeholder={PLACEHOLDERS[k]}
              onChange={(e) => setValues({ ...values, [k]: e.target.value })}
            />
          )}
        </label>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={save} disabled={busy} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
          {busy ? "保存中…" : "保存"}
        </button>
        {saved && <span className="text-green-600 text-sm">保存しました ✓</span>}
      </div>
    </div>
  );
}
