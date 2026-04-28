# Restaurant Booking System Implementation Plan

## Scope

Build a focused in-memory restaurant booking system with a .NET 10 Web API backend and React SPA frontend. Keep the architecture lightweight: pure domain functions for booking rules, thin API/UI shells, explicit Result-style business errors, OpenAPI-generated frontend client, and deterministic verification scripts.

## Vertical Slices

1. Backend foundation and domain model
   - Create .NET 10 Web API plus test project with warnings treated as errors and formatting verification.
   - Model `Restaurant`, `Table`, and `Booking` in memory with deterministic seed restaurants/tables.
   - Add small Result types for expected failures such as unknown restaurant, invalid party size, invalid date/time, no capacity, and overlapping booking.

2. Booking rules and tests first
   - Implement pure domain functions for validating requested booking time, matching tables by party size, detecting overlapping reservations, and creating bookings.
   - Add boundary tests for invalid party size, invalid date/time, unknown restaurant, exact-edge non-overlap, partial overlap, enveloping overlap, and table-capacity conflicts.
   - Keep persistence as an in-memory repository/service shell around the pure booking logic.

3. Backend API behavior
   - Expose endpoints to list restaurants, list bookings, list available slots by restaurant/date/party size, and create a booking.
   - Map Result errors to clear HTTP status codes and ProblemDetails-style responses.
   - Enable Swagger/OpenAPI with stable operation IDs and schemas suitable for client generation.
   - Verify `dotnet build`, backend tests without rebuild, and format check.

4. Frontend foundation and generated client
   - Create a React SPA with Vite, TypeScript, Tailwind CSS, shadcn/ui, and TanStack Query.
   - Configure Orval to generate a typed client from the backend OpenAPI document via a reproducible script, and use that generated client instead of handwritten fetch wrappers.
   - Add deterministic scripts: `build`, `typecheck`, `lint`, `format:check`, `deadcode`, and `api:generate`.

5. Frontend booking experience
   - Build a polished responsive UI with restaurant cards/list, selected restaurant details, available-slot picker, booking form, existing bookings, and confirmation state.
   - Use TanStack Query for restaurants, slots, and bookings; use mutations for booking creation with cache invalidation.
   - Surface validation and conflict errors accessibly with shadcn/ui components, disabled/loading states, labels, and keyboard-friendly controls.

6. Final integration and documentation
   - Confirm backend OpenAPI generation feeds the frontend client reproducibly.
   - Run frontend install and all frontend verification scripts.
   - Add README instructions for running backend, generating the client, running frontend, and executing verification commands.
   - Document any intentional deviations from this plan in the README or final notes.

## Verification Checklist

- Backend: `dotnet build` passes warning-free with warnings as errors.
- Backend: tests pass with `--no-build` after the build step.
- Backend: formatting verification passes.
- Frontend: dependencies install successfully.
- Frontend: `api:generate`, `typecheck`, `lint`, `format:check`, `deadcode`, and `build` pass.
- UX: restaurant list, booking form, confirmation, existing bookings, available slots, and conflict/error handling are all reachable in the SPA.
