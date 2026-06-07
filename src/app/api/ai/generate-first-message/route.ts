import { NextRequest } from "next/server";
import { runLeadTextGeneration } from "@/lib/lead-ai";
import { firstMessageSystem, leadContextUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { leadId } = await req.json();
  return runLeadTextGeneration(leadId, "first_message", firstMessageSystem, leadContextUser);
}
