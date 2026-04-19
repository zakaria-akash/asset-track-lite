
# 🛠 AssetTrack Lite — Backend Guide

Backend lives **inside the Next.js project**, using built‑in API Routes.
All backend logic runs on **the same port** as the frontend.

JavaScript only — no TypeScript.

---

## 📌 Backend Tech
- Node.js API Routes (Next.js `app/api/...`)
- Optional custom Express/Hono server
- JSON or MongoDB data storage
- Simple controllers for asset CRUD

## 📐 Cross-Document UI Contract (Reference)

- Before Phase 2 UI implementation, the frontend must use the mandatory
  default gradient based on #5C4033 and #182c25.
- The same two colors must be prioritized for small UI elements
  (buttons, chips, badges, icon accents, and compact borders).
- Backend APIs should remain theme-agnostic, but this contract is tracked
  here to keep planning alignment across frontend and backend workstreams.

---

## 📁 Backend Structure
```
/app/api
  /assets/route.js        # GET (list), POST (create)
  /assets/[id]/route.js   # GET, PATCH, DELETE
  /maintenance/route.js   # Add maintenance log
  /search/route.js        # Search assets

/lib/assets.js            # Data operations
/lib/depreciation.js      # Calculation helper
```

---

## 📦 Sample Asset JSON Structure
```json
{
  "id": "A001",
  "name": "Laptop Dell XPS",
  "category": "Electronics",
  "purchaseDate": "2021-02-12",
  "purchasePrice": 1350,
  "validity": "2025-02-12",
  "status": "in-use",
  "maintenance": [],
  "assignmentHistory": []
}
```

---

## 🧮 Depreciation Example
Straight‑line formula:
```
depreciation = (purchasePrice / usefulYears) * yearsPassed
```

---

## 🔍 Search API Example
```js
export async function POST(req) {
  const { query } = await req.json();
  const data = require('@/public/data/assets.json');

  const results = data.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  return Response.json({ results });
}
```

---
