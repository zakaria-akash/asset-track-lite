import { NextResponse } from "next/server";

import { AssetDomainError, searchAssets } from "@/lib/assets";
import { getAssetDepreciationSnapshot } from "@/lib/depreciation";

// Converts domain-level exceptions into the project-wide API error response shape.
function buildErrorResponse(error, fallbackMessage) {
  if (error instanceof AssetDomainError) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        details: error.details,
      },
      { status: error.status }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error: fallbackMessage,
      details: [error instanceof Error ? error.message : "Unknown error."],
    },
    { status: 500 }
  );
}

// POST /api/search returns assets matching query text and optional field filters.
export async function POST(request) {
  try {
    // Empty payload is allowed and interpreted as "no filters" by domain logic.
    const payload = await request.json();
    const matches = await searchAssets(payload);

    // Search results include depreciation snapshots for immediate UI consumption.
    const enrichedMatches = matches.map((asset) => ({
      ...asset,
      depreciation: getAssetDepreciationSnapshot(asset),
    }));

    return NextResponse.json({
      ok: true,
      data: enrichedMatches,
      message: `Search returned ${enrichedMatches.length} asset(s).`,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid JSON body.",
          details: ["Request body must be valid JSON."],
        },
        { status: 400 }
      );
    }

    return buildErrorResponse(error, "Failed to search assets.");
  }
}
