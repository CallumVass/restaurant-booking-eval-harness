# Slice 4: End-to-End Integration Verification + README

## Goal

Verify the full stack works end-to-end through manual smoke testing, ensure all quality gates pass cleanly, and update the README with complete documentation for auth, seeded users, CSRF behavior, new endpoints, and updated run instructions.

## Acceptance Criteria

- [ ] Full auth flow works: register → logout → login → create booking → view own history.
- [ ] User A cannot see User B's bookings in `/api/bookings/mine` or via UI.
- [ ] Unauthenticated users are prompted to sign in when attempting to create a booking.
- [ ] CSRF tokens are sent on all mutation requests (login, register, logout, create booking).
- [ ] All backend quality gates pass: `dotnet build`, `dotnet test --no-build`, `dotnet format --verify-no-changes`.
- [ ] All frontend quality gates pass: `build`, `typecheck`, `lint`, `format:check`, `deadcode`.
- [ ] Frontend tests pass: `npx vitest run`.
- [ ] README documents seeded demo users, auth flow, CSRF behavior, new endpoints, and updated run instructions.
- [ ] README documents how to regenerate the typed client (`npm run generate:api`).
- [ ] No dead code, unused exports, or warnings in either backend or frontend.

## Required Tests

- No new tests in this slice. All tests from previous slices must pass.
- Manual smoke test checklist documented in README.

## Verification Commands

```bash
# Full backend quality gate
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes

# Full frontend quality gate
cd frontend
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
npx vitest run
```

### Manual smoke test checklist (documented in README)

1. Start backend: `dotnet run --project backend/RestaurantBooking.Api --urls http://localhost:5177`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser at Vite URL
4. Click "Sign in" → register a new user with email, password, display name
5. Verify user is now shown as authenticated (name in header)
6. Log out, log back in with same credentials
7. Select a restaurant, choose a date/time/party size, fill in guest details, confirm booking
8. Verify booking confirmation appears
9. Navigate to "My Bookings" tab → verify booking appears
10. Open a private/incognito window, register/log in as a different user
11. Verify that user cannot see the first user's booking in "My Bookings"
12. Log out and try to access the booking form → verify auth prompt appears
13. Open browser dev tools → verify CSRF token cookie and `X-CSRF-TOKEN` header on mutations
14. Verify no auth tokens in localStorage or sessionStorage

## Handoff Notes

- **File modified**: `README.md`
- README must document: stack overview, seeded demo users (alice/bob with credentials), how to run backend and frontend, how to run tests, how to regenerate API client, auth flow description, CSRF behavior description, new endpoints (`/api/auth/*`, `/api/bookings/mine`), manual smoke test checklist.
- No code changes in this slice unless fixing issues found during integration verification.

## Non-Goals

- No new features.
- No external services or hosted databases.
- No CI/CD configuration.
- No production deployment guide.
- No performance testing or load testing.
