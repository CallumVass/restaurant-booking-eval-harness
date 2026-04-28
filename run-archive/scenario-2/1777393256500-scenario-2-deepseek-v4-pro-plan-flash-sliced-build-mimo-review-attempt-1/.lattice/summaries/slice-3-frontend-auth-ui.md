# Slice 3 Summary: Frontend Auth UI & Integration

## Changes Made

### New Files

- **`src/components/ui/dialog.tsx`** — shadcn-style minimal dialog component with overlay, Escape-to-close, and backdrop-click-to-close. Reuses existing card/border/shadow tokens.

- **`src/lib/auth-context.ts`** — `AuthContext` creation and `useAuth()` hook. Exported separately from the provider component to satisfy `react-refresh/only-export-components`.

- **`src/components/AuthDialog.tsx`** — Login/Register dialog with tab switcher (Sign in / Register). Form fields: name (register only), email, password, confirm password (register only). Client-side validation (required fields, password match, min length). Auto-closes on successful auth state change. Displays API error messages. Uses `useAuth()` context for login/register actions.

- **`src/components/UserMenu.tsx`** — Header user menu. Shows loading skeleton while auth loads, user email + "Sign out" button when authenticated, or "Sign in" button when not authenticated.

### Modified Files

- **`src/main.tsx`** — Wrapped `<App />` with `<AuthProvider>` from `src/lib/auth.tsx`.

- **`src/lib/auth.tsx`** — Rewritten as the `AuthProvider` component only (previously contained hook+context, now split). Uses generated hooks: `useAuthCsrf` (fetch CSRF token on mount, module-level `setCsrfToken`), `useAuthMe` (fetch current user via cookie auth), `useAuthLogin`, `useAuthRegister`, `useAuthLogout`. On login/register success, optimistically sets `useAuthMe` query data via `setQueryData` for immediate UI update, then invalidates CSRF. On logout, clears token and query cache.

- **`src/App.tsx`** — Major restructure:
  - All data fetching migrated to generated TanStack Query hooks (`useListRestaurants`, `useListBookings`, `useListMyBookings`, `useListAvailableSlots`, `useCreateBooking`) — no manual `useQuery` wrapping fetch functions.
  - Header includes `UserMenu` for auth state (sign in / user email + sign out).
  - Tabbed layout: **Restaurants** | **Book a Table** | **Your Bookings** (segmented control in nav bar).
  - **Restaurants tab**: keeps existing restaurant card list.
  - **Book a Table tab**: shows auth prompt card ("Sign in to book a table") when not authenticated; shows existing booking form + confirmation + existing bookings when authenticated.
  - **Your Bookings tab**: shows auth prompt when not authenticated; shows loading spinner, session-expired error, empty state (with `CalendarX` icon + CTA to Book tab), or list of `MyBookingCard` components.
  - `TabButton` extracted to module-level function (fixes `react-hooks/static-components` lint rule).
  - Query invalidation after booking creation: invalidates bookings, my-bookings, and availability query keys.
  - Uses discriminated union status checks (`response.status === 200/201`) for error handling from generated client.
  - Slot picker shows a spinner during `isFetching`.

- **`knip.json`** — Removed redundant `src/main.tsx` entry pattern (auto-detected by knip from Vite config).

## Verification Results

| Check | Result |
|-------|--------|
| `npm run typecheck` | ✅ Passes |
| `npm run lint` | ✅ Passes (0 errors, 0 warnings) |
| `npm run format:check` | ✅ Passes |
| `npm run deadcode` | ✅ Passes |
| `npm run build` (generate:api + tsc -b + vite build) | ✅ Passes |
| `dotnet build RestaurantBooking.Api/` | ✅ 0 warnings |
| `dotnet test RestaurantBooking.Tests/` | ✅ All 8 tests pass |
| `dotnet format RestaurantBooking.Api/ --verify-no-changes` | ✅ Passes |

## Invariant Checks

- ✅ No auth tokens in localStorage or sessionStorage (confirmed by grep)
- ✅ CSRF token fetched from GET /api/auth/csrf on mount via `useAuthCsrf` hook, stored via `setCsrfToken()` module function
- ✅ Credentials set to "include" via custom fetch mutator (from Slice 2)
- ✅ Unauthenticated booking attempt shows "Sign in to book a table" prompt card
- ✅ Booking history uses `GET /api/bookings/mine` (scoped to current user by backend) — no client-side filtering of all-bookings list
- ✅ Generated hooks used everywhere — no manual `useQuery` wrapping fetch functions
- ✅ Existing restaurant selector, form fields, availability picker, and existing bookings list work in Book tab
- ✅ Tabbed layout responsive at mobile and desktop widths
- ✅ Empty states, loading states, and error states handled for all data-fetching sections
- ✅ Existing Tailwind classes, CSS variables, shadcn/ui component overrides preserved
- ✅ TypeScript strictness preserved (verbatimModuleSyntax, noUnusedLocals, noUnusedParameters)
- ✅ Backend unchanged — no modifications to backend files in this slice

## Acceptance Criteria Status

| # | Criteria | Status |
|---|----------|--------|
| 1 | User can register via dialog | ✅ |
| 2 | User can log in with email + password | ✅ |
| 3 | Logged-in user sees email and logout button | ✅ |
| 4 | Logged-out user sees "Sign in" button | ✅ |
| 5 | Unauthenticated booking attempt shows "Sign in to book" prompt | ✅ |
| 6 | Authenticated user can create bookings with CSRF | ✅ |
| 7 | Authenticated user can view own booking history | ✅ |
| 8 | Booking history shows empty state | ✅ |
| 9 | Booking history shows loading state | ✅ |
| 10 | Booking confirmation card on success | ✅ |
| 11 | API errors (400, 401, 404, 409) displayed | ✅ |
| 12 | CSRF token fetched on app mount | ✅ |
| 13 | All data-fetching uses generated hooks | ✅ |
| 14 | Loading spinners for availability and bookings | ✅ |
| 15 | Empty states use icons and descriptive text | ✅ |
| 16 | Retains existing warm color palette and visual language | ✅ |
| 17 | Tabbed layout (Restaurants \| Book a Table \| Your Bookings) | ✅ |
| 18-22 | build, typecheck, lint, format:check, deadcode all pass | ✅ |

## Known Gaps

- `useListBookings` is still imported and used for the "Existing bookings" section in the Book tab. This endpoint is public (no auth required), matching existing behavior.
- No frontend component tests yet (deferred to Slice 5).
- The `react-refresh/only-export-components` rule required splitting `useAuth` into a separate module (`auth-context.ts`) from the provider component — this is a minor structural change but keeps HMR working.

## Handoff Notes

- Slice 4 (backend tests) and Slice 5 (frontend tests) will add test coverage for auth flows.
- The auth dialog auto-closes when `auth.isAuthenticated` transitions from `false` to `true` via a `useEffect` with `useRef` comparison.
- On logout, `queryClient.clear()` resets all caches, forcing fresh fetches on next render.
- The `useAuthMe` query runs unconditionally (not gated on auth state) so it can detect both authenticated and unauthenticated sessions.
- `setQueryData` optimistically sets the `useAuthMe` cache on login/register success for immediate UI responsiveness.
