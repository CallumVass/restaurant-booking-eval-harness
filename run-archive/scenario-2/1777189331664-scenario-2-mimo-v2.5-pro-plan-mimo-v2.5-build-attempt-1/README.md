# Restaurant Booking System

Small full-stack restaurant booking system with user authentication.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, ASP.NET Core Identity, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json`.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Authentication

- Uses ASP.NET Core Identity with an in-memory EF Core store.
- HTTP-only cookies for session management (SameSite=Lax, no Secure flag for local dev).
- CSRF protection via anti-forgery tokens. The SPA fetches a token from `GET /api/auth/csrf` and sends it as the `X-CSRF-TOKEN` header on state-changing requests (booking creation, login, logout).
- All credentials flow through HTTP-only cookies. No tokens are stored in localStorage or sessionStorage.

### Seeded Users

Two demo users are seeded on startup:

| Email              | Password   |
|--------------------|------------|
| alice@example.com  | Password1! |
| bob@example.com    | Password1! |

You can register new accounts through the UI.

### Auth Endpoints

| Method | Path               | Description                     |
|--------|--------------------|---------------------------------|
| GET    | `/api/auth/csrf`   | Returns a CSRF token            |
| POST   | `/api/auth/register` | Create account, signs in       |
| POST   | `/api/auth/login`    | Sign in with email/password    |
| POST   | `/api/auth/logout`   | Sign out                       |
| GET    | `/api/auth/me`       | Get current user (requires auth) |

### Protected Endpoints

| Method | Path           | Auth Required | CSRF Required |
|--------|----------------|---------------|---------------|
| GET    | `/api/bookings`  | Yes          | No            |
| POST   | `/api/bookings`  | Yes          | Yes           |

### Public Endpoints

| Method | Path                                       | Description                  |
|--------|--------------------------------------------|------------------------------|
| GET    | `/api/restaurants`                           | List all restaurants         |
| GET    | `/api/restaurants/{id}/availability`         | Check available time slots   |

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
```

## Behavior Covered

- Restaurant list, availability lookup, and create booking endpoints.
- User authentication (register, login, logout, current user).
- Booking creation requires authentication and CSRF token.
- Bookings are scoped to the authenticated user.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- HTTP integration tests cover auth boundaries, user-scoped bookings, CSRF, and error mapping.
- Expected business failures use Result-style errors mapped to `400`, `401`, `404`, or `409` responses.
