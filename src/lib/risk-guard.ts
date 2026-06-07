import { prisma } from "./db";

/**
 * doNotContact ガード。
 * 連絡停止対象の Opportunity / Lead には文面生成・追客生成・送信系操作を許可しない。
 * 該当する場合 { blocked: true } を返す。呼び出し側は 403 を返すこと。
 */
export async function guardOpportunity(
  id: string
): Promise<{ blocked: boolean; reason?: string; opportunity?: Awaited<ReturnType<typeof prisma.opportunity.findUnique>> }> {
  const opportunity = await prisma.opportunity.findUnique({ where: { id } });
  if (!opportunity) return { blocked: true, reason: "案件候補が見つかりません" };
  if (opportunity.doNotContact || opportunity.status === "do_not_contact") {
    return { blocked: true, reason: "この案件候補は連絡停止に設定されているため、文面生成・連絡操作はできません" };
  }
  return { blocked: false, opportunity };
}

export async function guardLead(
  id: string
): Promise<{ blocked: boolean; reason?: string; lead?: Awaited<ReturnType<typeof prisma.lead.findUnique>> }> {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { blocked: true, reason: "リードが見つかりません" };
  if (lead.doNotContact || lead.status === "do_not_contact") {
    return { blocked: true, reason: "このリードは連絡停止に設定されているため、文面生成・連絡操作はできません" };
  }
  return { blocked: false, lead };
}
