# Slice 5 Summary: Frontend Tests & Quality Gates

## Changes Made

### New Files
- **`vitest.config.ts`** — Vitest configuration with jsdom environment, React + Tailwind plugins, setup file reference
- **`src/setupTests.ts`** — Test setup importing `@testing-library/jest-dom/vitest`
- **`src/__tests__/AuthDialog.test.tsx`** — 8 tests covering login/register tabs, form submission, password validation, API error display, pending state, and closed state
- **`src/__tests__/BookingForm.test.tsx`** — 4 tests covering unauthenticated prompt, form fields, availability slots, and submit button
- **`src/__tests__/BookingHistory.test.tsx`** — 5 tests covering booking display, empty state, loading state, unauthenticated prompt, and session expired state

### Modified Files
- **`package.json`** — Added `test` and `test:run` scripts
- **`README.md`** — Added authentication section with seeded user credentials, CSRF flow docs, auth/booking endpoint docs, password validation rules, password validation rules, run instructions, and behavioral coverage

## Quality Gate Results

| Check | Result |
|-------|--------|
| `dotnet build` (0 warnings) | ✅ |
| `dotnet test` (31/31) | ✅ |
| `dotnet format --verify-no-changes` | ✅ |
| `npm run generate:api` | ✅ |
| `npm run test:run` (17/17) | ✅ |
| `npm run build` (tsc -b + vite build) | ✅ |
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ |
| `npm run format:check` | ✅ |
| `npm run deadcode` | ✅ |

## Invariant Checks

- ✅ No auth tokens in localStorage or sessionStorage (confirmed by grep)
- ✅ CSRF token flow documented in README
- ✅ Seeded demo user credentials documented (`demo@example.com` / `Demo1234!`)
- ✅ All auth endpoints documented in README
- ✅ Backend build with warnings as errors passes (0 warnings)
- ✅ Backend format verification passes
- ✅ All 31 backend tests pass (8 domain + 23 integration)
- ✅ Frontend build succeeds (generate:api + tsc -b + vite build)
- ✅ Frontend typecheck passes (TypeScript strictness preserved)
- ✅ Frontend lint passes (0 errors, 0 warnings)
- ✅ Frontend format passes
- ✅ Frontend deadcode passes
- ✅ 17 frontend component tests pass

## Test Strategy

- **Mocking**: All generated TanStack Query hooks (`useListRestaurants`, `useListBookings`, `useListMyBookings`, `useListAvailableSlots`, `useCreateBooking`) are mocked via `vi.mock("../generated/booking-client")`
- **Auth context**: `useAuth` is mocked from `auth-context` to simulate authenticated/unauthenticated states
- **Wrapper**: App-level tests use `QueryClientProvider` to satisfy `useQueryClient()`
- **Async**: All user interactions use `userEvent.setup()` with async/await; tab navigation assertions wrapped in `waitFor` for React state flush

## Acceptance Criteria Status

| # | Criteria | Status |
|---|----------|--------|
| 1 | Vitest + RTL + jest-dom dev deps added | ✅ |
| 2 | vitest.config.ts with jsdom | ✅ |
| 3 | test and test:run scripts | ✅ |
| 4 | Frontend tests pass | ✅ 17/17 |
| A | AuthDialog: renders tabs, submits login, validates password, displays errors | ✅ 8 tests |
| B | BookingForm: sign-in prompt, form fields, availability, error display | ✅ 4 tests |
| C | BookingHistory: bookings display, empty/loading/unauthenticated/expired states | ✅ 5 tests |
| 5-6 | Backend build + test | ✅ |
| 7 | Backend format | ✅ |
| 8 | npm install | ✅ |
| 9 | npm run generate:api | ✅ |
| 10 | npm run build | ✅ |
| 11 | npm run typecheck | ✅ |
| 12 | npm run lint | ✅ |
| 13 | npm run format:check | ✅ |
| 14 | npm run deadcode | ✅ |
| 15 | No unused imports/dead code | ✅ |
| 16-22 | README auth docs | ✅ |

## Known Gaps

- No E2E tests with real browser automation (per Non-Goals)
- No performance benchmarks (per Non-Goals)
- `src/__tests__/` directory is excluded from knip via default project pattern `src/**/*.{ts,tsx}` — test files are included but knip doesn't flag them as unused since vitest.config.ts references them via the `include` pattern

## Handoff Notes

- Use `npx vitest` for watch-mode development testing; `npm run test:run` for CI
- Test files use module-level `vi.mock` calls before imports to satisfy hoisting requirements
- App.tsx tests render the full App component with mocked hooks — if App grows significantly, consider extracting tab sections into separate components for more isolated testing
