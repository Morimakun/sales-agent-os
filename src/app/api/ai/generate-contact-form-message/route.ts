import { NextRequest } from "next/server";
import { runLeadTextGeneration } from "@/lib/lead-ai";
import { contactFormMessageSystem, leadContextUser } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { leadId } = await req.json();
  return runLeadTextGeneration(leadId, "contact_form_message", contactFormMessageSystem, leadContextUser);
}
