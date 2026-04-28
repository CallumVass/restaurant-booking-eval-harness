# Restaurant Booking System

Small full-stack restaurant booking system with authenticated booking accounts.

## Stack

- Backend: .NET 10 minimal Web API, in-memory persistence, OpenAPI at `/openapi/v1.json`.
- Frontend: Vite React SPA, Tailwind CSS, shadcn/ui-style source components, TanStack Query.
- API client: Orval-generated TypeScript client from `frontend/openapi/restaurant-booking.json`.
- Auth: ASP.NET Core cookie authentication (HTTP-only cookies), CSRF protection.

The frontend OpenAPI source is checked in so typed-client generation is deterministic without requiring a running backend during CI-style checks. It mirrors the backend endpoints, and the backend also exposes a live OpenAPI document for inspection and regeneration workflows.

## Seeded Demo Users

Two demo users are seeded at backend startup:

| Email               | Password    | Display Name |
|---------------------|-------------|-------------|
| `alice@example.com` | `Demo1234!` | Alice       |
| `bob@example.com`   | `Demo1234!` | Bob         |

Use these for quick manual testing, or register new users through the UI.

## Authentication

### Auth Flow

1. **Registration**: `POST /api/auth/register` with `{ email, password, displayName }`. A session cookie is set on success.
2. **Login**: `POST /api/auth/login` with `{ email, password }`. A session cookie is set on success.
3. **Logout**: `POST /api/auth/logout`. Clears the session cookie.
4. **Me**: `GET /api/auth/me`. Returns the current user's info (or 401 if unauthenticated).

### Auth Rules

- A user must be authenticated to create a booking.
- A user can view their own booking history at `GET /api/bookings/mine`.
- Users cannot view another user's booking history.
- No auth tokens are stored in `localStorage` or `sessionStorage`.

### CSRF Protection

State-changing requests (login, register, logout, create booking) require CSRF protection:

1. The SPA fetches a CSRF token on load via `GET /api/auth/csrf-token`.
2. The response sets an antiforgery cookie and returns a token value.
3. All mutation requests include the `X-CSRF-TOKEN` header with the token value.
4. The `UseAntiforgery()` middleware validates the token on every non-idempotent request.

CSRF tokens are stored in React state (never in `localStorage` or `sessionStorage`).

### Cookie Configuration (Local Development)

- **HTTP-only**: True — prevents JavaScript access to the auth cookie.
- **SameSite**: Lax — CSRF protection is handled via the antiforgery token, but SameSite adds a defence-in-depth layer.
- **Secure**: None — allows HTTP in local development (no HTTPS required locally).
- **Credentials**: `include` — CORS is configured for `http://localhost:5173` with `AllowCredentials()`.

## Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List all restaurants |
| GET | `/api/restaurants/{id}/availability` | Available time slots for a restaurant |
| GET | `/api/bookings` | List all bookings (demo/diagnostic) |
| GET | `/api/auth/csrf-token` | Get CSRF token (used by SPA) |
| GET | `/api/auth/me` | Current user info (401 if unauthenticated) |
| GET | `/openapi/v1.json` | OpenAPI specification |

### Authenticated
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in with email/password |
| POST | `/api/auth/logout` | Log out current user |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/mine` | Current user's booking history |

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
npx vitest run
```

## Regenerate API Client

When the OpenAPI spec at `frontend/openapi/restaurant-booking.json` changes (or after backend changes), regenerate the typed client:

```bash
cd frontend
npm run generate:api
```

This is also run as part of `npm run build`.

## Behavior Covered

- Restaurant list, booking list, availability lookup, and create booking endpoints.
- Conflict prevention rechecked inside the in-memory store when a booking is created.
- Boundary tests cover invalid party size, invalid dates, invalid times, unknown restaurants, adjacent non-overlapping bookings, overlapping reservations, and capacity limits.
- Expected business failures use Result-style errors mapped to `400`, `404`, or `409` responses.
- Auth boundary tests: registration, login/logout, duplicate emails, invalid credentials, user-scoped booking history, and unauthenticated access protection.
- CSRF token validation for all mutation endpoints.
- Frontend integration tests with MSW for auth, booking creation, and booking-history flows.

### Error Mappings

| Condition | HTTP Status | Example |
|-----------|------------|---------|
| Invalid party size | 400 | Party size must be between 1 and 8 |
| Invalid date/time | 400 | Bookings must be at least 24 hours ahead |
| Unknown restaurant | 404 | Restaurant not found |
| Overlapping reservation | 409 | Time slot conflicts with existing booking |
| Capacity full | 409 | No tables available for requested party size |
| Duplicate email | 409 | Email already registered |
| Invalid credentials | 401 | Invalid email or password |
| Unauthenticated | 401 | Authentication required |
| Invalid CSRF token | 400 | Anti-forgery token validation failed |

## Manual Smoke Test Checklist

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
14. Verify no auth tokens in `localStorage` or `sessionStorage`
