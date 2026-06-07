import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toCsv, jstDate } from "@/lib/export";
import { getDashboardBuckets } from "@/lib/dashboard";
import {
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STATUS_LABELS,
  OUTREACH_DRAFT_LABELS,
} from "@/lib/constants";

function fileResponse(content: string, filename: string, contentType: string) {
  return new NextResponse(content, {
    headers: {
      "Content-Type": `${contentType}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;

  if (kind === "opps-csv") {
    const opps = await prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } });
    const csv = toCsv(
      ["会社名", "ソース", "優先度", "適合度", "ステータス", "推奨オファー", "次アクション", "作成日"],
      opps.map((o) => [
        o.companyName,
        OPPORTUNITY_SOURCE_LABELS[o.sourceType] || o.sourceType,
        o.priority,
        o.fitScore ?? "",
        OPPORTUNITY_STATUS_LABELS[o.status] || o.status,
        o.recommendedOffer,
        o.nextAction,
        jstDate(o.createdAt),
      ])
    );
    return fileResponse(csv, "opportunities.csv", "text/csv");
  }

  if (kind === "leads-csv") {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    const csv = toCsv(
      ["company_name", "contact_name", "email", "phone", "website_url", "industry", "area", "source", "status", "priority"],
      leads.map((l) => [l.companyName, l.contactName, l.email, l.phone, l.websiteUrl, l.industry, l.area, l.source, l.status, l.priority])
    );
    return fileResponse(csv, "leads.csv", "text/csv");
  }

  if (kind === "today-md") {
    const b = await getDashboardBuckets();
    const sec = (title: string, items: typeof b.toApply) =>
      `## ${title} (${items.length})\n` +
      (items.length ? items.map((o) => `- [ ] ${o.companyName || "(名称未設定)"}（${o.recommendedOffer || o.nextAction || "—"}）`).join("\n") : "- なし") +
      "\n";
    const md =
      `# 今日の営業アクション (${jstDate(new Date())})\n\n` +
      sec("今日応募すべき案件", b.toApply) + "\n" +
      sec("今日連絡すべき候補", b.toContact) + "\n" +
      sec("今日紹介依頼を送る相手", b.toReferral) + "\n" +
      sec("今日追客すべき相手", b.toFollowUp) + "\n" +
      sec("商談化候補", b.meetingCandidates);
    return fileResponse(md, "today.md", "text/markdown");
  }

  if (kind === "candidates-md") {
    const b = await getDashboardBuckets();
    const md =
      `# 商談化候補 (${jstDate(new Date())})\n\n` +
      (b.meetingCandidates.length
        ? b.meetingCandidates
            .map((o) => `## ${o.companyName || "(名称未設定)"}\n- 優先度: ${o.priority}\n- 適合度: ${o.fitScore ?? "—"}\n- 推奨オファー: ${o.recommendedOffer || "—"}\n- 次アクション: ${o.nextAction || "—"}\n`)
            .join("\n")
        : "該当なし");
    return fileResponse(md, "meeting-candidates.md", "text/markdown");
  }

  if (kind === "drafts-md") {
    const drafts = await prisma.outreachDraft.findMany({
      orderBy: { createdAt: "desc" },
      include: { opportunity: { select: { companyName: true } } },
    });
    const md =
      `# 送信予定文面 (${jstDate(new Date())})\n\n` +
      (drafts.length
        ? drafts
            .map(
              (d) =>
                `## ${d.opportunity.companyName || "(名称未設定)"} — ${OUTREACH_DRAFT_LABELS[d.type] || d.type}\n\n${d.body}\n`
            )
            .join("\n---\n\n")
        : "該当なし");
    return fileResponse(md, "drafts.md", "text/markdown");
  }

  return NextResponse.json({ error: "unknown export kind" }, { status: 400 });
}
