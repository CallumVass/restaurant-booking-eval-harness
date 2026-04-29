# Slice 5: Documentation, Cleanup, and Final Verification

## Goal

Update README with auth instructions, seeded demo user credentials, CSRF behavior, and new endpoint documentation. Verify all quality gates pass end-to-end. Ensure no dead code, no unused exports, no formatting issues, no lint violations, and no secrets in the repository.

## Global Invariants

All 11 global invariants must be verified end-to-end in this slice:
- GI-001: Result-style errors mapped to HTTP codes
- GI-002: Booking domain rules unchanged pure functions
- GI-003: HTTP-only cookies, no localStorage tokens
- GI-004: CSRF protection on all state-changing endpoints
- GI-005: CORS + credentialed requests
- GI-006: User-scoped data isolation
- GI-007: Generated client is single typed surface
- GI-008: All quality gates pass
- GI-009: No external services or secrets
- GI-010: Public endpoints remain public
- GI-011: Domain types preserve signatures

## Acceptance Criteria

| # | Criterion | Covers |
|---|-----------|--------|
| AC-5.1 | README documents seeded demo users (alice@example.com / bob@example.com, both password Demo1234!) | R-037 |
| AC-5.2 | README explains HTTP-only cookie auth and CSRF token behavior | R-037 |
| AC-5.3 | README lists all new `/api/auth/*` endpoints and `/api/antiforgery/token` | R-037 |
| AC-5.4 | README documents that `GET /api/bookings` was replaced by `GET /api/bookings/mine` | R-037, R-051 |
| AC-5.5 | README documents that `frontend/openapi/restaurant-booking.json` remains the source of truth for client generation | R-037 |
| AC-5.6 | README run instructions unaffected (commands unchanged; additional context added) | R-037 |
| AC-5.7 | `.gitignore` excludes `node_modules`, `frontend/dist`, `backend/bin`, `backend/obj`, `.env` | R-036 |
| AC-5.8 | `dotnet build RestaurantBooking.slnx` passes with TreatWarningsAsErrors (exit code 0) | R-040, GI-008 |
| AC-5.9 | `dotnet test RestaurantBooking.slnx --no-build` passes all backend tests | R-041, GI-008 |
| AC-5.10 | `dotnet format RestaurantBooking.slnx --verify-no-changes` passes (exit code 0) | R-042, GI-008 |
| AC-5.11 | `npm install && npm run generate:api && npm run build && npm run typecheck && npm run lint && npm run format:check && npm run deadcode` all pass | R-043, GI-008 |
| AC-5.12 | No dead code or unused exports in backend (verified via manual inspection + dotnet build warnings) | R-036 |
| AC-5.13 | No dead code or unused exports in frontend (verified via `npm run deadcode`) | R-036 |
| AC-5.14 | Architecture preserved: Domain.cs pure functions, BookingStore.cs imperative shell, Program.cs endpoint mappings | R-028, R-031, R-033 |
| AC-5.15 | Changes are minimal focused edits (not wholesale replacements of existing files beyond what auth requires) | R-028, R-030 |
| AC-5.16 | Any deviations from the saved plan are documented in this slice's Handoff Notes or README | R-045 |
| AC-5.17 | No secrets, connection strings to external services, or API keys in any committed file | R-038, GI-009 |

## Invariant Checks For This Slice

- **GI-002**: Re-run existing domain tests (`BookingRulesTests.cs`) and verify they pass unchanged. Confirm `BookingRules` class has not been modified.
- **GI-003**: Grep frontend `src/` for `localStorage`, `sessionStorage`. No matches involving auth tokens.
- **GI-004**: Check that every POST endpoint in the final codebase has CSRF validation (inspect Program.cs endpoint mappings).
- **GI-005**: Inspect `Program.cs` CORS configuration and `orval.config.ts` credentials setting.
- **GI-006**: Run the `ListBookingsMine_UserIsolation` test from Slice 2 and verify it still passes.
- **GI-007**: Grep `frontend/src/` for `fetch(` and manual type imports. Only generated types from `./generated/booking-client` should exist.
- **GI-008**: Execute the full verification pipeline (below).
- **GI-009**: Inspect all `.csproj` files for forbidden package references. Inspect all `.json`/`.cs` files for secrets.
- **GI-010**: Run HttpIntegrationTests that test public endpoints without auth.
- **GI-011**: Verify `Booking` record has additive `UserId` field; `BookingRules` signatures unchanged.

## Required Tests

All tests were added in prior slices. This slice is purely verification. No new tests.

| Verification | Type | Covers |
|-------------|------|--------|
| Full backend pipeline (build + test + format) | Automated | AC-5.8, AC-5.9, AC-5.10, GI-008 |
| Full frontend pipeline (install + generate + build + typecheck + lint + format + deadcode) | Automated | AC-5.11, GI-008 |
| README review for completeness | Manual | AC-5.1 to AC-5.6, R-037 |
| Codebase audit for secrets and external services | Manual | AC-5.17, GI-009 |
| Architecture audit (diff review) | Manual | AC-5.14, AC-5.15 |

## Verification Commands

```bash
# From repo root:

# Backend verification
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes

# Frontend verification
cd frontend
npm install
npm run generate:api
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

All commands must exit with code 0.

## Handoff Notes

- The README should maintain its existing structure (Stack, Run, Backend Checks, Frontend Checks sections) while adding auth-specific content.
- Document the demo users clearly in a new `## Auth` section or inline with stack description.
- Document the CSRF flow: SPA fetches token from `/api/antiforgery/token`, includes it as `X-CSRF-TOKEN` header on mutations.
- Document that Vite dev server proxies `/api` to backend, and CORS is configured for `localhost:5173`.
- If any deviation from the saved plan was necessary (e.g., Orval configuration differences, Identity setup approach), document it in the Handoff Notes section of this slice file and in the README if user-facing.
- Verify `.gitignore` includes `frontend/dist` (Vite build output), `backend/bin`, `backend/obj`, `node_modules`, `frontend/node_modules`, `.env` files, and any auth-related auto-generated files.
- The `RestaurantBooking.Api.http` file currently references an unrelated weather forecast endpoint. Consider removing or updating it, but this is not a requirement.
- Perform a final diff review of all changed files against the saved plan to ensure alignment (or document deviations).

## Non-Goals

- This slice does NOT add new features, endpoints, or UI components.
- This slice does NOT modify test assertions (tests already passing from prior slices).
- This slice does NOT create additional documentation files beyond README updates.
- This slice does NOT add CI/CD configuration or deployment scripts.
