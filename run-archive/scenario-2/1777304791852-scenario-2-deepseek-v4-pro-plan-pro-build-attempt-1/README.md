# Restaurant Booking System

Small full-stack restaurant booking system with authenticated user accounts.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, ASP.NET Core Identity, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json` with TanStack Query hooks.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Authentication

- **Method**: Local email/password via ASP.NET Core Identity with in-memory user store.
- **Demo user**: `demo@example.com` / `Demo123!` — seeded automatically at app startup.
- **Cookie auth**: HTTP-only `.AspNetCore.Identity.Application` cookie, `SameSite=Strict`. No tokens stored in localStorage or sessionStorage.
- **CSRF**: The SPA fetches an antiforgery token from `GET /api/auth/csrf` and sends it via `X-CSRF-TOKEN` header on state-changing requests. The backend validates the token for mutation endpoints.
- **CORS**: Configured for `http://localhost:5173` with credentials.
- **User scoping**: Each booking is associated with the authenticated user. `GET /api/bookings` returns only the current user's bookings.

## Run

### Backend

```bash
dotnet run --project backend/RestaurantBooking.Api --urls http://localhost:5177
```

### Frontend

```bash
cd frontend
npm install
npm run generate:api
npm run dev
```

Open the Vite URL shown in the terminal. The dev server proxies `/api` to `http://localhost:5177`.

## Auth Flow

1. The app loads unauthenticated; public endpoints (restaurants, availability) are accessible.
2. Click "Sign in" to open the auth dialog. Use the demo credentials or register a new account.
3. After sign-in, the booking form is available. Create bookings, view your booking history.
4. Booking history is scoped to the authenticated user.

## Backend Checks

```bash
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes
```

## Frontend Checks

```bash
cd frontend
npm install
npm run generate:api
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
npm run test
```

## Behavior Covered

- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
- **Authentication**: Registration, login, logout, session persistence, user-scoped booking history, unauthenticated access rejection (401).
- **Integration tests**: HTTP-level tests via `WebApplicationFactory` covering auth boundaries, CSRF, error mapping, and user scoping.
- **Frontend tests**: Auth dialog, booking form rendering, and booking history display.
