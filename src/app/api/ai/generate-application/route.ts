import { NextRequest } from "next/server";
import { runOpportunityTextGeneration } from "@/lib/opportunity-ai";
import { generateApplicationSystem, generateApplicationUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { opportunityId } = await req.json();
  return runOpportunityTextGeneration(opportunityId, "application", generateApplicationSystem, generateApplicationUser);
}
