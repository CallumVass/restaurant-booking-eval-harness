# Slice 3: Frontend Auth UI & Integration

## Goal

Add login, registration, logout, and authenticated-user state to the existing SPA; require login before booking creation; show the authenticated user's booking history; migrate all data-fetching to the generated TanStack Query hooks from Slice 2; and improve UI polish while preserving the existing visual language.

## Global Invariants

All invariants from `manifest.json` apply. Key invariants for this slice:
- Preserve existing Vite React SPA, Tailwind CSS v4, shadcn/ui source components, TanStack Query usage
- Preserve existing behavior: restaurant list, booking list, availability lookup, booking creation with conflict prevention; all validation rules continue to work
- Auth uses HTTP-only cookies only; no localStorage or sessionStorage for tokens
- CSRF/anti-forgery protection via X-CSRF-TOKEN header and CORS with credentials
- Frontend quality scripts pass: lint, format:check, deadcode, build, typecheck
- TypeScript strictness preserved: verbatimModuleSyntax, noUnusedLocals, noUnusedParameters
- No external services or secrets

## Acceptance Criteria

1. User can register (email + password + confirm) via a dialog or form
2. User can log in with email + password
3. Logged-in user sees their email and a logout button
4. Logged-out user sees a "Sign in" button
5. Unauthenticated user attempting to submit a booking sees "Sign in to book" prompt with a clear path to authenticate
6. Authenticated user can create bookings (CSRF token is sent automatically)
7. Authenticated user can view their own booking history in a "Your Bookings" tab/section
8. Booking history shows empty state when no bookings exist
9. Booking history shows loading state while fetching
10. Booking confirmation card shows on successful booking
11. API error messages (401, 409, 400, 404) are displayed to the user clearly
12. CSRF token is fetched on app mount (GET /api/auth/csrf) and attached to all mutation requests
13. All data-fetching uses generated TanStack Query hooks from Slice 2 (no manual `useQuery` wrapping generated fetch functions)
14. UI includes loading skeletons or spinners for availability and bookings sections
15. Empty states use lucide-react icons and descriptive text
16. The UI retains its existing warm color palette, typography (Inter), spacing, and card-based layout
17. The single-page experience is enhanced with a tabbed/sectioned layout (Restaurants | Book a Table | Your Bookings) while staying within the existing card/form visual language
18. `npm run build` passes
19. `npm run typecheck` passes
20. `npm run lint` passes
21. `npm run format:check` passes
22. `npm run deadcode` passes

## Invariant Checks For This Slice

- Verify no auth tokens are stored in localStorage or sessionStorage (search for `localStorage`, `sessionStorage`)
- Verify CSRF token is fetched from GET /api/auth/csrf and sent as `X-CSRF-TOKEN` header on mutations
- Verify `credentials: "include"` is set on all fetch requests to send cookies
- Verify unauthenticated booking attempt shows a visible prompt, not a silent failure
- Verify booking history only shows the current user's bookings (backend enforces this; verify no client-side filtering of all-bookings list)
- Verify generated hooks are used from `./generated/booking-client` — no hand-written `fetch()` calls or stringly-typed `useQuery` with raw URLs
- Verify the existing restaurant selector, form fields, availability picker, and existing bookings list still work
- Verify the UI is responsive at mobile and desktop widths
- Verify empty states, loading states, and error states are handled for all data-fetching sections
- Verify existing Tailwind classes, CSS variables, and shadcn/ui component overrides are not broken

## Required Tests

Frontend tests are covered in Slice 5. This slice's verification is manual/exploratory:
- Register a new user, then log out and log back in
- Create a booking while authenticated; verify it appears in "Your Bookings"
- Attempt booking creation while logged out; verify auth prompt appears
- Verify booking history is scoped to current user (register two users, book with each)

## Verification Commands

```bash
cd frontend
npm install
npm run generate:api
npm run typecheck
npm run build
npm run lint
npm run format:check
npm run deadcode
```

## Handoff Notes

- Requires Slice 1 (backend auth + booking protection) running
- Requires Slice 2 (generated React Query hooks) for the new hook imports
- The CSRF token flow: app mounts → `useQuery(["auth", "csrf"])` calls GET /api/auth/csrf → token stored in React state via AuthProvider → custom Orval mutator reads token from context and attaches as `X-CSRF-TOKEN` header
- `AuthProvider` context wraps the app in `main.tsx` and provides CSRF token + current user state
- `knip.json` may need updating to include new component files (`AuthDialog.tsx`, `UserMenu.tsx`, `src/lib/api.ts`, `src/lib/auth.tsx`)
- The Vite dev proxy (`/api` → `http://localhost:5177`) handles cookie forwarding automatically when `credentials: "include"` is set

## Non-Goals

- No client-side routing (single-page app with section toggling is sufficient)
- No password strength meter or email validation beyond HTML5 inputs
- No persistent "remember me" beyond the cookie's expiration
- No account settings page
- No backend changes
