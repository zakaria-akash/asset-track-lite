import { NextResponse } from "next/server";

import { AssetDomainError, createAsset, listAssets } from "@/lib/assets";
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

// GET /api/assets returns every asset enriched with computed depreciation values.
export async function GET() {
  try {
    const assets = await listAssets();

    // Depreciation is calculated server-side to keep business math centralized.
    const enrichedAssets = assets.map((asset) => ({
      ...asset,
      depreciation: getAssetDepreciationSnapshot(asset),
    }));

    return NextResponse.json({
      ok: true,
      data: enrichedAssets,
      message: `Fetched ${enrichedAssets.length} assets.`,
    });
  } catch (error) {
    return buildErrorResponse(error, "Failed to fetch assets.");
  }
}

// POST /api/assets creates one validated asset record and returns the result.
export async function POST(request) {
  try {
    // Parse JSON once so validation and domain logic receive a clean object.
    const payload = await request.json();
    const createdAsset = await createAsset(payload);

    return NextResponse.json(
      {
        ok: true,
        data: {
          ...createdAsset,
          depreciation: getAssetDepreciationSnapshot(createdAsset),
        },
        message: `Asset created: ${createdAsset.id}.`,
      },
      { status: 201 }
    );
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

    return buildErrorResponse(error, "Failed to create asset.");
  }
}
