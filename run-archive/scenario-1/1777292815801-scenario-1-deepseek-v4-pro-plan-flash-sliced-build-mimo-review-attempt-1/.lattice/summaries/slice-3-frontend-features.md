# Slice 3 Summary: Frontend Pages — Restaurant List, Booking Form, Confirmation, Bookings List, Navigation

## Changes Made

### Files Created

| File | Purpose |
|------|---------|
| `frontend/src/components/Layout.tsx` | Top nav bar (Restaurants + Bookings links), sticky header, responsive container |
| `frontend/src/components/BookingCard.tsx` | Reusable restaurant card with name, cuisine badge, address, "Book a Table" button |
| `frontend/src/pages/RestaurantList.tsx` | Card grid with loading skeletons (3), error toast, empty state, uses `useGetRestaurants` |
| `frontend/src/pages/BookingForm.tsx` | Full booking form: date picker (min=today), party size (1–maxCapacity), time slot selector from `useGetAvailableSlots`, guest name/email, auto-assign notice, submit with spinner |
| `frontend/src/pages/BookingConfirmation.tsx` | Read-only booking detail (date, time, party size, guest info) with "View All Bookings" and "Book Another" links |
| `frontend/src/pages/BookingsList.tsx` | Restaurant + date selector, table view with guest name, email, time badge, party size badge, table ID |

### Files Modified

| File | Change |
|------|--------|
| `frontend/src/api/mutator.ts` | **Fixed response wrapping** — Orval generates types like `{ data: T, status: number, headers: Headers }`. The mutator now wraps raw `response.json()` into this format on success, keeping error throwing unchanged. This makes all `useGet*` and `useCreateBooking` hooks return typed responses matching their Orval-generated types. |
| `frontend/src/App.tsx` | State-based router (`useState<Route>`) with 4 routes: restaurants, booking-form, booking-confirmation, bookings. No React Router dependency per slice contract. |

### Key Design Decisions

**Mutator fix:** The original `customFetch` returned bare `response.json()`, but Orval-generated types wrap responses in `{ data, status, headers }`. Without this fix, runtime values wouldn't match TypeScript types, causing silent failures. The fix ensures `response.data` returns the correct typed payload.

**Routing:** Simple discriminated union type `Route` with `useState` — no React Router, matching the slice contract. Booking data flows through component props after mutation success.

**Booking Form slot selector:** Uses shadcn `Select` with `useGetAvailableSlots` hook (enabled only when both date and partySize are valid). Slots refetch on date/partySize change. Loading state shown inline in the dropdown. Table auto-assignment note shown after slot selection.

**Confirmation page:** Receives booking object + restaurant name from mutation `onSuccess`. Displays formatted date, time, party size badge, guest info, and navigation buttons. Table assignment shown as "will be assigned upon arrival".

## Verification Results

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | ✅ Pass (0 errors) |
| `npm run build` (gen:api + tsc -b + vite build) | ✅ Pass (407ms build, 438KB JS bundle) |
| `npx eslint . --max-warnings 0` | ✅ Pass (0 warnings, 0 errors) |
| `npx prettier --check 'src/**/*.{ts,tsx,css}'` | ✅ Pass |
| `npx knip --no-exit-code` | ✅ Pass (expected unused: Orval-generated exports, shadcn unused components, react-hook-form deps) |
| Backend `dotnet test` | ✅ 10/10 passed |
| Backend format | ✅ (no changes) |

## Acceptance Criteria Checklist

| # | Criterion | Status |
|---|-----------|--------|
| C1 | RestaurantList: card grid with skeletons, error toast, empty state | ✅ |
| C2 | Clicking restaurant navigates to booking form | ✅ |
| C3 | BookingForm: date picker (min=today), time slot selector from `/slots`, party size, guest name/email, auto-assign notice | ✅ |
| C4 | Submit calls `useCreateBooking`, on success → confirmation, on error → toast | ✅ |
| C5 | BookingConfirmation: details with links to bookings / another booking | ✅ |
| C6 | BookingsList: table with guest info, time badge, party size badge | ✅ |
| C7 | Navigation: Restaurants ↔ Bookings via top nav bar | ✅ |
| C8 | All data fetching via Orval hooks — no hand-written fetch | ✅ |
| C9 | Polished UI: responsive grid, semantic HTML, proper labels, aria attributes, focus states | ✅ |

## Known Gaps

- `BookingCard` component was extracted from the (simpler) initial design; the RestaurantList page is thin around it — this is intentional for reusability.
- BookingsList doesn't auto-select the restaurant from context (e.g. after creating a booking) — the "View All Bookings" link goes to the general BookingsList, leaving restaurant selection to the user.
- No automated tests for this slice per slice contract (visual/UX verification is manual).

## Handoff Notes

- Backend must be running on `:5000` for gen:api to work during build.
- The mutator fix is critical — without it all Orval hooks return bare response data rather than the typed wrapper.
- `npm run build` produces a fully working production bundle.
- The dev server proxy (`/api` → `:5000`) is configured in `vite.config.ts`. Start the backend first, then `npm run dev`.
