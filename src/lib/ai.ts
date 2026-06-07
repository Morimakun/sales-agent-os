// AI プロバイダ切替ラッパー (OpenAI / Anthropic)
// 環境変数: AI_PROVIDER, OPENAI_API_KEY, ANTHROPIC_API_KEY, AI_MODEL
// セキュリティ: APIキー・本文全文をログに出さない

export class AIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIError";
  }
}

type Provider = "openai" | "anthropic";

function getProvider(): Provider {
  const p = (process.env.AI_PROVIDER || "openai").toLowerCase();
  return p === "anthropic" ? "anthropic" : "openai";
}

function getModel(provider: Provider): string {
  if (process.env.AI_MODEL) return process.env.AI_MODEL;
  return provider === "anthropic" ? "claude-haiku-4-5-20251001" : "gpt-4o-mini";
}

/** プロバイダ設定が揃っているか (APIキー値は返さない) */
export function aiConfigured(): { ok: boolean; provider: Provider; model: string } {
  const provider = getProvider();
  const key = provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  return { ok: Boolean(key), provider, model: getModel(provider) };
}

async function callOpenAI(system: string, user: string, json: boolean): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new AIError("OPENAI_API_KEY が設定されていません (.env.local を確認してください)");
  const model = getModel("openai");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    // ステータスのみ。本文(キー等が混ざる可能性)は出さない
    throw new AIError(`OpenAI API エラー (status ${res.status})`);
  }
  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content;
  if (!text) throw new AIError("OpenAI から空の応答が返りました");
  return text;
}

async function callAnthropic(system: string, user: string, json: boolean): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new AIError("ANTHROPIC_API_KEY が設定されていません (.env.local を確認してください)");
  const model = getModel("anthropic");
  const sys = json
    ? `${system}\n\n必ず有効な JSON オブジェクトのみを返してください。前後に説明文やコードブロックを付けないこと。`
    : system;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: sys,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    throw new AIError(`Anthropic API エラー (status ${res.status})`);
  }
  const data = await res.json();
  const text: string | undefined = data?.content?.[0]?.text;
  if (!text) throw new AIError("Anthropic から空の応答が返りました");
  return text;
}

/** 表示用テキストを返す AI 呼び出し */
export async function callAIText(system: string, user: string): Promise<{ text: string; model: string }> {
  const provider = getProvider();
  const text = provider === "anthropic" ? await callAnthropic(system, user, false) : await callOpenAI(system, user, false);
  return { text, model: getModel(provider) };
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  // ```json ... ``` を剥がす
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  // 最初の { から最後の } まで
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

/** JSON を返す AI 呼び出し。パース失敗時は AIError を投げる */
export async function callAIJson<T = Record<string, unknown>>(
  system: string,
  user: string
): Promise<{ data: T; model: string }> {
  const provider = getProvider();
  const raw = provider === "anthropic" ? await callAnthropic(system, user, true) : await callOpenAI(system, user, true);
  try {
    const data = JSON.parse(extractJson(raw)) as T;
    return { data, model: getModel(provider) };
  } catch {
    throw new AIError("AI 応答の JSON パースに失敗しました。再生成してください。");
  }
}
