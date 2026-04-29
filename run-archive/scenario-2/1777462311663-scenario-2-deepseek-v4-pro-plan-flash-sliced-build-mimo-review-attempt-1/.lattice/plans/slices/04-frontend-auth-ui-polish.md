# Slice 4: Frontend Auth UI, Booking History, Polish, and Tests

## Goal

Add login, registration, logout, and authenticated-user state to the React UI. Require login before booking. Show user-scoped booking history. Extract components for maintainability. Improve UI polish (transitions, responsiveness, empty/loading states, error display). Add frontend tests. All API interaction uses generated TanStack Query hooks and types exclusively.

## Global Invariants

| Invariant | Text |
|-----------|------|
| GI-005 | CORS allows localhost:5173 with credentials; all credentialed fetch requests include cookies |
| GI-007 | The generated TypeScript client from Orval is the single typed surface for frontend API interaction |
| GI-008 | All quality gates pass |

## Acceptance Criteria

| # | Criterion | Covers |
|---|-----------|--------|
| AC-4.1 | `useAuth.ts` hook exposes `{ user, isLoading, isAuthenticated, login, register, logout }` using generated hooks | R-056 |
| AC-4.2 | `useAuth` calls `useGetAuthMe` on mount to determine initial auth state | R-056, R-018 |
| AC-4.3 | `NavHeader` component displays app title, user email + logout when authenticated, "Login" button when anonymous | R-058 |
| AC-4.4 | `AuthDialog` component provides tabbed/toggled login and registration forms with email+password fields and validation errors | R-057 |
| AC-4.5 | Login/register mutations use generated TanStack Query mutation hooks (not raw fetch wrappers) | R-021, R-022, GI-007 |
| AC-4.6 | Unauthenticated user sees login prompt before the booking form; booking form is hidden or disabled | R-019 |
| AC-4.7 | "Confirm booking" when unauthenticated opens auth dialog instead of submitting | R-019 |
| AC-4.8 | `BookingHistory` component shows authenticated user's bookings via `useListBookingsMine` hook | R-020 |
| AC-4.9 | Booking history shows "You haven't made any bookings yet" empty state when no bookings exist | R-060 |
| AC-4.10 | Loading states: spinners/skeletons while queries are loading or mutating | R-060 |
| AC-4.11 | `RestaurantList` component extracted from App.tsx with restaurant cards | R-059 |
| AC-4.12 | `BookingForm` component extracted with date, party size, time slots, guest info, submit | R-059 |
| AC-4.13 | `ConfirmationCard` component shows booking confirmation after successful creation | R-059 |
| AC-4.14 | All components use only generated types (Restaurant, Booking, AvailabilitySlot, etc.) and generated hooks | R-021, GI-007 |
| AC-4.15 | CSRF token fetched from `/api/antiforgery/token` before mutations; included as X-CSRF-TOKEN header | R-011 |
| AC-4.16 | All fetch calls include `credentials: "include"` for cookie-based auth | R-012, GI-005 |
| AC-4.17 | No manual `fetch()` calls or hand-typed API types in any component or hook | R-022, GI-007 |
| AC-4.18 | UI transitions: CSS transitions on view changes | R-061 |
| AC-4.19 | Mobile responsiveness: booking form works on narrow viewports | R-023, R-061 |
| AC-4.20 | Keyboard navigation: focus-visible indicators on interactive elements | R-061 |
| AC-4.21 | Error messages visually distinct from informational text (e.g., destructive color variant) | R-023, R-061 |
| AC-4.22 | `index.html` title updated to "Restaurant Booking" | R-062 |
| AC-4.23 | Frontend test: App renders restaurant list | R-025, R-035 |
| AC-4.24 | Frontend test: Unauthenticated user sees login prompt | R-025, R-035 |
| AC-4.25 | Frontend test: Authenticated user sees booking form | R-025, R-035 |
| AC-4.26 | Frontend test: Form submission calls createBooking mutation | R-025, R-035 |
| AC-4.27 | Frontend test: API error messages display in the UI | R-025, R-035 |
| AC-4.28 | Frontend test: Booking confirmation card appears after successful booking | R-025, R-035 |
| AC-4.29 | Frontend test: Booking history shows user's bookings | R-025, R-035 |
| AC-4.30 | No auth tokens stored in localStorage or sessionStorage | R-013, GI-003 |

## Invariant Checks For This Slice

- **GI-005**: The `orval.config.ts` (from Slice 3) must have `credentials: "include"` in the fetch override. Verify by inspecting the generated client's fetch calls include `credentials: "include"`.
- **GI-007**: Grep `src/` for any `fetch(` calls or hand-written type declarations matching API shapes. Only generated import paths from `./generated/booking-client` and `@tanstack/react-query` imports should exist.
- **GI-008**: After all changes, run the full frontend quality gate: `npm install && npm run generate:api && npm run build && npm run typecheck && npm run lint && npm run format:check && npm run deadcode`.

## Required Tests

File: `frontend/src/App.test.tsx` (or similar). Use Vitest + React Testing Library or similar lightweight setup. If the existing project doesn't have test tooling configured, add minimal setup (vitest, @testing-library/react, @testing-library/jest-dom, jsdom).

| Test | Type | Covers | Contract |
|------|------|--------|----------|
| `renders restaurant list` | Automated | AC-4.23, R-025 | Render App; assert restaurant cards are present |
| `shows login prompt when unauthenticated` | Automated | AC-4.24, R-025 | Mock auth as anonymous; assert login prompt visible; booking form hidden |
| `shows booking form when authenticated` | Automated | AC-4.25, R-025 | Mock auth as authenticated; assert booking form visible |
| `form submission triggers createBooking` | Automated | AC-4.26, R-025 | Fill form fields; submit; assert mutation was called with correct payload |
| `displays API error messages` | Automated | AC-4.27, R-025 | Mock mutation response as error; assert error message visible in DOM |
| `shows confirmation after booking` | Automated | AC-4.28, R-025 | Mock mutation response as success; assert confirmation card with booking details |
| `shows booking history` | Automated | AC-4.29, R-025 | Mock bookings query; assert booking entries rendered in BookingHistory |

**Justification for manual-only tests**: If frontend test infrastructure (Vitest + RTL) cannot be set up without breaking existing toolchain, AC-4.23 to AC-4.29 are verified via documented manual walkthrough captured in slice completion notes. The implementer should prioritize adding test tooling where practical.

## Verification Commands

```bash
cd frontend
npm install                              # install any new test dependencies
npm run generate:api                     # regenerate client (if needed after Slice 3)
npm run build                            # tsc + vite build
npm run typecheck                        # TypeScript check
npm run lint                             # ESLint
npm run format:check                     # Prettier check
npm run deadcode                         # Knip unused code check
npx vitest run                           # run frontend tests (if set up)
```

## Handoff Notes

- The `useAuth` hook is the central auth state manager. It uses `useGetAuthMe` (generated query) for initial state and `useLogin`/`useRegister`/`useLogout` (generated mutations) for actions.
- CSRF token management: `useAuth` should fetch the antiforgery token on mount via a helper call to `/api/antiforgery/token` and expose it. The `useCreateBooking` mutation includes it in headers. The Orval-generated mutation hooks support a `headers` override or the Orval config must generate the header injection automatically.
- Component extraction from App.tsx: `RestaurantList`, `BookingForm`, `BookingHistory`, `ConfirmationCard`, `AuthDialog`, `NavHeader`. Keep existing Tailwind classes, shadcn components, and the warm neutral color scheme.
- `App.tsx` becomes an orchestrator: it imports extracted components, manages top-level state (`selectedRestaurantId`, `form`, `confirmation`), and composes the layout.
- Empty state for booking history: "You haven't made any bookings yet." with a subdued text style.
- Loading states: Use existing `Loader2` spinner from lucide-react with `animate-spin` class. Show inline in buttons during mutations.
- Transition polish: Add `transition-colors duration-200` to cards and buttons where it enhances feel. Avoid excessive animation.
- Error display: Error messages should use a dedicated `ErrorMessage` component or shadcn `Alert` variant with a subtle red/destructive background instead of the generic `bg-secondary` used for all messages currently.
- The `AuthDialog` uses a simple toggle between login and register modes. Keep it contained in a Card with overlay/dialog pattern consistent with shadcn.
- Ensure all existing component HTML preserves aria attributes (`aria-labelledby`, `aria-label`, `role="radiogroup"`, `aria-pressed`).
- The `index.html` title change is a single line edit: `<title>Restaurant Booking</title>`.

## Non-Goals

- This slice does NOT modify the OpenAPI spec or Orval config (done in Slice 3).
- This slice does NOT add new backend endpoints or modify backend behavior (done in Slice 2).
- This slice does NOT add full E2E testing with Playwright/Cypress.
- This slice does NOT implement password change, email verification, or password reset flows.
- This slice does NOT change the Tailwind theme or introduce new color schemes.
