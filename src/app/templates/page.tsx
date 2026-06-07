import { getTemplates } from "@/lib/templates";
import TemplatesForm from "./TemplatesForm";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await getTemplates();
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-1">営業テンプレート管理</h1>
      <p className="text-sm text-slate-500 mb-4">
        定型文を保存しておけます。差し込み変数が使えます。
      </p>
      <TemplatesForm initial={templates} />
    </div>
  );
}
