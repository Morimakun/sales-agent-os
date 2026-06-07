import { NextRequest } from "next/server";
import { runOpportunityTextGeneration } from "@/lib/opportunity-ai";
import { generateFirstContactSystem, generateFirstContactUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { opportunityId } = await req.json();
  return runOpportunityTextGeneration(opportunityId, "first_contact", generateFirstContactSystem, generateFirstContactUser);
}
