# Restaurant Booking System

A full-stack restaurant table booking application with a .NET 10 Web API backend and React SPA frontend.

## Prerequisites

- .NET 10 SDK
- Node.js 18+
- npm or pnpm

## Project Structure

```
.
├── backend/                    # .NET 10 Web API
│   ├── RestaurantBooking.Api   # Controllers, DTOs, Infrastructure
│   ├── RestaurantBooking.Domain # Entities, Services, Errors
│   └── RestaurantBooking.Tests # Unit tests
├── frontend/                   # React SPA (Vite + TypeScript)
│   ├── src/
│   │   ├── api/              # Generated Orval client
│   │   ├── components/       # UI components
│   │   └── lib/             # Utilities
│   └── openapi.json         # OpenAPI spec for client generation
└── README.md
```

## Running the Application

### Backend

```bash
cd backend
dotnet run --project RestaurantBooking.Api
```

The API starts on `http://localhost:5000` with Swagger UI available at the root URL.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` with API proxy to `http://localhost:5000`.

## Frontend Scripts

| Script                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run build`        | Generate API client (Orval) and build production bundle |
| `npm run typecheck`    | Run TypeScript type checking                            |
| `npm run lint`         | Run ESLint                                              |
| `npm run format:check` | Check code formatting with Prettier                     |
| `npm run deadcode`     | Check for unused code (TS)                              |
| `npm run generate`     | Regenerate API client from OpenAPI spec                 |

## API Endpoints

| Method | Endpoint                                              | Description              |
| ------ | ----------------------------------------------------- | ------------------------ |
| GET    | `/api/restaurants`                                    | List all restaurants     |
| GET    | `/api/restaurants/{id}`                               | Get restaurant details   |
| GET    | `/api/restaurants/{id}/tables`                        | Get restaurant tables    |
| GET    | `/api/restaurants/{id}/availability?date=&partySize=` | Get available time slots |
| POST   | `/api/bookings`                                       | Create a booking         |
| GET    | `/api/bookings?restaurantId=&date=`                   | List bookings            |
| GET    | `/api/bookings/{id}`                                  | Get booking details      |

## Features

- Restaurant listing with table capacities
- Date and party size selection
- Real-time availability checking
- Booking form with validation
- Booking confirmation display
- My Bookings view with filtering
- OpenAPI-generated typed client (Orval)
- TanStack Query for server state management
- Responsive UI with Tailwind CSS
