import { NextRequest } from "next/server";
import { runOpportunityTextGeneration } from "@/lib/opportunity-ai";
import { generateFreeDiagnosisSystem, generateFreeDiagnosisUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { opportunityId } = await req.json();
  return runOpportunityTextGeneration(opportunityId, "free_diagnosis_offer", generateFreeDiagnosisSystem, generateFreeDiagnosisUser);
}
