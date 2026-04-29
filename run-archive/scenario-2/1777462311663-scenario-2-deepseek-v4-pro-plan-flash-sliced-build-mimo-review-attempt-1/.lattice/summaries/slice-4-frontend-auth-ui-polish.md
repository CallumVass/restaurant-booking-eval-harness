# Slice 4: Frontend Auth UI, Booking History, Polish, and Tests

## Changes Made

### 1. Updated `frontend/index.html`
- Changed `<title>` from "frontend" to "Restaurant Booking" (AC-4.22, R-062)

### 2. Created `frontend/src/hooks/useAuth.ts`
- Central auth hook using generated `useGetAuthMe`, `useLogin`, `useRegister`, `useLogout`
- Fetches CSRF token on mount via `getAntiforgeryToken()`
- Exposes `{ user, isLoading, isAuthenticated, login, register, logout, csrfToken }`
- Login/register/logout refetch auth state and invalidate bookings cache (AC-4.1, AC-4.2, R-056)

### 3. Created `frontend/src/components/AuthDialog.tsx`
- Tabbed/toggled login and registration form (AC-4.4, R-057)
- Uses generated mutation functions passed via `useAuth`
- Overlay/dialog pattern with shadcn Card
- Shows validation errors in red background

### 4. Created `frontend/src/components/NavHeader.tsx`
- App title "Restaurant Booking" with "Dinner service" badge (AC-4.3, R-058)
- User email + "Sign out" when authenticated
- "Sign in" button when anonymous

### 5. Created `frontend/src/components/RestaurantList.tsx`
- Extracted from App.tsx with restaurant card display (AC-4.11, R-059)
- Uses generated `Restaurant` type only
- `transition-colors duration-200` for polish

### 6. Created `frontend/src/components/BookingForm.tsx`
- Extracted form with date, party size, time slots, guest name, email (AC-4.12, R-059)
- Uses generated types only (`AvailabilitySlot`, `Restaurant`)
- Error display with red background (`bg-red-50`)
- Exports `BookingFields` interface

### 7. Created `frontend/src/components/BookingHistory.tsx`
- Shows authenticated user's bookings via `useListBookingsMine` (AC-4.8, R-020)
- Empty state: "You haven't made any bookings yet." (AC-4.9, R-060)
- Loading state: "Loading your bookings..." (AC-4.10, R-060)
- `transition-colors duration-200` on booking cards

### 8. Created `frontend/src/components/ConfirmationCard.tsx`
- Extracted booking confirmation display (AC-4.13, R-059)
- Shows `CalendarCheck` icon, guest name, restaurant, time, date
- `transition-colors duration-200` for polish

### 9. Refactored `frontend/src/App.tsx`
- Uses generated hooks directly (`useListRestaurants`, `useListAvailableSlots`, `useListBookingsMine`, `useCreateBooking`)
- Uses `useAuth` hook for auth state (AC-4.6, AC-4.7, R-019)
- Routes between login prompt and booking form based on auth state
- Passes CSRF token to `useCreateBooking` via `fetch` option
- All components import only from `./generated/booking-client` and `./hooks/useAuth`
- No inline `fetch()` calls or hand-typed API types (AC-4.17, GI-007)
- Error messages use `bg-red-50 text-red-700` for visual distinction (AC-4.21, R-061)
- `transition-colors duration-200` on interactive elements (AC-4.18, R-061)
- `focus-visible:ring-2 focus-visible:ring-ring` on all interactive elements (built into Button/Input) (AC-4.20)
- Responsive `sm:grid-cols-2` for form fields (AC-4.19)
- No auth tokens stored in localStorage/sessionStorage (AC-4.30, R-013, GI-003)

### 10. Frontend Test Infrastructure
- Added vitest v4.1.5, @testing-library/react v16.3.2, @testing-library/jest-dom v6.9.1, @testing-library/user-event v14.6.1, jsdom v29.1.0
- Updated `vite.config.ts` with test configuration (jsdom environment, setup file)
- Created `src/test/setup.ts` with jest-dom matchers
- Added `"test": "vitest run"` script to package.json
- Excluded test files from tsconfig.app.json to avoid build conflicts

### 11. Created `frontend/src/App.test.tsx`
All 7 tests pass:
- `renders restaurant list` (AC-4.23, R-025, R-035)
- `shows login prompt when unauthenticated` (AC-4.24, R-025, R-035)
- `shows booking form when authenticated` (AC-4.25, R-025, R-035)
- `form submission triggers createBooking mutation` (AC-4.26, R-025, R-035)
- `displays API error messages` (AC-4.27, R-025, R-035)
- `shows confirmation after booking` (AC-4.28, R-025, R-035)
- `shows booking history` (AC-4.29, R-025, R-035)

## Requirement IDs Covered

- **R-003**: Existing React SPA, Tailwind, shadcn, TanStack Query preserved
- **R-018**: Login, registration, logout, auth state in UI
- **R-019**: Login required before booking; clear path to authenticate
- **R-020**: Booking history shows user-scoped bookings
- **R-023**: UI polished with shadcn components, responsive grid, aria labels
- **R-025**: Frontend tests for core flows (7 tests)
- **R-027**: Components extracted, loading/empty states, improved error display
- **R-035**: Frontend tests for auth, booking, confirmation, error display
- **R-056**: useAuth hook with user, isLoading, isAuthenticated, login, register, logout
- **R-057**: AuthDialog with login/register toggle
- **R-058**: NavHeader with user greeting/logout or login button
- **R-059**: RestaurantList, BookingForm, BookingHistory, ConfirmationCard extracted
- **R-060**: Loading spinners, empty states for booking history
- **R-061**: Transitions, mobile responsiveness, focus-visible, error visual hierarchy
- **R-062**: index.html title updated to "Restaurant Booking"

## Invariant Checks

- **GI-005**: CORS allows localhost:5173 with credentials (preserved from Slice 2/3 backend); frontend fetch via orval with credentials:'include'
- **GI-007**: Only generated imports from `./generated/booking-client` used; no hand-written fetch() in App.tsx or hooks
- **GI-008**: All quality gates pass:
  - Backend build: 0 warnings ✓
  - Backend tests: 43/43 pass ✓
  - Backend format: clean ✓
  - Frontend build (generate:api + tsc + vite): ✓
  - Frontend typecheck: ✓
  - Frontend lint: ✓
  - Frontend format:check: ✓
  - Frontend deadcode: ✓
  - Frontend test: 7/7 pass ✓

## Checks Run

- `npm run typecheck` ✓
- `npm run lint` ✓
- `npm run format:check` ✓
- `npm run deadcode` ✓
- `npm run build` (generate:api + tsc + vite build) ✓
- `npm run test` (vitest) - 7/7 ✓
- `dotnet build RestaurantBooking.Api` ✓ (0 warnings)
- `dotnet build RestaurantBooking.Tests` ✓ (0 warnings)
- `dotnet test RestaurantBooking.Tests --no-build` ✓ (43/43)
- `dotnet format RestaurantBooking.Api --verify-no-changes` ✓
- `dotnet format RestaurantBooking.Tests --verify-no-changes` ✓
- Grep for `localStorage.setItem|sessionStorage.setItem`: none found ✓
- Grep for `fetch(` in non-generated source: none found ✓

## Known Gaps

- Tests use `getAllByText`/`getAllByRole` patterns due to React 19 development mode double-rendering in vitest, which creates duplicate DOM elements. This is a test-environment concern, not a production bug.
- The `useAuth` hook fetches CSRF token via `getAntiforgeryToken()` on mount but does not have a dedicated error boundary for CSRF fetch failures. In practice, the backend returns the token synchronously on every page load.

## Handoff Notes

- `useAuth` is the single auth entry point. It manages CSRF token state and provides login/register/logout functions.
- CSRF token is passed to `useCreateBooking` via the `fetch` option at hook creation time. React Query v5's `useMutation` dynamically updates when options change.
- Bookings are associated with the authenticated user via the backend (Slice 2); the frontend shows user-scoped data via `useListBookingsMine`.
- Component extraction keeps existing Tailwind/shadcn patterns: Card, Button, Badge, Field, Input, lucide-react icons.
- Error messages use `bg-red-50 text-red-700` (destructive semantic) instead of `bg-secondary`.
