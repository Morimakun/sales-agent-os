import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseLeadsCsv } from "@/lib/csv";

// preview: パース結果と重複情報を返す。 commit: DBへ保存。
export async function POST(req: NextRequest) {
  const { csv, commit } = await req.json();
  if (typeof csv !== "string" || !csv.trim()) {
    return NextResponse.json({ error: "CSV が空です" }, { status: 400 });
  }
  const { rows, headers, missingColumns, duplicateRowIndexes } = parseLeadsCsv(csv);

  // 既存DBとの重複チェック
  const existing = await prisma.lead.findMany({
    select: { companyName: true, email: true, websiteUrl: true, contactFormUrl: true },
  });
  const existKeys = new Set<string>();
  for (const e of existing) {
    if (e.companyName && e.email) existKeys.add(`ce:${e.companyName}|${e.email}`);
    if (e.websiteUrl) existKeys.add(`w:${e.websiteUrl}`);
    if (e.contactFormUrl) existKeys.add(`f:${e.contactFormUrl}`);
  }
  const dupWithDb = rows.map((r) => {
    const keys = [
      r.company_name && r.email ? `ce:${r.company_name}|${r.email}` : "",
      r.website_url ? `w:${r.website_url}` : "",
      r.contact_form_url ? `f:${r.contact_form_url}` : "",
    ].filter(Boolean);
    return keys.some((k) => existKeys.has(k));
  });

  const dupSet = new Set(duplicateRowIndexes);
  const importable = rows.filter((_, i) => !dupSet.has(i) && !dupWithDb[i] && rows[i].company_name);

  if (!commit) {
    return NextResponse.json({
      preview: rows,
      headers,
      missingColumns,
      duplicateInCsv: duplicateRowIndexes,
      duplicateWithDb: dupWithDb.map((d, i) => (d ? i : -1)).filter((i) => i >= 0),
      importableCount: importable.length,
    });
  }

  // commit
  let created = 0;
  for (const r of importable) {
    await prisma.lead.create({
      data: {
        companyName: r.company_name,
        contactName: r.contact_name,
        email: r.email,
        phone: r.phone,
        websiteUrl: r.website_url,
        contactFormUrl: r.contact_form_url,
        industry: r.industry,
        area: r.area,
        source: r.source,
        memo: r.memo,
        status: ["new", "analyzed", "draft_created", "ready_to_send", "sent", "replied", "follow_up", "lost", "not_fit", "do_not_contact"].includes(r.status) ? r.status : "new",
      },
    });
    created++;
  }
  return NextResponse.json({ created, skipped: rows.length - created });
}
