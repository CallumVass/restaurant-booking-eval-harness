# Slice 5: Frontend Tests & Quality Gates

## Goal

Add focused UI/integration tests for auth and booking flows, then run all quality gate scripts and update README with auth documentation. This is the final verification and polish slice.

## Global Invariants

All invariants from `manifest.json` apply. Key invariants for this slice:
- Preserve existing Vite React SPA, Tailwind CSS v4, shadcn/ui source components, TanStack Query, Orval-generated typed client
- Preserve existing behavior: all existing flows continue to work
- Frontend quality scripts pass: build, typecheck, lint, format:check, deadcode
- TypeScript strictness preserved: verbatimModuleSyntax, noUnusedLocals, noUnusedParameters
- No external services or secrets

## Acceptance Criteria

### Frontend Tests

1. Vitest + React Testing Library + `@testing-library/jest-dom` are added as dev dependencies
2. `vitest.config.ts` exists with jsdom environment
3. `test` and `test:run` scripts added to `package.json`
4. Frontend tests pass (`npm run test:run`)

**Test files and scenarios:**

**A. `src/__tests__/AuthDialog.test.tsx`**
- Renders login/register tabs
- Login form submits email + password
- Register form validates password match
- Displays API error messages (401, 409)

**B. `src/__tests__/BookingForm.test.tsx`**
- Renders booking form fields
- Shows "Sign in to book" when unauthenticated
- Submits booking when authenticated
- Displays availability slots
- Shows error message on API failure
- Shows confirmation card on success

**C. `src/__tests__/BookingHistory.test.tsx`**
- Shows user's bookings from `/api/bookings/mine`
- Shows empty state when no bookings
- Shows loading state while fetching

### Quality Gates

5. `dotnet build RestaurantBooking.slnx` passes with warnings as errors (backend)
6. `dotnet test RestaurantBooking.slnx --no-build` passes (all tests)
7. `dotnet format RestaurantBooking.slnx --verify-no-changes` passes
8. `cd frontend && npm install` succeeds
9. `npm run generate:api` regenerates client successfully
10. `npm run build` passes (tsc -b && vite build)
11. `npm run typecheck` passes
12. `npm run lint` passes (no warnings)
13. `npm run format:check` passes
14. `npm run deadcode` passes (update `knip.json` if new files need entries)
15. No unused imports, dead code, or unused exports in backend or frontend

### README Update

16. Document seeded demo user credentials (`demo@example.com` / `Demo1234!`)
17. Document CSRF token flow: GET /api/auth/csrf → read `X-CSRF-TOKEN` header → attach to mutation requests
18. Document new endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/auth/csrf`, `GET /api/bookings/mine`
19. Document that booking creation requires authentication
20. Document that SPA must fetch CSRF token before state-changing requests
21. Update run instructions if auth setup changes anything
22. Document password validation rules (≥ 8 chars, ≥ 1 uppercase, ≥ 1 digit, ≥ 1 non-alphanumeric)

## Invariant Checks For This Slice

- Verify backend build + test + format all pass
- Verify frontend build + typecheck + lint + format:check + deadcode all pass
- Verify `npm run generate:api` is deterministic (run twice, no diff)
- Verify the checked-in OpenAPI spec matches the live backend spec at `/openapi/v1.json`
- Verify `knip.json` covers any new source files (AuthDialog, UserMenu, lib/api, lib/auth, test files)
- Verify no localStorage/sessionStorage usage exists in the final frontend code
- Verify README accurately reflects the final state (run commands, seeded users, CSRF flow)
- Run through the full user flow manually: register → login → create booking → view history → logout → verify booking persists in public view

## Required Tests

All test files under `frontend/src/__tests__/` as described above.

### Mocking strategy
- Mock Orval-generated hooks via `vi.mock("../generated/booking-client")` to keep component tests focused on rendering and interaction, not API calls
- Mock `AuthProvider` for authenticated/unauthenticated states using a test wrapper
- Test components in isolation with mocked data

## Verification Commands

```bash
# Backend
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes

# Frontend
cd frontend
npm install
npm run generate:api
npm run test:run
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Handoff Notes

- Requires Slice 1 (backend), Slice 2 (OpenAPI client), Slice 3 (frontend) all completed
- Slice 4 (backend tests) should also be complete, but this slice runs `dotnet test` which includes those tests
- This is the final slice — after this, all quality gates should be green
- If `knip` reports unused files, update `knip.json` entry paths; do not delete working code
- The README should serve as a complete reference for running and verifying the full stack

## Non-Goals

- No E2E tests with real browser automation (Playwright/Cypress)
- No performance benchmarks
- No CI/CD pipeline configuration
- No Docker or containerization
