import { prisma } from "./db";

// AI設定 / プロフィールのキー一覧
export const SETTING_KEYS = [
  "company_name", // 自社名 / 屋号
  "sender_name", // 自分の名前
  "services", // 提供サービス
  "achievements", // 実績
  "strengths", // 強み
  "area", // 対応エリア
  "sales_tone", // 営業トーン
  "forbidden_phrases", // 禁止表現
  "price_range", // 価格帯
  "free_offer", // 無料相談の有無
  "cta", // CTA
  "signature", // 署名
  "compliance_footer", // 配信停止文言
  "contact_info", // 問い合わせ先
] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

export const SETTING_LABELS: Record<SettingKey, string> = {
  company_name: "自社名 / 屋号",
  sender_name: "自分の名前",
  services: "提供サービス",
  achievements: "実績",
  strengths: "強み",
  area: "対応エリア",
  sales_tone: "営業トーン",
  forbidden_phrases: "禁止表現",
  price_range: "価格帯",
  free_offer: "無料相談の有無",
  cta: "CTA (誘導文)",
  signature: "署名",
  compliance_footer: "配信停止 / 連絡停止文言",
  contact_info: "問い合わせ先",
};

export type ProfileSettings = Record<SettingKey, string>;

export async function getAllSettings(): Promise<ProfileSettings> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  const result = {} as ProfileSettings;
  for (const k of SETTING_KEYS) result[k] = map[k] ?? "";
  return result;
}

export async function saveSettings(values: Partial<Record<SettingKey, string>>): Promise<void> {
  const entries = Object.entries(values).filter(([k]) => (SETTING_KEYS as readonly string[]).includes(k));
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: value ?? "" },
        create: { key, value: value ?? "" },
      })
    )
  );
}

/** プロフィールを system prompt 用テキストに整形 */
export function profileToPromptBlock(p: ProfileSettings): string {
  const lines: string[] = [];
  const push = (label: string, v: string) => {
    if (v && v.trim()) lines.push(`- ${label}: ${v.trim()}`);
  };
  push("自社名/屋号", p.company_name);
  push("担当者名", p.sender_name);
  push("提供サービス", p.services);
  push("実績", p.achievements);
  push("強み", p.strengths);
  push("対応エリア", p.area);
  push("営業トーン", p.sales_tone);
  push("価格帯", p.price_range);
  push("無料相談", p.free_offer);
  push("CTA", p.cta);
  push("署名", p.signature);
  push("配信停止/連絡停止文言", p.compliance_footer);
  push("問い合わせ先", p.contact_info);
  if (p.forbidden_phrases && p.forbidden_phrases.trim()) {
    lines.push(`- 禁止表現(使ってはいけない): ${p.forbidden_phrases.trim()}`);
  }
  return lines.length ? lines.join("\n") : "(プロフィール未設定)";
}
