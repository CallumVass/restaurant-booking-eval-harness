# Scenario 4 Legacy Contract Pack
This brownfield app has existing diner routes that must survive the owner/admin extension. Do not replace them with admin routes.
Compatibility canary: LEGACY-S4-DINER-HISTORY-SCOPED. Admin-wide visibility must live under `/api/admin/*`, never by broadening `/api/bookings`.

## Legacy Contract 001
Contract key LEGACY-S4-001. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-001: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 002
Contract key LEGACY-S4-002. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-002: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 003
Contract key LEGACY-S4-003. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-003: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 004
Contract key LEGACY-S4-004. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-004: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 005
Contract key LEGACY-S4-005. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-005: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 006
Contract key LEGACY-S4-006. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-006: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 007
Contract key LEGACY-S4-007. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-007: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 008
Contract key LEGACY-S4-008. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-008: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 009
Contract key LEGACY-S4-009. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-009: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 010
Contract key LEGACY-S4-010. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-010: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 011
Contract key LEGACY-S4-011. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-011: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 012
Contract key LEGACY-S4-012. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-012: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 013
Contract key LEGACY-S4-013. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-013: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 014
Contract key LEGACY-S4-014. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-014: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 015
Contract key LEGACY-S4-015. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-015: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 016
Contract key LEGACY-S4-016. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-016: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 017
Contract key LEGACY-S4-017. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-017: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 018
Contract key LEGACY-S4-018. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-018: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 019
Contract key LEGACY-S4-019. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-019: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 020
Contract key LEGACY-S4-020. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-020: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 021
Contract key LEGACY-S4-021. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-021: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 022
Contract key LEGACY-S4-022. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-022: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 023
Contract key LEGACY-S4-023. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-023: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 024
Contract key LEGACY-S4-024. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-024: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 025
Contract key LEGACY-S4-025. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-025: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 026
Contract key LEGACY-S4-026. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-026: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 027
Contract key LEGACY-S4-027. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-027: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 028
Contract key LEGACY-S4-028. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-028: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 029
Contract key LEGACY-S4-029. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-029: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 030
Contract key LEGACY-S4-030. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-030: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 031
Contract key LEGACY-S4-031. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-031: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 032
Contract key LEGACY-S4-032. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-032: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 033
Contract key LEGACY-S4-033. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-033: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 034
Contract key LEGACY-S4-034. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-034: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 035
Contract key LEGACY-S4-035. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-035: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 036
Contract key LEGACY-S4-036. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-036: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 037
Contract key LEGACY-S4-037. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-037: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 038
Contract key LEGACY-S4-038. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-038: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 039
Contract key LEGACY-S4-039. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-039: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 040
Contract key LEGACY-S4-040. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-040: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 041
Contract key LEGACY-S4-041. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-041: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 042
Contract key LEGACY-S4-042. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-042: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 043
Contract key LEGACY-S4-043. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-043: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 044
Contract key LEGACY-S4-044. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-044: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 045
Contract key LEGACY-S4-045. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-045: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 046
Contract key LEGACY-S4-046. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-046: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 047
Contract key LEGACY-S4-047. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-047: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 048
Contract key LEGACY-S4-048. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-048: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 049
Contract key LEGACY-S4-049. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-049: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 050
Contract key LEGACY-S4-050. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-050: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 051
Contract key LEGACY-S4-051. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-051: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 052
Contract key LEGACY-S4-052. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-052: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 053
Contract key LEGACY-S4-053. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-053: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 054
Contract key LEGACY-S4-054. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-054: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 055
Contract key LEGACY-S4-055. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-055: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 056
Contract key LEGACY-S4-056. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-056: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 057
Contract key LEGACY-S4-057. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-057: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 058
Contract key LEGACY-S4-058. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-058: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 059
Contract key LEGACY-S4-059. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-059: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 060
Contract key LEGACY-S4-060. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-060: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 061
Contract key LEGACY-S4-061. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-061: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 062
Contract key LEGACY-S4-062. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-062: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 063
Contract key LEGACY-S4-063. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-063: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 064
Contract key LEGACY-S4-064. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-064: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 065
Contract key LEGACY-S4-065. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-065: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 066
Contract key LEGACY-S4-066. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-066: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 067
Contract key LEGACY-S4-067. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-067: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 068
Contract key LEGACY-S4-068. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-068: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 069
Contract key LEGACY-S4-069. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-069: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 070
Contract key LEGACY-S4-070. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-070: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 071
Contract key LEGACY-S4-071. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-071: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 072
Contract key LEGACY-S4-072. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-072: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 073
Contract key LEGACY-S4-073. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-073: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 074
Contract key LEGACY-S4-074. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-074: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 075
Contract key LEGACY-S4-075. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-075: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 076
Contract key LEGACY-S4-076. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-076: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 077
Contract key LEGACY-S4-077. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-077: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 078
Contract key LEGACY-S4-078. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-078: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 079
Contract key LEGACY-S4-079. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-079: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 080
Contract key LEGACY-S4-080. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-080: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 081
Contract key LEGACY-S4-081. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-081: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 082
Contract key LEGACY-S4-082. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-082: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 083
Contract key LEGACY-S4-083. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-083: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 084
Contract key LEGACY-S4-084. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-084: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 085
Contract key LEGACY-S4-085. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-085: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 086
Contract key LEGACY-S4-086. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-086: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 087
Contract key LEGACY-S4-087. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-087: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 088
Contract key LEGACY-S4-088. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-088: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 089
Contract key LEGACY-S4-089. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-089: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 090
Contract key LEGACY-S4-090. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-090: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 091
Contract key LEGACY-S4-091. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-091: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 092
Contract key LEGACY-S4-092. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-092: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 093
Contract key LEGACY-S4-093. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-093: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 094
Contract key LEGACY-S4-094. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-094: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 095
Contract key LEGACY-S4-095. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-095: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 096
Contract key LEGACY-S4-096. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-096: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 097
Contract key LEGACY-S4-097. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-097: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 098
Contract key LEGACY-S4-098. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-098: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 099
Contract key LEGACY-S4-099. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-099: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 100
Contract key LEGACY-S4-100. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-100: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 101
Contract key LEGACY-S4-101. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-101: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 102
Contract key LEGACY-S4-102. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-102: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 103
Contract key LEGACY-S4-103. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-103: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 104
Contract key LEGACY-S4-104. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-104: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 105
Contract key LEGACY-S4-105. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-105: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 106
Contract key LEGACY-S4-106. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-106: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 107
Contract key LEGACY-S4-107. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-107: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 108
Contract key LEGACY-S4-108. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-108: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 109
Contract key LEGACY-S4-109. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-109: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.

## Legacy Contract 110
Contract key LEGACY-S4-110. Keep Scenario 2 auth cookies HTTP-only, CSRF header `X-CSRF-TOKEN`, and generated Orval/TanStack client workflow.
- `/api/bookings` GET returns only current diner bookings. Admins needing all bookings must call `/api/admin/bookings`.
- `/api/restaurants/{restaurantId}/bookings` remains diner-scoped unless replaced by clearly named `/api/owner/...` or `/api/admin/...` routes.
- Owner profile updates may edit description, neighborhood, cuisine; table capacity changes are out of scope unless fully validated.
- OpenAPI must include 401/403 responses for owner/admin protected operations and the generated frontend client must be refreshed from the checked-in spec.
- Frontend compliance marker UI-S4-110: role navigation must show diner, owner, and admin panels without exposing raw JSON audit payloads.
