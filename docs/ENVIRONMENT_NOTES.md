# Environment and Migration Notes

This note captures operational assumptions for the current MVP and a safe
path to a future database-backed architecture.

## Current Environment Assumptions

- Runtime: Next.js App Router on Node.js.
- Storage: local JSON file at public/data/assets.json.
- Scope: single-developer or low-concurrency local/preview usage.
- Authentication: not enabled in MVP.
- Secret management: no required runtime secrets for current MVP behavior.

## Local Run Configuration

- No .env file is required for the current JSON-backed mode.
- Standard commands:
  - npm install
  - npm run dev
  - npm run lint
  - npm run test
  - npm run build

## Future Database Migration (Suggested)

To migrate safely without breaking UI contracts:

1. Keep API route paths unchanged.
2. Keep response shape unchanged.
3. Move read/write logic behind lib adapter boundaries.
4. Add schema migrations and seed scripts.
5. Add transactional guarantees for update/delete operations.

## Suggested Future Environment Variables

Use names like these when moving to a database:

- DATABASE_URL
- DATABASE_POOL_MIN
- DATABASE_POOL_MAX
- APP_ENV

## Operational Guardrails for Migration

- Add API integration tests before switching persistence layer.
- Roll out read path first, then write path.
- Keep JSON mode as fallback during transition.
- Validate depreciation and maintenance behavior parity after migration.
