import { NextResponse } from "next/server";

// POST /api/search is reserved for the Phase 1 search endpoint implementation.
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Not implemented",
      details: "POST /api/search will be delivered in Phase 1.",
    },
    { status: 501 }
  );
}
