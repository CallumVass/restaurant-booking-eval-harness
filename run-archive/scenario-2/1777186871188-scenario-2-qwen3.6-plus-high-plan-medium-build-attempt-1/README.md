# Restaurant Booking System

Small full-stack restaurant booking system with authenticated user accounts.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence with ASP.NET Core Identity, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json`.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Authentication

The app uses cookie-based authentication with HTTP-only cookies and CSRF protection.

- **Demo user**: `demo@example.com` / `Demo123!`
- **Registration**: Create a new account via the sign-in dialog.
- **CSRF**: State-changing requests (login, logout, booking creation) require an `X-CSRF-TOKEN` header. The SPA fetches this token on mount from `GET /api/auth/csrf-token`.
- **Cookies**: Auth cookies are `HttpOnly`, `SameSite=Lax`, and `SecurePolicy=None` for local development over HTTP. Tokens are never stored in localStorage or sessionStorage.

## Run

```bash
dotnet run --project backend/RestaurantBooking.Api --urls http://localhost:5177
```

```bash
cd frontend
npm install
npm run generate:api
npm run dev
```

Open the Vite URL shown in the terminal. The dev server proxies `/api` to `http://localhost:5177`.

## Backend Checks

```bash
dotnet build RestaurantBooking.slnx
ASPNETCORE_ENVIRONMENT=Test dotnet test RestaurantBooking.slnx --no-build
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
```

## Behavior Covered

- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Authenticated booking creation — unauthenticated users receive 401.
- User-scoped booking history at `GET /api/users/me/bookings`.
- Auth endpoints: register, login, logout, me, csrf-token.
- CSRF protection on state-changing endpoints (skipped in Test environment for automated testing).
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `401`, `404`, or `409` responses.
- HTTP endpoint tests cover auth boundaries, user-scoped history, 401/400/404/409 mapping, CSRF enforcement, and OpenAPI availability.
