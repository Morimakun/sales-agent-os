import { NextRequest } from "next/server";
import { runLeadTextGeneration } from "@/lib/lead-ai";
import { meetingPrepSystem, leadContextUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { leadId } = await req.json();
  // 商談メモは連絡行為ではないが、do_not_contact 対象は生成不可で統一
  return runLeadTextGeneration(leadId, "meeting_prep", meetingPrepSystem, leadContextUser);
}
