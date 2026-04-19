import { NextResponse } from "next/server";

import {
  AssetDomainError,
  deleteAsset,
  getAssetById,
  updateAsset,
} from "@/lib/assets";
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

// GET /api/assets/:id returns one asset enriched with computed depreciation values.
export async function GET(_request, { params }) {
  try {
    // Dynamic route params are resolved by Next.js for detail-resource handlers.
    const { id } = await params;
    const asset = await getAssetById(id);

    return NextResponse.json({
      ok: true,
      data: {
        ...asset,
        depreciation: getAssetDepreciationSnapshot(asset),
      },
      message: `Fetched asset ${id}.`,
    });
  } catch (error) {
    return buildErrorResponse(error, "Failed to fetch asset.");
  }
}

// PATCH /api/assets/:id applies a validated partial update and returns the result.
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const updatedAsset = await updateAsset(id, payload);

    return NextResponse.json({
      ok: true,
      data: {
        ...updatedAsset,
        depreciation: getAssetDepreciationSnapshot(updatedAsset),
      },
      message: `Updated asset ${id}.`,
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

    return buildErrorResponse(error, "Failed to update asset.");
  }
}

// DELETE /api/assets/:id removes one asset and returns the deleted record summary.
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const removedAsset = await deleteAsset(id);

    return NextResponse.json({
      ok: true,
      data: removedAsset,
      message: `Deleted asset ${id}.`,
    });
  } catch (error) {
    return buildErrorResponse(error, "Failed to delete asset.");
  }
}
