// アプリ層の enum 相当の定数 (SQLite は enum 非対応のため文字列で管理)

// ===== Opportunity (主役) =====

export const OPPORTUNITY_SOURCE_TYPES = [
  "x_post",
  "crowdsourcing",
  "job_board",
  "referral",
  "manual_company",
  "event",
  "inquiry",
  "other",
] as const;
export type OpportunitySourceType = (typeof OPPORTUNITY_SOURCE_TYPES)[number];

export const OPPORTUNITY_SOURCE_LABELS: Record<string, string> = {
  x_post: "X投稿",
  crowdsourcing: "クラウドソーシング",
  job_board: "求人・募集",
  referral: "紹介",
  manual_company: "企業（手動）",
  event: "イベント",
  inquiry: "問い合わせ",
  other: "その他",
};

export const OPPORTUNITY_STATUSES = [
  "new",
  "analyzed",
  "apply_ready",
  "contact_ready",
  "contacted",
  "follow_up",
  "meeting_candidate",
  "won",
  "lost",
  "not_fit",
  "do_not_contact",
] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

export const OPPORTUNITY_STATUS_LABELS: Record<string, string> = {
  new: "新規",
  analyzed: "分析済み",
  apply_ready: "応募準備OK",
  contact_ready: "連絡準備OK",
  contacted: "連絡済み",
  follow_up: "追客",
  meeting_candidate: "商談化候補",
  won: "受注",
  lost: "失注",
  not_fit: "対象外",
  do_not_contact: "連絡停止",
};

// ===== OutreachDraft (生成文面) =====

export const OUTREACH_DRAFT_TYPES = [
  "application",
  "first_contact",
  "referral_request",
  "free_diagnosis_offer",
  "follow_up",
  "meeting_reply",
  "thank_you",
] as const;
export type OutreachDraftType = (typeof OUTREACH_DRAFT_TYPES)[number];

export const OUTREACH_DRAFT_LABELS: Record<string, string> = {
  application: "応募文",
  first_contact: "初回連絡文",
  referral_request: "紹介依頼文",
  free_diagnosis_offer: "無料診断オファー文",
  follow_up: "追客文",
  meeting_reply: "商談返信",
  thank_you: "お礼文",
};

// ===== 共通 =====

export const PRIORITIES = ["A", "B", "C", "unknown"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_LABELS: Record<string, string> = {
  A: "A (高)",
  B: "B (中)",
  C: "C (低)",
  unknown: "未判定",
};

export const RISK_LEVELS = ["low", "medium", "high"] as const;

// ===== Z候補インポート・テンプレート =====

export const Z_CANDIDATE_DEFAULTS = {
  candidateType: "z",
  referrerName: "",
  painHypothesis: "店舗スタッフが料金・規約・キャンペーン・契約条件を確認するのに時間がかかる。本部への問い合わせが多い。マニュアルやFAQが多く、必要情報を探すのが大変。新人スタッフの案内品質にばらつきが出やすい。",
  tools: "PDFマニュアル、料金表、FAQ、キャンペーン資料、Google Drive、Excel、Salesforce、LINE WORKS、Teams、社内チャット、メール、紙マニュアル",
  temperature: "low" as const,
  status: "new",
};

export const TELECOM_AGENCY_Z_TEMPLATE = {
  ...Z_CANDIDATE_DEFAULTS,
  industry: "通信代理店",
};

export const OPPORTUNITY_CSV_COLUMNS = [
  "companyName",
  "contactName",
  "url",
  "industry",
  "area",
  "contactChannel",
  "instagramUrl",
  "contactFormUrl",
  "lineReservation",
  "notes",
] as const;
export type OpportunityCsvColumn = (typeof OPPORTUNITY_CSV_COLUMNS)[number];

// ===== Lead (副次) =====

export const LEAD_STATUSES = [
  "new",
  "analyzed",
  "draft_created",
  "ready_to_send",
  "sent",
  "replied",
  "meeting_candidate",
  "meeting_booked",
  "follow_up",
  "lost",
  "not_fit",
  "do_not_contact",
] as const;

export const LEAD_AI_OUTPUT_TYPES = [
  "lead_analysis",
  "first_message",
  "contact_form_message",
  "follow_up_3days",
  "follow_up_7days",
  "follow_up_14days",
  "meeting_prep",
  "risk_check",
  "reply_analysis",
] as const;

// 期待される CSV カラム (Lead インポート)
export const LEAD_CSV_COLUMNS = [
  "company_name",
  "contact_name",
  "email",
  "phone",
  "website_url",
  "contact_form_url",
  "industry",
  "area",
  "source",
  "memo",
  "status",
] as const;
