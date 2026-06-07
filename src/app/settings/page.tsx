import { getAllSettings } from "@/lib/settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getAllSettings();
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-1">プロフィール / AI設定</h1>
      <p className="text-sm text-slate-500 mb-4">
        ここに入力した内容を AI が文面生成・分析時に参照します。営業トーンや禁止表現も反映されます。
      </p>
      <SettingsForm initial={settings} />
    </div>
  );
}
