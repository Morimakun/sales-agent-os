import { prisma } from "./db";

export const TEMPLATE_KEYS = [
  "first_email",
  "contact_form",
  "referral_request",
  "follow_up_1",
  "follow_up_2",
  "follow_up_3",
  "thank_you",
  "send_material",
  "lost_follow_up",
] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

export const TEMPLATE_LABELS: Record<TemplateKey, string> = {
  first_email: "初回メール",
  contact_form: "問い合わせフォーム",
  referral_request: "紹介依頼",
  follow_up_1: "追客1回目",
  follow_up_2: "追客2回目",
  follow_up_3: "追客3回目",
  thank_you: "商談後お礼",
  send_material: "資料送付",
  lost_follow_up: "失注後フォロー",
};

export const TEMPLATE_VARIABLES = [
  "{{company_name}}",
  "{{industry}}",
  "{{area}}",
  "{{pain_hypothesis}}",
  "{{offer}}",
  "{{cta}}",
  "{{sender_name}}",
  "{{company_signature}}",
];

const STORE_KEY = "sales_templates";

export async function getTemplates(): Promise<Record<string, string>> {
  const row = await prisma.setting.findUnique({ where: { key: STORE_KEY } });
  if (!row) return {};
  try {
    return JSON.parse(row.value) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function saveTemplates(values: Record<string, string>): Promise<void> {
  await prisma.setting.upsert({
    where: { key: STORE_KEY },
    update: { value: JSON.stringify(values) },
    create: { key: STORE_KEY, value: JSON.stringify(values) },
  });
}
