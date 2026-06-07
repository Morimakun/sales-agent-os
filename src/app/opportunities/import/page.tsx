"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OPPORTUNITY_CSV_COLUMNS } from "@/lib/constants";

interface ParsedOpportunityRow {
  companyName: string;
  contactName: string;
  url: string;
  industry: string;
  area: string;
  contactChannel: string;
  instagramUrl: string;
  contactFormUrl: string;
  lineReservation: string;
  notes: string;
  valid: boolean;
  errorReason?: string;
}

interface PreviewResp {
  preview: ParsedOpportunityRow[];
  headers: string[];
  missingColumns: string[];
  invalidRows: number[];
  importableCount: number;
}

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

export default function ImportPage() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [preview, setPreview] = useState<PreviewResp | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  async function readFile(file: File) {
    const text = await file.text();
    setCsv(text);
    setPreview(null);
    setResult(null);
  }

  async function doPreview() {
    setBusy(true);
    try {
      const res = await fetch("/api/opportunities/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, commit: false }),
      });
      const data = await res.json();
      setPreview(data);
    } catch (error) {
      console.error("Preview error:", error);
      alert("プレビュー失敗しました");
    } finally {
      setBusy(false);
    }
  }

  async function doImport() {
    setBusy(true);
    try {
      const res = await fetch("/api/opportunities/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, commit: true }),
      });
      const data = await res.json();
      setResult(`${data.created} 件を登録しました${data.skipped > 0 ? ` (スキップ ${data.skipped} 件)` : ""}`);
      setTimeout(() => router.push("/opportunities"), 1200);
    } catch (error) {
      console.error("Import error:", error);
      alert("インポート失敗しました");
    } finally {
      setBusy(false);
    }
  }

  const invalidRows = new Set(preview?.invalidRows || []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold mb-1">Z候補インポート</h1>
      <p className="text-sm text-slate-500 mb-4">複数のZ候補をCSVから一括登録します。</p>

      <div className="grid grid-cols-3 gap-4">
        {/* メインエリア */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">CSVファイル</label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
                className="text-sm w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">またはCSV テキストを貼り付け</label>
              <textarea
                className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                rows={8}
                placeholder={`companyName,contactName,url,industry,area,contactChannel,instagramUrl,contactFormUrl,lineReservation,notes\n〇〇美容サロン,,,美容,東京,...`}
                value={csv}
                onChange={(e) => setCsv(e.target.value)}
              />
            </div>

            <div className="text-xs text-slate-500">
              <p className="font-semibold mb-1">期待するCSV列:</p>
              <p>{OPPORTUNITY_CSV_COLUMNS.join(", ")}</p>
            </div>

            <button
              onClick={doPreview}
              disabled={busy || !csv.trim()}
              className="px-4 py-1.5 border border-slate-300 rounded-md text-sm disabled:opacity-50 hover:bg-slate-50"
            >
              プレビュー
            </button>
          </div>

          {preview && (
            <div className="space-y-3">
              {preview.missingColumns.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
                  不足している列: {preview.missingColumns.join(", ")}（あらかじめ埋めると便利）
                </div>
              )}

              <div className="text-sm text-slate-600">
                全 {preview.preview.length} 行 / 登録可能{" "}
                <b>{preview.importableCount}</b> 件 · 不正行 {preview.invalidRows.length}
              </div>

              <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg max-h-80">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-2 py-1 text-left w-8">#</th>
                      <th className="px-2 py-1 text-left">会社名</th>
                      <th className="px-2 py-1 text-left">業種</th>
                      <th className="px-2 py-1 text-left">URL</th>
                      <th className="px-2 py-1 text-left">判定</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.preview.map((r, i) => {
                      const isInvalid = invalidRows.has(i);
                      return (
                        <tr
                          key={i}
                          className={`border-t border-slate-100 ${isInvalid ? "bg-red-50" : ""}`}
                        >
                          <td className="px-2 py-1">{i + 1}</td>
                          <td className="px-2 py-1">{r.companyName || "(なし)"}</td>
                          <td className="px-2 py-1">{r.industry}</td>
                          <td className="px-2 py-1 text-blue-600 text-xs truncate max-w-xs">
                            {r.url && r.url.length > 30 ? `${r.url.slice(0, 27)}...` : r.url}
                          </td>
                          <td className="px-2 py-1">
                            {isInvalid ? (
                              <span className="text-red-600 font-semibold">除外</span>
                            ) : (
                              <span className="text-green-600">登録</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                onClick={doImport}
                disabled={busy || preview.importableCount === 0}
                className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50 hover:bg-slate-800"
              >
                {preview.importableCount} 件を登録
              </button>

              {result && <p className="text-green-600 text-sm font-semibold">{result}</p>}
            </div>
          )}
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
