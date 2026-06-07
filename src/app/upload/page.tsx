"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_CSV_COLUMNS } from "@/lib/constants";

interface PreviewResp {
  preview: Record<string, string>[];
  headers: string[];
  missingColumns: string[];
  duplicateInCsv: number[];
  duplicateWithDb: number[];
  importableCount: number;
}

export default function UploadPage() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [preview, setPreview] = useState<PreviewResp | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function readFile(file: File) {
    const text = await file.text();
    setCsv(text);
    setPreview(null);
    setResult(null);
  }

  async function doPreview() {
    setBusy(true);
    const res = await fetch("/api/leads/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv, commit: false }),
    });
    setPreview(await res.json());
    setBusy(false);
  }

  async function doImport() {
    setBusy(true);
    const res = await fetch("/api/leads/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv, commit: true }),
    });
    const data = await res.json();
    setResult(`${data.created} 件を取り込みました (スキップ ${data.skipped} 件)`);
    setBusy(false);
    setTimeout(() => router.push("/leads"), 1200);
  }

  const dupCsv = new Set(preview?.duplicateInCsv || []);
  const dupDb = new Set(preview?.duplicateWithDb || []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">CSVアップロード (リード・副次機能)</h1>
      <p className="text-sm text-slate-500 mb-4">
        営業候補リストの CSV を取り込みます。列: {LEAD_CSV_COLUMNS.join(", ")}
      </p>

      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <input type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])} className="text-sm" />
        <textarea
          className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
          rows={5}
          placeholder="または CSV テキストを貼り付け"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
        />
        <button onClick={doPreview} disabled={busy || !csv.trim()} className="px-4 py-1.5 border border-slate-300 rounded-md text-sm disabled:opacity-50">
          プレビュー
        </button>
      </div>

      {preview && (
        <div className="mt-4 space-y-3">
          {preview.missingColumns.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
              不足している列: {preview.missingColumns.join(", ")}（無くても company_name があれば取込可能）
            </div>
          )}
          <div className="text-sm text-slate-600">
            全 {preview.preview.length} 行 / 取込可能 <b>{preview.importableCount}</b> 件 ·
            CSV内重複 {preview.duplicateInCsv.length} · 既存と重複 {preview.duplicateWithDb.length}
          </div>
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg max-h-80">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-2 py-1 text-left">#</th>
                  <th className="px-2 py-1 text-left">会社名</th>
                  <th className="px-2 py-1 text-left">メール</th>
                  <th className="px-2 py-1 text-left">業種</th>
                  <th className="px-2 py-1 text-left">判定</th>
                </tr>
              </thead>
              <tbody>
                {preview.preview.map((r, i) => {
                  const isDup = dupCsv.has(i) || dupDb.has(i);
                  const noName = !r.company_name;
                  return (
                    <tr key={i} className={`border-t border-slate-100 ${isDup || noName ? "bg-red-50" : ""}`}>
                      <td className="px-2 py-1">{i + 1}</td>
                      <td className="px-2 py-1">{r.company_name || "(なし)"}</td>
                      <td className="px-2 py-1">{r.email}</td>
                      <td className="px-2 py-1">{r.industry}</td>
                      <td className="px-2 py-1">{noName ? "会社名なし→除外" : isDup ? "重複→除外" : "取込"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={doImport} disabled={busy || preview.importableCount === 0} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
            {preview.importableCount} 件をインポート
          </button>
          {result && <p className="text-green-600 text-sm">{result}</p>}
        </div>
      )}
    </div>
  );
}
