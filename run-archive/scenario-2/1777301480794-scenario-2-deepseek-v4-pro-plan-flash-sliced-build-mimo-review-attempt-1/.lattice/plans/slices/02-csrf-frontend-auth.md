# Slice 2: CSRF Protection + Frontend Auth UI + Client Regeneration

## Goal

Add ASP.NET Core antiforgery protection for cookie auth, build login/registration/logout UI components, regenerate the Orval TypeScript client with TanStack Query hooks (switch from `client: "fetch"` to `client: "react-query"`), wire up authenticated user state, guard the booking form behind authentication, and add user-scoped booking history UI.

## Acceptance Criteria

- [ ] `GET /api/auth/csrf-token` returns a CSRF token cookie and the token value in the response body.
- [ ] `ValidateAntiForgeryToken` filter is applied to all state-changing endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/bookings`.
- [ ] Frontend fetches the CSRF token on load and includes `X-CSRF-TOKEN` header in all mutation requests.
- [ ] `orval.config.ts` is updated to `client: "react-query"`; running `npm run generate:api` produces TanStack Query hooks (`useListRestaurants`, `useCreateBooking`, etc.).
- [ ] Frontend components use generated TanStack Query hooks instead of wrapping generated fetch functions by hand.
- [ ] `NavHeader` component shows "Sign in" button when unauthenticated and user name + "Sign out" when authenticated, plus tab navigation for "Restaurants" and "My Bookings".
- [ ] `AuthDialog` component has login and register forms with toggle, error display, and form validation.
- [ ] Booking form is gated: unauthenticated users see an auth prompt instead of the booking form.
- [ ] `MyBookings` component shows the current user's booking history using the generated `useGetBookingsMine` hook.
- [ ] No auth tokens stored in localStorage or sessionStorage.
- [ ] Backend CORS accepts credentialed requests from `http://localhost:5173`.

## Required Tests

- No new backend tests in this slice (auth/booking HTTP tests are in Slice 1).
- Frontend tests are deferred to Slice 3.

## Verification Commands

```bash
# Backend
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes

# Frontend
cd frontend
npm run generate:api
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Handoff Notes

- **Backend additions**: Antiforgery middleware + `GET /api/auth/csrf-token` endpoint in `Program.cs`, `ValidateAntiForgeryToken` on mutation endpoints.
- **Frontend files created**: `src/components/AuthDialog.tsx`, `src/components/NavHeader.tsx`, `src/components/MyBookings.tsx`, `src/hooks/useAuth.ts`, `src/hooks/useCsrf.ts`
- **Frontend files modified**: `orval.config.ts` (change client), `openapi/restaurant-booking.json` (add auth endpoints, schemas, security), `src/App.tsx` (auth gating, generated hooks, tab layout), `src/main.tsx` (auth provider)
- **Regenerated output**: `src/generated/booking-client.ts` (via `npm run generate:api`)
- The OpenAPI spec (`frontend/openapi/restaurant-booking.json`) must be updated with all auth endpoints, request/response schemas, security schemes, and 401 responses before regeneration.
- knip.json may need entries for new components and hooks.
- The existing visual language (shadcn/ui Card, Button, Input, Field, Badge) is preserved.

## Non-Goals

- No UI layout overhaul (that's Slice 3).
- No frontend tests (that's Slice 3).
- No README updates (that's Slice 4).
- No e2e verification checklist (that's Slice 4).
