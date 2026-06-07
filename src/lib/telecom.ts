const DEFAULT_TELECOM_DEMO_LP_URL = "https://telecom-staff-ai-demo.vercel.app/";
const TELECOM_SOURCE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function buildTelecomDemoLpUrl(sourceId?: string): string {
  const base = process.env.NEXT_PUBLIC_TELECOM_DEMO_LP_URL?.trim() || DEFAULT_TELECOM_DEMO_LP_URL;
  const normalized = sourceId?.trim();
  if (!normalized || !TELECOM_SOURCE_ID_PATTERN.test(normalized)) return base;

  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}src=${encodeURIComponent(normalized)}`;
}

export function buildTelecomDemoLpCta(sourceId?: string): string {
  return `デモ画面のイメージと申込フォームはこちらです。\n${buildTelecomDemoLpUrl(sourceId)}`;
}
