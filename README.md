# Asset Track Lite

Asset Track Lite is a single-repo asset management MVP built with Next.js
App Router and JavaScript. Frontend pages and backend route handlers run in
the same project and share one deployment/runtime boundary.

## Setup and Run

### Prerequisites

- Node.js 20+
- npm 10+

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

App URL: <http://localhost:3000>

### Quality Gates

```bash
npm run lint
npm run test
npm run build
```

## Architecture Overview

### Stack

- Next.js App Router
- React
- JavaScript only (no TypeScript)
- TailwindCSS v4
- Next.js Route Handlers
- JSON-backed file persistence (MVP)

### Runtime Design

- UI routes live in src/app.
- API routes live in src/app/api.
- Domain logic and validation live in src/lib.
- Dataset is stored in public/data/assets.json.
- Settings are persisted in browser localStorage.

### Current Project Map

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

## API Endpoint List

- GET /api/assets
- POST /api/assets
- GET /api/assets/:id
- PATCH /api/assets/:id
- DELETE /api/assets/:id
- POST /api/maintenance
- POST /api/search

Detailed examples are documented in
[docs/API_REFERENCE.md](docs/API_REFERENCE.md).

## API Response Contract

- Success: { ok: true, data, message? }
- Error: { ok: false, error, details? }

## Mandatory Theme Rules

- Background gradient must combine #5C4033 and #182c25.
- Small UI elements must prioritize these two colors:
  buttons, chips, badges, icon accents, active states, and small borders.
- Do not introduce a competing primary color family for core controls.

## Known Limitations (MVP)

- Storage is file-based JSON and not intended for concurrent write load.
- No authentication or role-based authorization is implemented.
- No database migrations or transactional persistence layer.
- No pagination/virtualization for very large datasets.
- No automated end-to-end browser test suite yet.

## Next-Step Roadmap

- Introduce database adapter with unchanged API contracts.
- Add authentication and action-level authorization.
- Add pagination and indexing for large asset collections.
- Add export/reporting and operational dashboards.
- Add CI pipeline for lint, tests, and build verification.

## Release Preparation Artifacts

- Phase workflow: [WorkFlow.md](WorkFlow.md)
- API summary and request/response examples:
  [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
- Environment and migration notes:
  [docs/ENVIRONMENT_NOTES.md](docs/ENVIRONMENT_NOTES.md)
- MVP acceptance checklist:
  [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md)

## Current Status

- Phase 0, Phase 1, Phase 2, Phase 3, Phase 4, and Phase 5 are completed.
- Project state is ready for MVP tagging and handoff.
