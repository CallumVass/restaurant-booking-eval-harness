# Slice 3: Frontend Pages — Restaurant List, Booking Form, Confirmation, Bookings List, Navigation

**Estimated time:** ≈18 minutes

## Goal

Build all user-facing pages using the Orval-generated typed client and TanStack Query hooks, styled with Tailwind CSS and shadcn/ui components.

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| C1 | `RestaurantList` page shows a card grid of restaurants (name, cuisine, address) with loading skeletons, error toast, and empty state |
| C2 | Clicking a restaurant navigates to its booking form |
| C3 | `BookingForm` page includes: date picker (native, min=today), time slot selector (populated from `GET /slots`), party size input, guest name, guest email, and auto-assigned table display |
| C4 | Submitting the form calls `useCreateBooking` mutation; on success navigates to confirmation; on error shows toast with server error message |
| C5 | `BookingConfirmation` page displays booking details after successful creation with a link to view bookings |
| C6 | `BookingsList` page shows a table/badge view of bookings for a restaurant+date using `useGetBookings` |
| C7 | Navigation allows switching between Restaurants list, Booking form, and Bookings list |
| C8 | All data fetching uses TanStack Query hooks from the Orval-generated client — no hand-written `fetch` wrappers |
| C9 | UI is polished, responsive, and accessible: proper labels, focus states, keyboard navigation, aria attributes on interactive elements, semantic HTML |

## Required Tests

No automated tests in this slice — visual/UX verification is manual smoke testing.

## Files to Create/Modify

```
frontend/src/
  pages/
    RestaurantList.tsx                   — Card grid, uses useGetRestaurants
    BookingForm.tsx                      — Form with date/time/party/guest inputs, useCreateBooking
    BookingConfirmation.tsx              — Read-only booking detail view
    BookingsList.tsx                     — Table with booking rows, useGetBookings
  components/
    Layout.tsx                           — Top nav bar + content area
    BookingCard.tsx                      — Card component for a restaurant in the list
  App.tsx                                — Simple state-based routing (no React Router needed)
  main.tsx                               — (update if needed)
```

## Behavior Details

### Restaurant List
- Loading state: grid of `Skeleton` cards (3–4 placeholders)
- Error state: toast notification via `sonner`
- Empty state: "No restaurants available" message in a centered card
- Success: grid of cards with restaurant image placeholder, name, cuisine badge, address

### Booking Form
- Date input: `min` attribute set to today's date, defaults to today
- Time slot selector: dropdown populated from `/api/restaurants/{id}/slots` — refetches when date or partySize changes (enabled only when both are valid)
- Party size: number input, min=1, max=20 (or maximum table capacity)
- Auto-assigned table: displayed as a read-only badge after a slot is selected
- Submit button: disabled while mutation is pending; shows spinner
- On success: navigate to confirmation page passing booking data
- On error: `sonner` toast with the error message from the API

### Booking Confirmation
- Receives booking data (either via state or URL param)
- Displays: restaurant name, date, time, party size, guest name/email, table label
- "View All Bookings" link and "Book Another" link

### Bookings List
- Date selector (defaults to today)
- Table/grid showing: guest name, email, time, party size, table label
- Uses `Badge` component for party size and time
- Loading: skeleton rows; empty: "No bookings for this date"

### Navigation
- Top nav bar with links: "Restaurants" (/) → RestaurantList, "Bookings" (/bookings) → BookingsList
- Booking form and confirmation are sub-routes from restaurants
- Use a simple `useState<string>` router or `window.location.hash` — no React Router dependency

## Verification Commands

```bash
cd frontend && npm run dev
```

Manual smoke test: navigate restaurants → select one → create booking → see confirmation → view bookings → verify conflict on overlapping booking.

## Handoff Notes

- All API calls go through the Orval-generated hooks. Do not write manual `fetch` or `axios` calls.
- The generated hooks already handle loading/error/data states via TanStack Query.
- Toast notifications use `sonner` (installed via shadcn/ui toast setup).
- Keep components under 150 lines where possible — extract sub-components if needed.

## Non-Goals

- React Router (use simple state-based navigation to keep scope tight)
- Form library (native HTML form with controlled inputs)
- Authentication
- E2E browser tests
