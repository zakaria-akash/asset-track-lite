# Asset Track Lite

Asset Track Lite is a clean, small-scale asset management system built with
Next.js App Router, JavaScript, and TailwindCSS v4.

This project keeps frontend pages and backend API routes in one codebase on
the same runtime and port.

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

Then open <http://localhost:3000>.

### 3) Run lint checks

```bash
npm run lint
```

## Tech Stack

- Next.js (App Router)
- React
- JavaScript only (no TypeScript)
- TailwindCSS v4
- Next.js Route Handlers for backend endpoints
- JSON-backed seed data for the MVP baseline

## Visual Theme Criteria (Mandatory Before Phase 2)

- Default app theme must use a gradient combination of:
  - Dark brown: #5C4033
  - Dark green: #182c25
- These two colors must be prioritized for small UI elements:
  buttons, pills/chips, badges, compact cards, icon accents,
  active states, and subtle borders.
- During Phase 2, avoid introducing a competing primary color family.

## Current Architecture (Phase 1)

```text
src/
 app/
  page.js
  layout.js
  globals.css
  assets/
   page.js
   [id]/page.js
  add-asset/page.js
  maintenance/page.js
  search/page.js
  settings/page.js
  api/
   assets/route.js
   assets/[id]/route.js
   maintenance/route.js
   search/route.js
 lib/
  assets.js
  depreciation.js
  validation.js
  settings.js
public/
 data/
  assets.json
```

## API Plan

Phase 1 APIs are now implemented with JSON-backed persistence and
validation.

- GET and POST /api/assets
- GET, PATCH, DELETE /api/assets/:id
- POST /api/maintenance
- POST /api/search

## Coding Rules

- Use JavaScript only.
- Keep route-handler response shape consistent:
  - Success: { ok: true, data, message? }
  - Error: { ok: false, error, details? }
- Keep core business logic in src/lib, not directly inside UI pages.
- Write meaningful comments above non-trivial code blocks.
- Keep naming explicit and feature-aligned.

## Workflow Reference

Implementation phases are defined in [WorkFlow.md](WorkFlow.md):

- Phase 0: Foundation and setup
- Phase 1: Core backend domain and API implementation
- Phase 2: Core UI pages and navigation
- Phase 3: Search, maintenance, and settings persistence
- Phase 4: Hardening and quality improvements
- Phase 5: Release preparation and documentation

## Current Status

- Phase 0, Phase 1, Phase 2, and Phase 3 are completed.
- Next target phase: Phase 4.
- Active theme baseline: gradient #5C4033 + #182c25 with priority on
  small UI elements.
