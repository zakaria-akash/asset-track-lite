import { NextResponse } from "next/server";

// POST /api/maintenance is reserved for the Phase 1 maintenance endpoint implementation.
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Not implemented",
      details: "POST /api/maintenance will be delivered in Phase 1.",
    },
    { status: 501 }
  );
}
