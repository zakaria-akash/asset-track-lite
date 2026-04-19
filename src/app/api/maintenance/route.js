import { NextResponse } from "next/server";

import { addMaintenanceEntry, AssetDomainError } from "@/lib/assets";
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

// POST /api/maintenance appends a maintenance log entry to a target asset.
export async function POST(request) {
  try {
    // Parse JSON once and hand over to domain validation/persistence logic.
    const payload = await request.json();
    const { asset, maintenanceEntry } = await addMaintenanceEntry(payload);

    return NextResponse.json(
      {
        ok: true,
        data: {
          asset: {
            ...asset,
            depreciation: getAssetDepreciationSnapshot(asset),
          },
          maintenanceEntry,
        },
        message: `Maintenance entry added to asset ${asset.id}.`,
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

    return buildErrorResponse(error, "Failed to add maintenance entry.");
  }
}
