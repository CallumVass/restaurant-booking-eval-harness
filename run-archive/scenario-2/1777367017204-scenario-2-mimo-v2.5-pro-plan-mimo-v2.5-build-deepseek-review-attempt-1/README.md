# Restaurant Booking System

Small full-stack restaurant booking system with user authentication.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json`.
- Auth: ASP.NET Core Identity with HTTP-only cookie authentication.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

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

## Authentication

### Demo User

- Email: `demo@example.com`
- Password: `Demo123!`

### How It Works

- Users authenticate via HTTP-only cookies (no tokens in localStorage/sessionStorage).
- A CSRF token must be fetched from `GET /api/auth/csrf` and sent as `X-CSRF-TOKEN` header on all state-changing requests (POST/PUT/DELETE).
- The frontend automatically manages CSRF tokens and includes them in auth and booking requests.
- CORS is configured for `http://localhost:5173` (Vite dev server) with `AllowCredentials`.

### Auth Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/csrf` | Get CSRF token |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Get current user |

### Protected Endpoints

- `POST /api/bookings` — requires authentication
- `GET /api/bookings/mine` — returns only the authenticated user's bookings

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
- HTTP-level integration tests for all endpoints including auth boundaries, user-scoped booking history, and OpenAPI availability.
- Frontend tests for auth UI, user navigation, and component behavior.
