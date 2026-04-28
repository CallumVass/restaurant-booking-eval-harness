# Slice 3 Summary: UI Polish + Backend HTTP Tests + Frontend Tests

## Changes Made

### Backend
- **Created `BookingHttpTests.cs`** — 8 new HTTP integration tests covering:
  - OpenAPI endpoint reachability (`GET /openapi/v1.json` returns 200)
  - Invalid party size → 400 with correct error message
  - Unknown restaurant → 404
  - Overlapping reservation → 409
  - Adjacent non-overlapping bookings → both succeed
  - Past date validation → 400
  - Too-far-future date validation → 400
  - Capacity limit (book all tables, try one more → 409)

### Frontend — New files
- `src/components/PageShell.tsx` — Max-width container layout extracted from App.tsx
- `src/components/BookingForm.tsx` — Extracted from inline code in App.tsx for testability. Contains date/party/time selection, guest info, submission with CSRF, confirmation display, and slot picker
- `src/test/setup.ts` — MSW server initialization with beforeAll/afterAll/afterEach lifecycle
- `src/test/mocks.ts` — MSW handlers for all API endpoints (restaurants, availability, bookings, auth, CSRF)
- `src/test/test-utils.tsx` — `renderWithProviders()` wrapper with QueryClientProvider + AuthProvider
- `src/App.test.tsx` — 4 tests: restaurant list rendering, sign-in buttons when unauthenticated, auth dialog on click, sign-in prompt for booking form
- `src/components/AuthDialog.test.tsx` — 3 tests: login form rendering, login/register toggle, null when closed
- `src/components/BookingForm.test.tsx` — 5 tests: field rendering, heading, available times display, disabled button, validation message
- `src/components/MyBookings.test.tsx` — 2 tests: booking history when authenticated, heading/description

### Frontend — Modified files
- `src/App.tsx` — Extracted PageShell layout wrapper, extracted BookingForm component, added responsive grid, improved stat display (no bookings query dependency for hero stats), added empty state for restaurants, added key prop for tab transitions
- `vite.config.ts` — Added test configuration (globals, jsdom, setupFiles)
- `knip.json` — Added `src/test/**` to ignore list
- `package.json` — Added devDependencies: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, msw, jsdom

### UI Polish details
- PageShell provides consistent max-width container with responsive padding
- Hero header stats no longer depend on bookings query (shows static 4 stats: Restaurants, Seat window, Duration, Max party)
- Empty state for restaurants shows an icon and message instead of empty list
- Tab key added for "my-bookings" to ensure re-mount on tab switch
- `animate-in fade-in` removed (plugin not installed) — clean Tailwind v4 classes only

### Key Design Decisions
- **MSW handlers use relative URLs** matching the generated client's fetch calls (e.g., `/api/restaurants`)
- **Default auth state is unauthenticated** in MSW — `/api/auth/me` returns 401 unless a `.AspNetCore.Cookies` cookie header is present
- **BookingForm extracted** as its own component for direct testability without App-level rendering
- **renderWithProviders** creates fresh QueryClient (retry: false, gcTime: 0) for clean test isolation

## Verification Results

### Backend
- `dotnet build RestaurantBooking.slnx` — passes (0 warnings, 0 errors)
- `dotnet test RestaurantBooking.slnx --no-build` — 35/35 pass (8 existing domain + 27 existing HTTP + 8 new HTTP)
- `dotnet format RestaurantBooking.slnx --verify-no-changes` — passes

### Frontend
- `npm run typecheck` — passes (0 errors)
- `npm run build` — passes (generate:api → tsc → vite build)
- `npm run lint` — passes (0 errors, 0 warnings)
- `npm run format:check` — passes (all files Prettier-compliant)
- `npm run deadcode` — passes (1 config hint for knip ignore, expected)
- `npx vitest run` — 14/14 pass (4 test files)

## Known Gaps
- No README updates (deferred to Slice 4 per plan)
- No animations/transitions (tailwindcss-animate not in dependencies; deferred or opt-in later)
- Frontend tests use MSW with relative URL matching; works with jsdom but carries the standard MSW caveats around fetch interception
- BookingForm test for full submission → confirmation flow is not included (requires managing mutation state + CSRF headers + auth state synchronously in test)

## Handoff Notes
- Backend test count grows: 8 (BookingRulesTests) + 27 (existing auth + booking HTTP) + 8 (new BookingHttpTests) = 35 total
- Frontend tests require `msw` in `node_modules` and the `setupFiles` config in vite.config.ts
- `renderWithProviders` wraps with both `QueryClientProvider` and `AuthProvider` — auth state resolves asynchronously in all tests
- The MSW `auth/me` handler returns 401 by default (no auth cookie); override with `server.use()` in tests needing authenticated state
- The `BookingForm` component and `PageShell` component are new exports — ensure they stay in knip entry scanning
