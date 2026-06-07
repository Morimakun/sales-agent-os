"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  description: string;
  target: string;
  deliverables: string;
  salesAngle: string;
}

const EMPTY = {
  name: "",
  priceMin: 0,
  priceMax: 0,
  description: "",
  target: "",
  deliverables: "",
  salesAngle: "",
};

export default function ProductsManager({ initial }: { initial: Product[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Record<string, Product>>({});

  async function add() {
    if (!draft.name.trim()) return;
    setBusy(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(EMPTY);
    setBusy(false);
    router.refresh();
  }

  async function save(p: Product) {
    setBusy(true);
    await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    setEditing((e) => {
      const n = { ...e };
      delete n[p.id];
      return n;
    });
    setBusy(false);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("この商品を削除しますか？")) return;
    setBusy(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  const field = "w-full border border-slate-300 rounded px-2 py-1 text-sm";

  return (
    <div className="space-y-6">
      {/* 新規追加 */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h2 className="font-semibold mb-3 text-sm">＋ 新しい商品を追加</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm">
            商品名
            <input className={field} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm">
              価格(最小)
              <input type="number" className={field} value={draft.priceMin} onChange={(e) => setDraft({ ...draft, priceMin: Number(e.target.value) })} />
            </label>
            <label className="text-sm">
              価格(最大)
              <input type="number" className={field} value={draft.priceMax} onChange={(e) => setDraft({ ...draft, priceMax: Number(e.target.value) })} />
            </label>
          </div>
          <label className="text-sm">
            対象
            <input className={field} value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} />
          </label>
          <label className="text-sm">
            営業の切り口
            <input className={field} value={draft.salesAngle} onChange={(e) => setDraft({ ...draft, salesAngle: e.target.value })} />
          </label>
          <label className="text-sm sm:col-span-2">
            内容
            <textarea className={field} rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </label>
          <label className="text-sm sm:col-span-2">
            提供物
            <input className={field} value={draft.deliverables} onChange={(e) => setDraft({ ...draft, deliverables: e.target.value })} />
          </label>
        </div>
        <button disabled={busy || !draft.name.trim()} onClick={add} className="mt-3 px-4 py-1.5 bg-slate-900 text-white rounded-md text-sm disabled:opacity-50">
          追加
        </button>
      </div>

      {/* 一覧 */}
      <div className="space-y-3">
        {initial.length === 0 && <p className="text-sm text-slate-400">まだ商品がありません。</p>}
        {initial.map((p) => {
          const e = editing[p.id];
          if (e) {
            return (
              <div key={p.id} className="bg-white border border-slate-300 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input className={field} value={e.name} onChange={(ev) => setEditing({ ...editing, [p.id]: { ...e, name: ev.target.value } })} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" className={field} value={e.priceMin} onChange={(ev) => setEditing({ ...editing, [p.id]: { ...e, priceMin: Number(ev.target.value) } })} />
                    <input type="number" className={field} value={e.priceMax} onChange={(ev) => setEditing({ ...editing, [p.id]: { ...e, priceMax: Number(ev.target.value) } })} />
                  </div>
                  <input className={field} value={e.target} placeholder="対象" onChange={(ev) => setEditing({ ...editing, [p.id]: { ...e, target: ev.target.value } })} />
                  <input className={field} value={e.salesAngle} placeholder="切り口" onChange={(ev) => setEditing({ ...editing, [p.id]: { ...e, salesAngle: ev.target.value } })} />
                  <textarea className={`${field} sm:col-span-2`} rows={2} value={e.description} onChange={(ev) => setEditing({ ...editing, [p.id]: { ...e, description: ev.target.value } })} />
                  <input className={`${field} sm:col-span-2`} value={e.deliverables} placeholder="提供物" onChange={(ev) => setEditing({ ...editing, [p.id]: { ...e, deliverables: ev.target.value } })} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => save(e)} disabled={busy} className="px-3 py-1 bg-slate-900 text-white rounded text-sm">保存</button>
                  <button onClick={() => setEditing((x) => { const n = { ...x }; delete n[p.id]; return n; })} className="px-3 py-1 border rounded text-sm">キャンセル</button>
                </div>
              </div>
            );
          }
          return (
            <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-slate-500">
                    価格: {p.priceMin.toLocaleString()}〜{p.priceMax.toLocaleString()}円
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing({ ...editing, [p.id]: p })} className="px-2.5 py-1 text-xs border rounded">編集</button>
                  <button onClick={() => remove(p.id)} className="px-2.5 py-1 text-xs border rounded text-red-600">削除</button>
                </div>
              </div>
              {p.target && <p className="text-sm mt-2"><span className="text-slate-400">対象:</span> {p.target}</p>}
              {p.description && <p className="text-sm"><span className="text-slate-400">内容:</span> {p.description}</p>}
              {p.deliverables && <p className="text-sm"><span className="text-slate-400">提供物:</span> {p.deliverables}</p>}
              {p.salesAngle && <p className="text-sm"><span className="text-slate-400">切り口:</span> {p.salesAngle}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
