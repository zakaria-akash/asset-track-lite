# Asset Track Lite - Implementation Workflow

This document defines the end-to-end implementation plan for
Asset Track Lite. We will execute the project phase-by-phase from
Phase 0 to Phase 5.

## Project Boundaries

- Stack: Next.js App Router, JavaScript only, TailwindCSS v4.
- Architecture: frontend and backend in the same Next.js project, same port.
- Data layer (initial): JSON-backed local dataset and helper utilities.
- Scope (MVP): asset listing, details, create asset, maintenance logs,
  search, settings, depreciation calculation.
- Default visual theme (mandatory): background gradient using dark brown
  (#5C4033) and dark green (#182c25).
- Color priority rule (mandatory): dark brown and dark green must be
  prioritized for small UI elements (buttons, chips, tags, badges,
  small borders, icons, active states, and highlights).

## Phase Status

- Phase 0: Completed
- Phase 1: Completed
- Phase 2: Completed
- Phase 3: Completed
- Phase 4 to Phase 5: Pending

## Phase 0 - Foundation and Project Setup

### Phase 0 Goal

Prepare a clean, stable development baseline with agreed conventions
and core structure.

### Phase 0 Tasks

- Confirm baseline dependencies and scripts in package.json.
- Ensure TailwindCSS v4 pipeline is active
  (postcss config + global import).
- Establish folder structure for src/app routes, src/lib helpers,
  and public/data.
- Define coding rules:

- JavaScript only (no TypeScript).
- Consistent naming for routes, helpers, and UI components.
- Validation and error-response pattern for API routes.

- Add starter dataset file at public/data/assets.json
  with 3 to 5 realistic sample assets.
- Add README sections for run steps, architecture,
  and phase workflow reference.

### Phase 0 Deliverables

- Running Next.js app baseline.
- Initial folder/file skeleton for all MVP pages and APIs.
- Seed asset JSON data.

### Phase 0 Exit Criteria

- npm run lint passes.
- App starts successfully.
- Folder skeleton matches agreed architecture.

## Phase 1 - Core Domain and Backend APIs

### Phase 1 Goal

Implement the backend foundation and domain helpers used by all
frontend screens.

### Phase 1 Tasks

- Build core helper modules in src/lib:

- assets.js: read/list/get/create/update/delete operations.
- depreciation.js: straight-line depreciation functions.
- validation.js (or inside assets.js): payload validation rules.

- Implement API routes:

- src/app/api/assets/route.js: GET list, POST create.
- src/app/api/assets/[id]/route.js: GET one, PATCH update, DELETE.
- src/app/api/maintenance/route.js: add maintenance entry.
- src/app/api/search/route.js: query by name/category/code/serial.

- Standardize API response shape:

- success: { ok: true, data, message? }
- error: { ok: false, error, details? }

- Implement depreciation calculation in list/detail payloads.
- Add basic server-side input checks
  (required fields, numeric/date sanity).

### Phase 1 Deliverables

- Fully working MVP APIs with JSON-backed storage logic.
- Reusable depreciation and validation helpers.

### Phase 1 Exit Criteria

- Manual API checks succeed for CRUD/search/maintenance.
- Depreciation returns expected values for sample data.
- Error responses are consistent across endpoints.

## Phase 2 - Core UI Pages and Navigation

### Phase 2 Goal

Deliver the main user interface structure and asset workflow pages.

### Phase 2 Tasks

- Build app shell/navigation (top bar or sidebar) for routes:

- /assets
- /add-asset
- /maintenance
- /search
- /settings

- Implement Asset List page:

- table/cards with name, category, status, purchase price,
  depreciated value.
- responsive layout for desktop and mobile.

- Implement Add Asset page:

- form fields for asset core data.
- validation feedback and submit handling.

- Implement Asset Detail page (/assets/[id]):

- purchase/validity metadata.
- assignment history view.
- maintenance log view.
- depreciation summary.

- Apply minimal theme direction from guides (dark, clean, readable).
- Apply mandatory color system before other UI polish work:

- page-level gradient must combine #5C4033 and #182c25.
- small UI elements must use the same two colors as primary accents.
- avoid introducing a competing primary color family during Phase 2.

### Phase 2 Deliverables

- Navigable frontend for all primary pages.
- Connected create/list/detail flows.

### Phase 2 Exit Criteria

- User can create an asset and see it in list/detail screens.
- UI is responsive and usable on common viewport sizes.
- No blocking console/runtime errors.

## Phase 3 - Search, Maintenance Flow, and Settings Persistence

### Phase 3 Goal

Complete user productivity features and local preference persistence.

### Phase 3 Tasks

- Implement Search page and interactions:

- search input + optional filters (name/category/code/serial).
- show results with quick links to details.

- Implement Maintenance page:

- add maintenance record to selected asset.
- show recent maintenance entries.

- Implement settings module in src/lib/settings.js:

- display mode
- table density
- font size
- localStorage read/write with safe defaults.

- Connect Settings page UI to persistent storage.
- Ensure settings are applied globally where relevant.

### Phase 3 Deliverables

- Fully working search, maintenance, and settings experience.
- localStorage-based user preferences.

### Phase 3 Exit Criteria

- Search returns expected assets for valid queries.
- Maintenance entries persist and appear in relevant views.
- Settings persist across page refreshes.

## Phase 4 - Hardening, Quality, and UX Refinement

### Phase 4 Goal

Stabilize behavior, improve reliability, and polish user experience.

### Phase 4 Tasks

- Improve empty, loading, and error states across pages.
- Add confirmation guards for destructive actions (delete/update).
- Improve validation messaging for forms and APIs.
- Add utility test coverage
  (at minimum for depreciation and validators).
- Run lint, fix warnings/errors, and clean dead code.
- Optional: lightweight performance checks for large list rendering.

### Phase 4 Deliverables

- More robust and user-safe app behavior.
- Cleaner codebase with core utility tests.

### Phase 4 Exit Criteria

- Core user flows are stable under normal and invalid inputs.
- Utility tests pass.
- Lint passes with no critical warnings.

## Phase 5 - Release Preparation and Documentation

### Phase 5 Goal

Prepare the project for handoff/deployment and future iteration.

### Phase 5 Tasks

- Finalize README:

- setup and run instructions.
- architecture overview.
- API endpoint list.
- known limitations and next-step roadmap.

- Produce API reference summary with request/response examples.
- Add sample environment notes if future DB migration is planned.
- Create release checklist for MVP acceptance.
- Tag a stable MVP baseline in git.

### Phase 5 Deliverables

- Release-ready documentation and stable MVP baseline.

### Phase 5 Exit Criteria

- New developer can set up and run using README only.
- MVP scope from Overview is demonstrably complete.
- Team sign-off on phase completion.

## Working Method (How We Execute)

For each phase, we follow this mini-cycle:

- Confirm phase scope from this document.
- Implement backend-first for required data contracts.
- Implement frontend against those contracts.
- Validate with lint + manual flow checks.
- Summarize completed items and update next phase backlog.

## Initial Build Order Recommendation

- Phase 0
- Phase 1
- Phase 2
- Phase 3
- Phase 4
- Phase 5

## Notes for Future Scaling

- If JSON storage becomes limiting, move data handlers in src/lib/assets.js
  to a DB adapter without changing route contracts.
- Keep API contract stable so frontend pages remain unaffected by
  storage migration.
