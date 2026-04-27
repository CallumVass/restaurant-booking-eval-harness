# Restaurant Booking Eval

Focused in-memory restaurant booking system for Scenario 1.

## Backend

- .NET 10 minimal API in `backend/RestaurantBooking.Api`.
- Pure booking rules live in `Domain/BookingRules.cs`; `BookingStore` is the thin in-memory shell.
- OpenAPI is exposed at `http://localhost:5105/openapi/v1.json`.

Run the API:

```bash
dotnet run --project backend/RestaurantBooking.Api/RestaurantBooking.Api.csproj
```

Backend verification:

```bash
dotnet build RestaurantBooking.slnx
dotnet test RestaurantBooking.slnx --no-build
dotnet format RestaurantBooking.slnx --verify-no-changes
```

## Frontend

- React SPA in `frontend` with Tailwind CSS, shadcn-style local components, and TanStack Query.
- Orval generates `src/api/generated/restaurant-booking.ts` from `openapi/restaurant-booking.openapi.json`.
- The checked-in OpenAPI file mirrors the backend contract and keeps client generation reproducible without requiring a running backend.

Run the SPA:

```bash
cd frontend
npm install
npm run api:generate
npm run dev
```

Frontend verification:

```bash
cd frontend
npm run api:generate
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
npm run build
```

## Behavior

- List restaurants and existing bookings.
- List available half-hour start times for a restaurant, date, and party size.
- Create bookings with conflict prevention per table.
- Validate unknown restaurants, invalid party size, past dates, invalid start times, no capacity, and overlapping reservations.

## Notes

The implementation follows the saved plan. The only deliberate simplification is using a checked-in OpenAPI contract for Orval generation instead of generating the client from a live backend process during `npm run build`; this keeps frontend scripts deterministic in a clean eval workspace while the backend still exposes a usable OpenAPI document.
