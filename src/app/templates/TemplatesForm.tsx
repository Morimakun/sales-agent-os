"use client";

import { useState } from "react";
import { TEMPLATE_KEYS, TEMPLATE_LABELS, TEMPLATE_VARIABLES } from "@/lib/templates";

export default function TemplatesForm({ initial }: { initial: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600">
        使える変数: {TEMPLATE_VARIABLES.map((v) => <code key={v} className="bg-white px-1 rounded mr-1">{v}</code>)}
      </div>
      <div className="space-y-3">
        {TEMPLATE_KEYS.map((k) => (
          <label key={k} className="text-sm block bg-white border border-slate-200 rounded-lg p-3">
            <span className="font-medium">{TEMPLATE_LABELS[k]}</span>
            <textarea
              className="w-full border border-slate-300 rounded px-2 py-1 text-sm mt-1"
              rows={3}
              value={values[k] || ""}
              onChange={(e) => setValues({ ...values, [k]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
          {busy ? "保存中…" : "保存"}
        </button>
        {saved && <span className="text-green-600 text-sm">保存しました ✓</span>}
      </div>
    </div>
  );
}
