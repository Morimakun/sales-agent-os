import Papa from "papaparse";
import { LEAD_CSV_COLUMNS, OPPORTUNITY_CSV_COLUMNS } from "./constants";

export interface ParsedLeadRow {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website_url: string;
  contact_form_url: string;
  industry: string;
  area: string;
  source: string;
  memo: string;
  status: string;
}

export interface CsvParseResult {
  rows: ParsedLeadRow[];
  headers: string[];
  missingColumns: string[];
  duplicateRowIndexes: number[]; // CSV内の重複行
}

const REQUIRED = ["company_name"]; // 最低限必須

export function parseLeadsCsv(text: string): CsvParseResult {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  const headers = parsed.meta.fields ?? [];
  const missingColumns = LEAD_CSV_COLUMNS.filter((c) => !headers.includes(c));

  const rows: ParsedLeadRow[] = (parsed.data || []).map((r) => ({
    company_name: (r.company_name || "").trim(),
    contact_name: (r.contact_name || "").trim(),
    email: (r.email || "").trim(),
    phone: (r.phone || "").trim(),
    website_url: (r.website_url || "").trim(),
    contact_form_url: (r.contact_form_url || "").trim(),
    industry: (r.industry || "").trim(),
    area: (r.area || "").trim(),
    source: (r.source || "").trim(),
    memo: (r.memo || "").trim(),
    status: (r.status || "new").trim() || "new",
  }));

  // CSV内重複検出: company_name+email / website_url / contact_form_url
  const seen = new Set<string>();
  const duplicateRowIndexes: number[] = [];
  rows.forEach((row, i) => {
    const keys = [
      row.company_name && row.email ? `ce:${row.company_name}|${row.email}` : "",
      row.website_url ? `w:${row.website_url}` : "",
      row.contact_form_url ? `f:${row.contact_form_url}` : "",
    ].filter(Boolean);
    const isDup = keys.some((k) => seen.has(k));
    if (isDup) duplicateRowIndexes.push(i);
    keys.forEach((k) => seen.add(k));
  });

  return { rows, headers, missingColumns, duplicateRowIndexes };
}

export { REQUIRED };

// ===== Z候補用CSVパース =====

export interface ParsedOpportunityRow {
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

export interface OpportunityCsvParseResult {
  data: ParsedOpportunityRow[];
  headers: string[];
  missingColumns: string[];
  importableCount: number;
}

const OPPORTUNITY_REQUIRED = ["companyName"];

export function parseOpportunitiesCsv(text: string): OpportunityCsvParseResult {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const headers = parsed.meta.fields ?? [];
  const missingColumns = OPPORTUNITY_CSV_COLUMNS.filter((c) => !headers.includes(c.toLowerCase()));

  const data: ParsedOpportunityRow[] = (parsed.data || []).map((r) => {
    const companyName = (r.companyname || "").trim();

    // 妥当性チェック
    const errorReasons: string[] = [];
    if (!companyName) {
      errorReasons.push("companyName is required");
    }
    if (r.url && !isValidUrl(r.url.trim())) {
      errorReasons.push("url is not a valid URL");
    }

    return {
      companyName,
      contactName: (r.contactname || "").trim(),
      url: (r.url || "").trim(),
      industry: (r.industry || "").trim(),
      area: (r.area || "").trim(),
      contactChannel: (r.contactchannel || "").trim(),
      instagramUrl: (r.instagramurl || "").trim(),
      contactFormUrl: (r.contactformurl || "").trim(),
      lineReservation: (r.linereservation || "").trim(),
      notes: (r.notes || "").trim(),
      valid: errorReasons.length === 0,
      errorReason: errorReasons.length > 0 ? errorReasons.join("; ") : undefined,
    };
  });

  const importableCount = data.filter((d) => d.valid).length;

  return { data, headers, missingColumns, importableCount };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
