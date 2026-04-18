import { NextResponse } from "next/server";

// GET /api/assets is reserved for the Phase 1 list endpoint implementation.
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "Not implemented",
      details: "GET /api/assets will be delivered in Phase 1.",
    },
    { status: 501 }
  );
}

// POST /api/assets is reserved for the Phase 1 create endpoint implementation.
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Not implemented",
      details: "POST /api/assets will be delivered in Phase 1.",
    },
    { status: 501 }
  );
}
