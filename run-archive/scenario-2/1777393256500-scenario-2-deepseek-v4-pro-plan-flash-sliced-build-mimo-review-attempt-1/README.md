# Restaurant Booking System

Small full-stack restaurant booking system.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json`.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

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

## Authentication

The app uses cookie-based local email/password authentication with ASP.NET Core Identity-compatible patterns.

### Seeded demo user

| Field    | Value             |
|----------|-------------------|
| Email    | `demo@example.com`|
| Password | `Demo1234!`       |

### Password validation rules

- At least 8 characters
- At least 1 uppercase letter
- At least 1 digit
- At least 1 non-alphanumeric character

### Auth endpoints

| Method | Path                    | Description                         |
|--------|-------------------------|-------------------------------------|
| POST   | `/api/auth/register`    | Register a new user                 |
| POST   | `/api/auth/login`       | Log in with email + password        |
| POST   | `/api/auth/logout`      | Log out (clears auth cookie)        |
| GET    | `/api/auth/me`          | Get the currently authenticated user|
| GET    | `/api/auth/csrf`        | Fetch CSRF token                    |

### Booking endpoints

| Method | Path                                         | Description                         |
|--------|-----------------------------------------------|-------------------------------------|
| POST   | `/api/bookings`                               | Create a booking (requires auth)    |
| GET    | `/api/bookings`                               | List all bookings (public)          |
| GET    | `/api/bookings/mine`                          | List current user's bookings (auth) |

### CSRF protection

All state-changing requests (`POST`, `PUT`, `DELETE`) require a CSRF token:

1. Fetch the token: `GET /api/auth/csrf` — read the `X-CSRF-TOKEN` response header
2. Attach it as the `X-CSRF-TOKEN` request header on mutations

The SPA fetches the CSRF token on mount via the `useAuthCsrf` hook and stores it in a module-level variable (not localStorage or sessionStorage). The custom fetch mutator automatically attaches the token to all requests.

### CORS

The backend is configured to accept requests from the frontend dev origin with `credentials: "include"`. Cookies are HTTP-only and SameSite=Lax. No auth tokens are stored in localStorage or sessionStorage.

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
npm run test:run
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Behavior Covered

- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
- Authentication boundaries: booking creation and booking history require login; user isolation enforced.
- CSRF protection on all mutation endpoints.
- Frontend component tests cover auth dialog, booking form, and booking history flows.
