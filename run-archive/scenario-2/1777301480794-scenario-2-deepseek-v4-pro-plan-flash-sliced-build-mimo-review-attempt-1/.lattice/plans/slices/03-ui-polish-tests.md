# Slice 3: UI Polish + Backend HTTP Tests + Frontend Tests

## Goal

Improve the visual layout with a proper `PageShell` wrapper and tabbed navigation, polish booking confirmation and empty/error states, add remaining backend HTTP-level integration tests for OpenAPI reachability and edge-case HTTP behavior, and add focused frontend integration tests for the core auth and booking flows.

## Acceptance Criteria

- [ ] `PageShell` component provides max-width container, padding, and consistent section spacing, extracted from `App.tsx`.
- [ ] Tabbed navigation in `NavHeader` switches between "Restaurants" view and "My Bookings" view with smooth transitions.
- [ ] Booking confirmation card has clearer success messaging with booking details.
- [ ] Empty states (no bookings, no slots) have consistent styling with icons.
- [ ] Error states have improved card styling and message clarity.
- [ ] Responsive grid layout works at all breakpoints.
- [ ] Backend HTTP tests cover: OpenAPI endpoint reachable at `/openapi/v1.json`, 400 for invalid party size, 404 for unknown restaurant, 409 for overlapping reservation, adjacent non-overlapping bookings, date/time validation via HTTP, capacity limits via HTTP.
- [ ] Frontend tests cover: `App` renders restaurant list and auth sign-in button, `AuthDialog` login/register form submission and error display, `BookingForm` date/party/time selection, form submission, error display, confirmation, `MyBookings` booking history display with loading and empty states.
- [ ] Frontend tests use Vitest + Testing Library + MSW.

## Required Tests

### Backend HTTP tests (`BookingHttpTests.cs`)
- `GET /openapi/v1.json` returns 200 with valid JSON
- Create booking via HTTP with invalid party size → 400, correct error message
- Create booking via HTTP with unknown restaurant → 404
- Create booking via HTTP with overlapping time → 409
- Create adjacent non-overlapping bookings via HTTP → both succeed
- Date validation via HTTP (past date, too far future)
- Capacity limit: book all tables, try one more → 409

### Frontend tests
- `src/App.test.tsx`: renders restaurant list, renders sign-in button when unauthenticated, shows auth dialog on click
- `src/components/AuthDialog.test.tsx`: login with valid credentials, login error on invalid credentials, toggle between login/register
- `src/components/BookingForm.test.tsx`: date/party/time selection, guest name/email input, form submission with valid data, error display on conflict/validation errors, confirmation after success
- `src/components/MyBookings.test.tsx`: shows booking history when authenticated, empty state when no bookings, loading state

## Verification Commands

```bash
# Backend
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes

# Frontend
cd frontend
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
npx vitest run
```

## Handoff Notes

- **Backend test file created**: `backend/RestaurantBooking.Tests/BookingHttpTests.cs`
- **Frontend files created**: `src/components/PageShell.tsx`, `src/App.test.tsx`, `src/components/AuthDialog.test.tsx`, `src/components/BookingForm.test.tsx`, `src/components/MyBookings.test.tsx`, `src/test/setup.ts`
- **Frontend files modified**: `src/App.tsx` (extract layout to PageShell, tab navigation, polish), `package.json` (add vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, msw, jsdom), `vite.config.ts` (add test config), `knip.json` (update entries), `tsconfig.app.json` (add vitest globals types if needed)
- Existing `BookingRulesTests.cs` pure-domain tests continue to pass.
- Preserve existing visual language (Tailwind, shadcn/ui components, existing color tokens).
- MSW handlers should mirror the OpenAPI spec including auth-protected endpoints and CSRF token flow.

## Non-Goals

- No new auth or booking business logic.
- No changes to the OpenAPI spec or generated client (unless fixing gaps found in Slice 2).
- No README updates (that's Slice 4).
