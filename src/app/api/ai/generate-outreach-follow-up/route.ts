import { NextRequest } from "next/server";
import { runOpportunityTextGeneration } from "@/lib/opportunity-ai";
import { generateOutreachFollowUpSystem, generateOutreachFollowUpUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { opportunityId } = await req.json();
  return runOpportunityTextGeneration(opportunityId, "follow_up", generateOutreachFollowUpSystem, generateOutreachFollowUpUser);
}
