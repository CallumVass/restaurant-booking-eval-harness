# Restaurant Booking System

Small eval implementation with a .NET 10 minimal API and a React + TypeScript SPA.

## Backend

```bash
dotnet run --project src/RestaurantBooking.Api
```

- API base URL: `http://localhost:5076`
- OpenAPI document: `http://localhost:5076/openapi/v1.json`
- Swagger-style UI: `http://localhost:5076/scalar/v1`

Quality checks:

```bash
dotnet build -p:TreatWarningsAsErrors=true
dotnet test --no-build
dotnet format --verify-no-changes
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The SPA defaults to `http://localhost:5076` for the API. Override it with `VITE_API_BASE_URL` if needed.

Quality checks:

```bash
npm run build
npm run typecheck
npm run lint
npm run format:check
npm run deadcode
```

## Behavior

- Lists seeded restaurants and existing bookings.
- Creates bookings with in-memory persistence.
- Rejects invalid party sizes, invalid dates/times, unknown restaurants, and overlapping reservations.
- Lists available slots by restaurant, date, and party size.
