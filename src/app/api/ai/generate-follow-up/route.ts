import { NextRequest } from "next/server";
import { runLeadTextGeneration } from "@/lib/lead-ai";
import { followUpSystem, leadContextUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { leadId, stage } = await req.json();
  const s: "3days" | "7days" | "14days" =
    stage === "7days" ? "7days" : stage === "14days" ? "14days" : "3days";
  const type = s === "3days" ? "follow_up_3days" : s === "7days" ? "follow_up_7days" : "follow_up_14days";
  return runLeadTextGeneration(
    leadId,
    type,
    (p, pr) => followUpSystem(p, pr, s),
    leadContextUser
  );
}
