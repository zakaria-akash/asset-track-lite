# MVP Release Checklist

Use this checklist before tagging the stable MVP baseline.

## Quality Gates

- [ ] npm install completes without blocking errors.
- [ ] npm run lint passes.
- [ ] npm run test passes.
- [ ] npm run build passes.

## Functional Verification

- [ ] Asset list page loads with expected items or clear empty state.
- [ ] Add Asset flow creates records successfully.
- [ ] Asset detail page supports status update and delete confirmation flow.
- [ ] Search returns expected results and handles no-result scenarios.
- [ ] Maintenance creation works and appears in relevant asset context.
- [ ] Settings persist after browser refresh.

## API Contract Verification

- [ ] All endpoints in docs/API_REFERENCE.md are reachable.
- [ ] Success responses match { ok: true, data, message? }.
- [ ] Error responses match { ok: false, error, details? }.

## Documentation and Handoff

- [ ] README includes setup, architecture, API list, limitations, and roadmap.
- [ ] API examples are documented and readable.
- [ ] Environment migration notes are documented.
- [ ] WorkFlow phase status reflects Phase 5 completion.

## Tagging and Handoff

- [ ] Working tree is clean.
- [ ] Commit message clearly references Phase 5 completion.
- [ ] Stable tag is created (example: v1.0.0-mvp).
- [ ] Release notes summary is prepared for team sign-off.
