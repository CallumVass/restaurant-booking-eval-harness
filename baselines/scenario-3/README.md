# Restaurant Booking Eval

Small restaurant booking system for Scenario 2: .NET 10 Minimal API backend, React SPA frontend, Tailwind/shadcn-style UI components, TanStack Query, and an Orval-generated typed API client.

## Structure

- `backend/RestaurantBooking.Api` - .NET 10 API with in-memory restaurants, tables, and bookings.
- `backend/RestaurantBooking.Tests` - xUnit integration tests through the API surface.
- `frontend` - Vite React SPA using Tailwind CSS, shadcn/ui-style local components, TanStack Query, and Orval.
- `frontend/openapi/restaurant-booking.json` - OpenAPI source used by Orval to regenerate the typed client.

## Run Backend

```bash
dotnet run --project backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj --urls http://localhost:5062
```

OpenAPI is served at `http://localhost:5062/openapi/v1.json`. In-memory data resets when the API restarts.

## Run Frontend

```bash
cd frontend
npm install
npm run generate:api
npm run dev
```

The SPA expects the API at `http://localhost:5062`, matching the OpenAPI document and generated client.

## Verification

Backend:

```bash
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes
```

Frontend:

```bash
cd frontend
npm install
npm run generate:api
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
npm run build
```

## Notes

- The implementation follows the saved plan: vertical slices for restaurant listing, availability, booking creation, and existing bookings.
- Conflict and availability logic lives in pure domain functions; endpoints and the in-memory store are thin imperative shells.
- Expected business failures return explicit result errors mapped to ProblemDetails-style responses.
- The frontend does not use handwritten fetch wrappers; it consumes the Orval-generated typed TanStack Query hooks in `frontend/src/api/generated/restaurant-booking.ts`.
- `frontend/openapi/restaurant-booking.json` is checked in so client generation is deterministic during `npm run build`.
