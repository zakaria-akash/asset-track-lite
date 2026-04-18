import { NextResponse } from "next/server";

// GET /api/assets/:id is reserved for the Phase 1 detail endpoint implementation.
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "Not implemented",
      details: "GET /api/assets/:id will be delivered in Phase 1.",
    },
    { status: 501 }
  );
}

// PATCH /api/assets/:id is reserved for the Phase 1 update endpoint implementation.
export async function PATCH() {
  return NextResponse.json(
    {
      ok: false,
      error: "Not implemented",
      details: "PATCH /api/assets/:id will be delivered in Phase 1.",
    },
    { status: 501 }
  );
}

// DELETE /api/assets/:id is reserved for the Phase 1 delete endpoint implementation.
export async function DELETE() {
  return NextResponse.json(
    {
      ok: false,
      error: "Not implemented",
      details: "DELETE /api/assets/:id will be delivered in Phase 1.",
    },
    { status: 501 }
  );
}
