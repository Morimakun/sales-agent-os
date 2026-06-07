import { NextRequest, NextResponse } from "next/server";
import { parseOpportunitiesCsv } from "@/lib/csv";
import { Z_CANDIDATE_DEFAULTS } from "@/lib/constants";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { csv, commit } = body;

    if (!csv || typeof csv !== "string") {
      return NextResponse.json(
        { error: "csv is required and must be a string" },
        { status: 400 }
      );
    }

    // Parse CSV
    const parsed = parseOpportunitiesCsv(csv);

    if (!commit) {
      // Preview mode
      return NextResponse.json({
        preview: parsed.data.slice(0, 50),
        headers: parsed.headers,
        missingColumns: parsed.missingColumns,
        invalidRows: parsed.data
          .map((row, i) => (!row.valid ? i : null))
          .filter((i): i is number => i !== null),
        importableCount: parsed.importableCount,
      });
    }

    // Commit mode: create opportunities
    const created: Array<{ id: string }> = [];
    const errors: Array<{ row: number; reason: string }> = [];

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];

      if (!row.valid) {
        errors.push({
          row: i,
          reason: row.errorReason || "Invalid row",
        });
        continue;
      }

      try {
        // Build rawText from contactChannel, instagramUrl, contactFormUrl, lineReservation, area
        const rawTextParts = [];
        if (row.contactChannel) rawTextParts.push(`連絡チャネル: ${row.contactChannel}`);
        if (row.instagramUrl) rawTextParts.push(`Instagram: ${row.instagramUrl}`);
        if (row.contactFormUrl) rawTextParts.push(`問い合わせフォーム: ${row.contactFormUrl}`);
        if (row.lineReservation) rawTextParts.push(`LINE予約: ${row.lineReservation}`);
        if (row.area) rawTextParts.push(`エリア: ${row.area}`);
        const rawText = rawTextParts.join("\n");

        const opportunity = await prisma.opportunity.create({
          data: {
            sourceType: "manual_company",
            sourceName: "Z候補インポート",
            companyName: row.companyName,
            personName: row.contactName,
            url: row.url,
            industry: row.industry,
            budgetHint: "",
            memo: row.notes,
            rawText: rawText,
            // Z候補デフォルト値
            candidateType: Z_CANDIDATE_DEFAULTS.candidateType,
            referrerName: Z_CANDIDATE_DEFAULTS.referrerName,
            painPoints: Z_CANDIDATE_DEFAULTS.painHypothesis,
            tools: Z_CANDIDATE_DEFAULTS.tools,
            temperature: Z_CANDIDATE_DEFAULTS.temperature,
            status: Z_CANDIDATE_DEFAULTS.status,
          },
        });

        created.push({ id: opportunity.id });
      } catch (error) {
        errors.push({
          row: i,
          reason: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      created: created.length,
      skipped: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Opportunities import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
