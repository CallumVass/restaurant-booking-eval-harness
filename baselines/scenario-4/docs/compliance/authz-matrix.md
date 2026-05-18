# Scenario 4 Enterprise Authorization Matrix
This file is intentionally long and normative. Requirements later in a section override earlier examples. Preserve exact compliance codes in tests or source comments where they drive behavior.
Canonical seeded accounts: diner.demo@example.test / owner.ember@example.test / owner.luna@example.test / owner.saffron@example.test / admin.ops@example.test.
Owner mapping canaries: RBAC-S4-OWNER-EMBER owns ember-table, RBAC-S4-OWNER-LUNA owns luna-verde, RBAC-S4-OWNER-SAFFRON owns saffron-court.

## Authorization Segment 001
Segment code AUTHZ-S4-001. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-001-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-001-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-001-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-001-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-001-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-001-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-001-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-001-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-001-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-001-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-001-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-001-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-001-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-001-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-001-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-001-GET-auth.
Override reminder 001: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 002
Segment code AUTHZ-S4-002. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-002-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-002-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-002-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-002-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-002-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-002-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-002-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-002-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-002-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-002-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-002-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-002-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-002-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-002-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-002-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-002-GET-auth.
Override reminder 002: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 003
Segment code AUTHZ-S4-003. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-003-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-003-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-003-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-003-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-003-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-003-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-003-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-003-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-003-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-003-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-003-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-003-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-003-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-003-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-003-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-003-GET-auth.
Override reminder 003: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 004
Segment code AUTHZ-S4-004. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-004-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-004-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-004-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-004-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-004-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-004-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-004-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-004-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-004-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-004-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-004-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-004-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-004-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-004-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-004-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-004-GET-auth.
Override reminder 004: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 005
Segment code AUTHZ-S4-005. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-005-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-005-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-005-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-005-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-005-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-005-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-005-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-005-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-005-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-005-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-005-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-005-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-005-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-005-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-005-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-005-GET-auth.
Override reminder 005: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 006
Segment code AUTHZ-S4-006. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-006-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-006-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-006-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-006-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-006-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-006-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-006-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-006-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-006-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-006-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-006-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-006-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-006-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-006-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-006-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-006-GET-auth.
Override reminder 006: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 007
Segment code AUTHZ-S4-007. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-007-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-007-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-007-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-007-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-007-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-007-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-007-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-007-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-007-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-007-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-007-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-007-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-007-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-007-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-007-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-007-GET-auth.
Override reminder 007: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 008
Segment code AUTHZ-S4-008. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-008-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-008-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-008-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-008-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-008-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-008-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-008-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-008-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-008-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-008-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-008-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-008-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-008-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-008-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-008-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-008-GET-auth.
Override reminder 008: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 009
Segment code AUTHZ-S4-009. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-009-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-009-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-009-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-009-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-009-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-009-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-009-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-009-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-009-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-009-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-009-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-009-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-009-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-009-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-009-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-009-GET-auth.
Override reminder 009: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 010
Segment code AUTHZ-S4-010. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-010-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-010-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-010-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-010-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-010-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-010-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-010-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-010-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-010-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-010-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-010-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-010-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-010-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-010-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-010-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-010-GET-auth.
Override reminder 010: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 011
Segment code AUTHZ-S4-011. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-011-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-011-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-011-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-011-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-011-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-011-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-011-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-011-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-011-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-011-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-011-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-011-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-011-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-011-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-011-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-011-GET-auth.
Override reminder 011: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 012
Segment code AUTHZ-S4-012. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-012-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-012-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-012-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-012-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-012-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-012-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-012-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-012-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-012-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-012-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-012-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-012-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-012-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-012-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-012-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-012-GET-auth.
Override reminder 012: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 013
Segment code AUTHZ-S4-013. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-013-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-013-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-013-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-013-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-013-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-013-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-013-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-013-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-013-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-013-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-013-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-013-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-013-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-013-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-013-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-013-GET-auth.
Override reminder 013: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 014
Segment code AUTHZ-S4-014. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-014-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-014-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-014-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-014-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-014-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-014-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-014-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-014-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-014-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-014-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-014-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-014-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-014-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-014-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-014-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-014-GET-auth.
Override reminder 014: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 015
Segment code AUTHZ-S4-015. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-015-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-015-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-015-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-015-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-015-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-015-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-015-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-015-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-015-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-015-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-015-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-015-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-015-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-015-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-015-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-015-GET-auth.
Override reminder 015: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 016
Segment code AUTHZ-S4-016. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-016-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-016-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-016-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-016-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-016-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-016-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-016-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-016-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-016-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-016-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-016-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-016-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-016-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-016-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-016-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-016-GET-auth.
Override reminder 016: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 017
Segment code AUTHZ-S4-017. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-017-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-017-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-017-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-017-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-017-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-017-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-017-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-017-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-017-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-017-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-017-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-017-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-017-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-017-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-017-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-017-GET-auth.
Override reminder 017: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 018
Segment code AUTHZ-S4-018. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-018-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-018-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-018-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-018-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-018-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-018-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-018-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-018-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-018-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-018-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-018-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-018-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-018-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-018-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-018-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-018-GET-auth.
Override reminder 018: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 019
Segment code AUTHZ-S4-019. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-019-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-019-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-019-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-019-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-019-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-019-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-019-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-019-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-019-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-019-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-019-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-019-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-019-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-019-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-019-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-019-GET-auth.
Override reminder 019: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 020
Segment code AUTHZ-S4-020. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-020-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-020-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-020-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-020-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-020-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-020-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-020-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-020-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-020-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-020-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-020-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-020-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-020-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-020-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-020-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-020-GET-auth.
Override reminder 020: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 021
Segment code AUTHZ-S4-021. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-021-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-021-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-021-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-021-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-021-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-021-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-021-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-021-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-021-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-021-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-021-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-021-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-021-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-021-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-021-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-021-GET-auth.
Override reminder 021: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 022
Segment code AUTHZ-S4-022. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-022-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-022-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-022-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-022-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-022-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-022-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-022-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-022-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-022-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-022-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-022-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-022-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-022-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-022-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-022-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-022-GET-auth.
Override reminder 022: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 023
Segment code AUTHZ-S4-023. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-023-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-023-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-023-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-023-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-023-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-023-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-023-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-023-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-023-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-023-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-023-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-023-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-023-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-023-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-023-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-023-GET-auth.
Override reminder 023: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 024
Segment code AUTHZ-S4-024. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-024-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-024-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-024-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-024-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-024-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-024-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-024-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-024-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-024-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-024-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-024-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-024-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-024-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-024-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-024-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-024-GET-auth.
Override reminder 024: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 025
Segment code AUTHZ-S4-025. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-025-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-025-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-025-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-025-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-025-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-025-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-025-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-025-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-025-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-025-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-025-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-025-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-025-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-025-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-025-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-025-GET-auth.
Override reminder 025: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 026
Segment code AUTHZ-S4-026. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-026-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-026-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-026-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-026-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-026-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-026-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-026-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-026-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-026-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-026-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-026-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-026-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-026-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-026-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-026-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-026-GET-auth.
Override reminder 026: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 027
Segment code AUTHZ-S4-027. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-027-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-027-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-027-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-027-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-027-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-027-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-027-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-027-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-027-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-027-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-027-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-027-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-027-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-027-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-027-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-027-GET-auth.
Override reminder 027: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 028
Segment code AUTHZ-S4-028. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-028-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-028-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-028-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-028-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-028-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-028-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-028-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-028-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-028-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-028-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-028-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-028-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-028-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-028-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-028-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-028-GET-auth.
Override reminder 028: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 029
Segment code AUTHZ-S4-029. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-029-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-029-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-029-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-029-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-029-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-029-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-029-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-029-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-029-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-029-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-029-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-029-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-029-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-029-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-029-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-029-GET-auth.
Override reminder 029: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 030
Segment code AUTHZ-S4-030. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-030-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-030-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-030-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-030-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-030-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-030-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-030-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-030-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-030-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-030-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-030-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-030-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-030-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-030-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-030-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-030-GET-auth.
Override reminder 030: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 031
Segment code AUTHZ-S4-031. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-031-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-031-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-031-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-031-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-031-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-031-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-031-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-031-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-031-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-031-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-031-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-031-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-031-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-031-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-031-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-031-GET-auth.
Override reminder 031: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 032
Segment code AUTHZ-S4-032. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-032-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-032-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-032-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-032-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-032-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-032-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-032-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-032-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-032-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-032-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-032-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-032-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-032-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-032-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-032-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-032-GET-auth.
Override reminder 032: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 033
Segment code AUTHZ-S4-033. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-033-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-033-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-033-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-033-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-033-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-033-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-033-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-033-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-033-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-033-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-033-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-033-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-033-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-033-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-033-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-033-GET-auth.
Override reminder 033: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 034
Segment code AUTHZ-S4-034. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-034-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-034-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-034-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-034-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-034-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-034-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-034-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-034-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-034-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-034-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-034-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-034-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-034-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-034-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-034-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-034-GET-auth.
Override reminder 034: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 035
Segment code AUTHZ-S4-035. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-035-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-035-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-035-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-035-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-035-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-035-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-035-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-035-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-035-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-035-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-035-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-035-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-035-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-035-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-035-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-035-GET-auth.
Override reminder 035: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 036
Segment code AUTHZ-S4-036. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-036-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-036-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-036-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-036-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-036-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-036-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-036-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-036-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-036-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-036-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-036-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-036-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-036-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-036-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-036-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-036-GET-auth.
Override reminder 036: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 037
Segment code AUTHZ-S4-037. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-037-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-037-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-037-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-037-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-037-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-037-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-037-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-037-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-037-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-037-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-037-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-037-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-037-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-037-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-037-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-037-GET-auth.
Override reminder 037: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 038
Segment code AUTHZ-S4-038. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-038-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-038-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-038-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-038-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-038-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-038-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-038-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-038-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-038-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-038-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-038-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-038-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-038-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-038-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-038-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-038-GET-auth.
Override reminder 038: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 039
Segment code AUTHZ-S4-039. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-039-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-039-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-039-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-039-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-039-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-039-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-039-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-039-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-039-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-039-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-039-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-039-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-039-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-039-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-039-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-039-GET-auth.
Override reminder 039: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 040
Segment code AUTHZ-S4-040. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-040-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-040-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-040-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-040-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-040-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-040-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-040-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-040-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-040-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-040-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-040-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-040-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-040-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-040-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-040-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-040-GET-auth.
Override reminder 040: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 041
Segment code AUTHZ-S4-041. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-041-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-041-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-041-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-041-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-041-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-041-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-041-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-041-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-041-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-041-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-041-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-041-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-041-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-041-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-041-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-041-GET-auth.
Override reminder 041: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 042
Segment code AUTHZ-S4-042. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-042-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-042-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-042-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-042-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-042-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-042-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-042-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-042-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-042-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-042-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-042-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-042-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-042-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-042-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-042-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-042-GET-auth.
Override reminder 042: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 043
Segment code AUTHZ-S4-043. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-043-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-043-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-043-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-043-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-043-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-043-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-043-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-043-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-043-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-043-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-043-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-043-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-043-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-043-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-043-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-043-GET-auth.
Override reminder 043: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 044
Segment code AUTHZ-S4-044. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-044-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-044-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-044-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-044-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-044-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-044-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-044-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-044-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-044-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-044-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-044-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-044-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-044-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-044-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-044-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-044-GET-auth.
Override reminder 044: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 045
Segment code AUTHZ-S4-045. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-045-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-045-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-045-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-045-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-045-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-045-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-045-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-045-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-045-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-045-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-045-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-045-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-045-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-045-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-045-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-045-GET-auth.
Override reminder 045: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 046
Segment code AUTHZ-S4-046. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-046-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-046-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-046-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-046-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-046-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-046-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-046-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-046-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-046-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-046-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-046-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-046-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-046-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-046-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-046-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-046-GET-auth.
Override reminder 046: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 047
Segment code AUTHZ-S4-047. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-047-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-047-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-047-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-047-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-047-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-047-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-047-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-047-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-047-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-047-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-047-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-047-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-047-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-047-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-047-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-047-GET-auth.
Override reminder 047: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 048
Segment code AUTHZ-S4-048. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-048-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-048-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-048-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-048-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-048-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-048-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-048-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-048-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-048-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-048-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-048-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-048-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-048-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-048-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-048-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-048-GET-auth.
Override reminder 048: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 049
Segment code AUTHZ-S4-049. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-049-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-049-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-049-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-049-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-049-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-049-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-049-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-049-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-049-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-049-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-049-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-049-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-049-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-049-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-049-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-049-GET-auth.
Override reminder 049: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 050
Segment code AUTHZ-S4-050. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-050-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-050-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-050-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-050-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-050-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-050-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-050-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-050-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-050-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-050-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-050-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-050-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-050-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-050-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-050-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-050-GET-auth.
Override reminder 050: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 051
Segment code AUTHZ-S4-051. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-051-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-051-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-051-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-051-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-051-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-051-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-051-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-051-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-051-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-051-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-051-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-051-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-051-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-051-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-051-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-051-GET-auth.
Override reminder 051: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 052
Segment code AUTHZ-S4-052. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-052-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-052-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-052-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-052-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-052-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-052-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-052-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-052-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-052-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-052-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-052-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-052-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-052-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-052-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-052-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-052-GET-auth.
Override reminder 052: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 053
Segment code AUTHZ-S4-053. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-053-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-053-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-053-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-053-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-053-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-053-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-053-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-053-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-053-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-053-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-053-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-053-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-053-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-053-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-053-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-053-GET-auth.
Override reminder 053: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 054
Segment code AUTHZ-S4-054. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-054-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-054-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-054-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-054-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-054-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-054-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-054-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-054-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-054-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-054-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-054-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-054-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-054-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-054-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-054-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-054-GET-auth.
Override reminder 054: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 055
Segment code AUTHZ-S4-055. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-055-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-055-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-055-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-055-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-055-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-055-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-055-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-055-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-055-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-055-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-055-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-055-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-055-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-055-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-055-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-055-GET-auth.
Override reminder 055: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 056
Segment code AUTHZ-S4-056. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-056-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-056-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-056-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-056-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-056-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-056-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-056-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-056-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-056-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-056-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-056-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-056-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-056-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-056-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-056-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-056-GET-auth.
Override reminder 056: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 057
Segment code AUTHZ-S4-057. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-057-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-057-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-057-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-057-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-057-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-057-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-057-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-057-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-057-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-057-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-057-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-057-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-057-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-057-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-057-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-057-GET-auth.
Override reminder 057: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 058
Segment code AUTHZ-S4-058. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-058-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-058-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-058-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-058-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-058-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-058-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-058-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-058-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-058-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-058-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-058-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-058-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-058-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-058-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-058-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-058-GET-auth.
Override reminder 058: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 059
Segment code AUTHZ-S4-059. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-059-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-059-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-059-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-059-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-059-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-059-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-059-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-059-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-059-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-059-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-059-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-059-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-059-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-059-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-059-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-059-GET-auth.
Override reminder 059: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 060
Segment code AUTHZ-S4-060. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-060-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-060-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-060-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-060-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-060-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-060-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-060-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-060-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-060-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-060-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-060-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-060-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-060-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-060-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-060-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-060-GET-auth.
Override reminder 060: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 061
Segment code AUTHZ-S4-061. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-061-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-061-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-061-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-061-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-061-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-061-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-061-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-061-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-061-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-061-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-061-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-061-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-061-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-061-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-061-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-061-GET-auth.
Override reminder 061: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 062
Segment code AUTHZ-S4-062. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-062-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-062-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-062-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-062-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-062-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-062-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-062-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-062-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-062-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-062-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-062-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-062-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-062-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-062-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-062-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-062-GET-auth.
Override reminder 062: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 063
Segment code AUTHZ-S4-063. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-063-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-063-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-063-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-063-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-063-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-063-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-063-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-063-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-063-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-063-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-063-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-063-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-063-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-063-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-063-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-063-GET-auth.
Override reminder 063: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 064
Segment code AUTHZ-S4-064. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-064-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-064-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-064-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-064-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-064-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-064-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-064-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-064-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-064-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-064-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-064-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-064-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-064-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-064-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-064-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-064-GET-auth.
Override reminder 064: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 065
Segment code AUTHZ-S4-065. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-065-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-065-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-065-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-065-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-065-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-065-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-065-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-065-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-065-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-065-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-065-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-065-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-065-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-065-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-065-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-065-GET-auth.
Override reminder 065: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 066
Segment code AUTHZ-S4-066. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-066-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-066-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-066-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-066-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-066-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-066-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-066-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-066-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-066-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-066-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-066-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-066-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-066-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-066-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-066-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-066-GET-auth.
Override reminder 066: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 067
Segment code AUTHZ-S4-067. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-067-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-067-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-067-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-067-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-067-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-067-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-067-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-067-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-067-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-067-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-067-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-067-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-067-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-067-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-067-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-067-GET-auth.
Override reminder 067: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 068
Segment code AUTHZ-S4-068. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-068-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-068-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-068-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-068-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-068-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-068-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-068-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-068-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-068-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-068-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-068-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-068-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-068-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-068-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-068-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-068-GET-auth.
Override reminder 068: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 069
Segment code AUTHZ-S4-069. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-069-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-069-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-069-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-069-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-069-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-069-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-069-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-069-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-069-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-069-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-069-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-069-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-069-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-069-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-069-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-069-GET-auth.
Override reminder 069: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 070
Segment code AUTHZ-S4-070. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-070-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-070-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-070-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-070-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-070-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-070-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-070-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-070-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-070-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-070-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-070-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-070-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-070-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-070-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-070-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-070-GET-auth.
Override reminder 070: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 071
Segment code AUTHZ-S4-071. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-071-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-071-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-071-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-071-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-071-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-071-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-071-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-071-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-071-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-071-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-071-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-071-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-071-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-071-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-071-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-071-GET-auth.
Override reminder 071: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 072
Segment code AUTHZ-S4-072. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-072-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-072-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-072-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-072-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-072-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-072-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-072-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-072-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-072-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-072-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-072-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-072-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-072-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-072-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-072-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-072-GET-auth.
Override reminder 072: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 073
Segment code AUTHZ-S4-073. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-073-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-073-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-073-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-073-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-073-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-073-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-073-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-073-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-073-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-073-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-073-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-073-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-073-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-073-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-073-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-073-GET-auth.
Override reminder 073: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 074
Segment code AUTHZ-S4-074. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-074-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-074-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-074-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-074-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-074-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-074-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-074-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-074-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-074-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-074-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-074-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-074-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-074-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-074-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-074-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-074-GET-auth.
Override reminder 074: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 075
Segment code AUTHZ-S4-075. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-075-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-075-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-075-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-075-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-075-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-075-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-075-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-075-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-075-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-075-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-075-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-075-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-075-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-075-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-075-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-075-GET-auth.
Override reminder 075: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 076
Segment code AUTHZ-S4-076. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-076-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-076-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-076-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-076-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-076-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-076-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-076-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-076-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-076-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-076-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-076-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-076-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-076-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-076-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-076-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-076-GET-auth.
Override reminder 076: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 077
Segment code AUTHZ-S4-077. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-077-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-077-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-077-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-077-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-077-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-077-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-077-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-077-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-077-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-077-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-077-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-077-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-077-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-077-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-077-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-077-GET-auth.
Override reminder 077: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 078
Segment code AUTHZ-S4-078. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-078-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-078-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-078-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-078-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-078-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-078-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-078-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-078-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-078-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-078-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-078-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-078-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-078-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-078-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-078-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-078-GET-auth.
Override reminder 078: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 079
Segment code AUTHZ-S4-079. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-079-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-079-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-079-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-079-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-079-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-079-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-079-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-079-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-079-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-079-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-079-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-079-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-079-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-079-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-079-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-079-GET-auth.
Override reminder 079: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 080
Segment code AUTHZ-S4-080. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-080-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-080-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-080-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-080-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-080-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-080-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-080-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-080-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-080-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-080-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-080-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-080-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-080-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-080-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-080-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-080-GET-auth.
Override reminder 080: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 081
Segment code AUTHZ-S4-081. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-081-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-081-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-081-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-081-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-081-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-081-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-081-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-081-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-081-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-081-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-081-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-081-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-081-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-081-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-081-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-081-GET-auth.
Override reminder 081: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 082
Segment code AUTHZ-S4-082. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-082-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-082-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-082-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-082-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-082-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-082-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-082-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-082-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-082-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-082-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-082-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-082-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-082-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-082-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-082-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-082-GET-auth.
Override reminder 082: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 083
Segment code AUTHZ-S4-083. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-083-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-083-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-083-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-083-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-083-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-083-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-083-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-083-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-083-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-083-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-083-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-083-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-083-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-083-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-083-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-083-GET-auth.
Override reminder 083: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 084
Segment code AUTHZ-S4-084. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-084-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-084-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-084-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-084-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-084-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-084-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-084-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-084-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-084-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-084-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-084-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-084-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-084-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-084-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-084-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-084-GET-auth.
Override reminder 084: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 085
Segment code AUTHZ-S4-085. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-085-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-085-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-085-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-085-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-085-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-085-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-085-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-085-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-085-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-085-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-085-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-085-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-085-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-085-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-085-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-085-GET-auth.
Override reminder 085: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 086
Segment code AUTHZ-S4-086. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-086-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-086-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-086-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-086-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-086-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-086-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-086-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-086-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-086-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-086-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-086-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-086-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-086-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-086-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-086-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-086-GET-auth.
Override reminder 086: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 087
Segment code AUTHZ-S4-087. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-087-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-087-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-087-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-087-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-087-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-087-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-087-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-087-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-087-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-087-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-087-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-087-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-087-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-087-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-087-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-087-GET-auth.
Override reminder 087: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 088
Segment code AUTHZ-S4-088. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-088-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-088-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-088-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-088-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-088-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-088-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-088-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-088-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-088-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-088-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-088-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-088-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-088-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-088-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-088-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-088-GET-auth.
Override reminder 088: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 089
Segment code AUTHZ-S4-089. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-089-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-089-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-089-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-089-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-089-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-089-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-089-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-089-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-089-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-089-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-089-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-089-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-089-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-089-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-089-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-089-GET-auth.
Override reminder 089: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 090
Segment code AUTHZ-S4-090. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-090-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-090-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-090-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-090-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-090-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-090-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-090-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-090-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-090-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-090-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-090-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-090-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-090-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-090-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-090-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-090-GET-auth.
Override reminder 090: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 091
Segment code AUTHZ-S4-091. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-091-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-091-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-091-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-091-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-091-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-091-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-091-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-091-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-091-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-091-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-091-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-091-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-091-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-091-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-091-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-091-GET-auth.
Override reminder 091: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 092
Segment code AUTHZ-S4-092. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-092-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-092-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-092-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-092-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-092-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-092-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-092-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-092-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-092-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-092-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-092-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-092-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-092-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-092-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-092-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-092-GET-auth.
Override reminder 092: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 093
Segment code AUTHZ-S4-093. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-093-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-093-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-093-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-093-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-093-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-093-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-093-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-093-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-093-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-093-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-093-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-093-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-093-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-093-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-093-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-093-GET-auth.
Override reminder 093: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 094
Segment code AUTHZ-S4-094. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-094-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-094-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-094-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-094-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-094-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-094-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-094-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-094-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-094-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-094-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-094-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-094-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-094-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-094-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-094-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-094-GET-auth.
Override reminder 094: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 095
Segment code AUTHZ-S4-095. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-095-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-095-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-095-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-095-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-095-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-095-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-095-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-095-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-095-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-095-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-095-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-095-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-095-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-095-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-095-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-095-GET-auth.
Override reminder 095: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 096
Segment code AUTHZ-S4-096. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-096-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-096-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-096-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-096-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-096-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-096-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-096-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-096-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-096-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-096-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-096-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-096-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-096-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-096-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-096-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-096-GET-auth.
Override reminder 096: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 097
Segment code AUTHZ-S4-097. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-097-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-097-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-097-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-097-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-097-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-097-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-097-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-097-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-097-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-097-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-097-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-097-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-097-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-097-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-097-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-097-GET-auth.
Override reminder 097: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 098
Segment code AUTHZ-S4-098. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-098-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-098-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-098-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-098-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-098-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-098-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-098-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-098-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-098-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-098-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-098-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-098-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-098-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-098-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-098-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-098-GET-auth.
Override reminder 098: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 099
Segment code AUTHZ-S4-099. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-099-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-099-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-099-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-099-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-099-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-099-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-099-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-099-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-099-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-099-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-099-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-099-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-099-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-099-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-099-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-099-GET-auth.
Override reminder 099: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 100
Segment code AUTHZ-S4-100. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-100-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-100-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-100-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-100-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-100-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-100-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-100-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-100-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-100-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-100-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-100-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-100-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-100-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-100-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-100-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-100-GET-auth.
Override reminder 100: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 101
Segment code AUTHZ-S4-101. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-101-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-101-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-101-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-101-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-101-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-101-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-101-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-101-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-101-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-101-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-101-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-101-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-101-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-101-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-101-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-101-GET-auth.
Override reminder 101: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 102
Segment code AUTHZ-S4-102. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-102-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-102-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-102-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-102-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-102-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-102-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-102-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-102-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-102-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-102-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-102-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-102-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-102-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-102-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-102-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-102-GET-auth.
Override reminder 102: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 103
Segment code AUTHZ-S4-103. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-103-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-103-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-103-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-103-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-103-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-103-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-103-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-103-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-103-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-103-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-103-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-103-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-103-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-103-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-103-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-103-GET-auth.
Override reminder 103: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 104
Segment code AUTHZ-S4-104. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-104-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-104-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-104-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-104-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-104-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-104-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-104-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-104-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-104-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-104-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-104-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-104-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-104-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-104-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-104-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-104-GET-auth.
Override reminder 104: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 105
Segment code AUTHZ-S4-105. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-105-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-105-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-105-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-105-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-105-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-105-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-105-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-105-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-105-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-105-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-105-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-105-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-105-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-105-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-105-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-105-GET-auth.
Override reminder 105: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 106
Segment code AUTHZ-S4-106. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-106-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-106-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-106-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-106-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-106-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-106-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-106-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-106-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-106-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-106-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-106-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-106-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-106-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-106-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-106-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-106-GET-auth.
Override reminder 106: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 107
Segment code AUTHZ-S4-107. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-107-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-107-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-107-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-107-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-107-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-107-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-107-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-107-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-107-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-107-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-107-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-107-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-107-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-107-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-107-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-107-GET-auth.
Override reminder 107: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 108
Segment code AUTHZ-S4-108. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-108-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-108-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-108-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-108-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-108-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-108-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-108-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-108-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-108-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-108-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-108-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-108-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-108-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-108-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-108-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-108-GET-auth.
Override reminder 108: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 109
Segment code AUTHZ-S4-109. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-109-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-109-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-109-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-109-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-109-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-109-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-109-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-109-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-109-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-109-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-109-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-109-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-109-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-109-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-109-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-109-GET-auth.
Override reminder 109: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 110
Segment code AUTHZ-S4-110. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-110-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-110-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-110-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-110-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-110-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-110-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-110-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-110-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-110-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-110-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-110-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-110-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-110-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-110-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-110-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-110-GET-auth.
Override reminder 110: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 111
Segment code AUTHZ-S4-111. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-111-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-111-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-111-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-111-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-111-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-111-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-111-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-111-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-111-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-111-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-111-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-111-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-111-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-111-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-111-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-111-GET-auth.
Override reminder 111: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 112
Segment code AUTHZ-S4-112. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-112-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-112-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-112-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-112-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-112-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-112-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-112-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-112-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-112-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-112-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-112-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-112-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-112-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-112-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-112-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-112-GET-auth.
Override reminder 112: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 113
Segment code AUTHZ-S4-113. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-113-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-113-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-113-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-113-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-113-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-113-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-113-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-113-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-113-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-113-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-113-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-113-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-113-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-113-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-113-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-113-GET-auth.
Override reminder 113: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 114
Segment code AUTHZ-S4-114. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-114-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-114-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-114-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-114-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-114-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-114-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-114-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-114-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-114-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-114-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-114-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-114-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-114-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-114-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-114-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-114-GET-auth.
Override reminder 114: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 115
Segment code AUTHZ-S4-115. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-115-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-115-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-115-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-115-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-115-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-115-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-115-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-115-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-115-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-115-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-115-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-115-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-115-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-115-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-115-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-115-GET-auth.
Override reminder 115: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 116
Segment code AUTHZ-S4-116. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-116-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-116-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-116-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-116-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-116-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-116-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-116-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-116-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-116-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-116-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-116-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-116-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-116-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-116-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-116-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-116-GET-auth.
Override reminder 116: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 117
Segment code AUTHZ-S4-117. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-117-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-117-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-117-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-117-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-117-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-117-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-117-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-117-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-117-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-117-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-117-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-117-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-117-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-117-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-117-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-117-GET-auth.
Override reminder 117: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.

## Authorization Segment 118
Segment code AUTHZ-S4-118. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-118-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-118-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-118-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-118-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-118-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-118-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-118-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-118-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-118-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-118-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-118-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-118-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-118-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-118-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-118-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-118-GET-auth.
Override reminder 118: restaurant `luna-verde` is controlled by `owner-luna-primary` / `owner.luna@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-LUNA` in authorization tests.

## Authorization Segment 119
Segment code AUTHZ-S4-119. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-119-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-119-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-119-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-119-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-119-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-119-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-119-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-119-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-119-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-119-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-119-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-119-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-119-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-119-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-119-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-119-GET-auth.
Override reminder 119: restaurant `saffron-court` is controlled by `owner-saffron-primary` / `owner.saffron@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-SAFFRON` in authorization tests.

## Authorization Segment 120
Segment code AUTHZ-S4-120. Apply this segment when validating owner/admin/diner route behavior. The canonical denial contract remains unauthenticated=401 and authenticated-wrong-role-or-wrong-owner=403.
- `GET /api/restaurants` (public restaurant catalog) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-120-GET-public.
- `GET /api/restaurants/{restaurantId}/availability` (public availability) uses policy `public`. anonymous=allow; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-120-GET-public.
- `POST /api/bookings` (diner booking creation) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-120-POST-csrf.
- `GET /api/bookings` (diner booking history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-120-GET-owned-user.
- `GET /api/restaurants/{restaurantId}/bookings` (legacy diner restaurant-filtered history) uses policy `owned-user`. anonymous=401; diner=allow; owner=allow; admin=use admin-scoped endpoint only. Evidence key: AUTHZ-S4-120-GET-owned-user.
- `GET /api/owner/restaurants` (owner owned restaurant list) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-120-GET-owner-scoped.
- `GET /api/owner/restaurants/{restaurantId}` (owner restaurant details) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-120-GET-owner-scoped.
- `PATCH /api/owner/restaurants/{restaurantId}` (owner profile update) uses policy `owner-scoped-csrf`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-120-PATCH-owner-scoped-csrf.
- `GET /api/owner/restaurants/{restaurantId}/bookings` (owner restaurant bookings) uses policy `owner-scoped`. anonymous=401; diner=403; owner=allow-if-owned; admin=allow. Evidence key: AUTHZ-S4-120-GET-owner-scoped.
- `GET /api/admin/owners` (admin owner mapping) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-120-GET-admin.
- `GET /api/admin/audit-events` (admin audit events) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-120-GET-admin.
- `GET /api/admin/bookings` (admin all booking visibility) uses policy `admin`. anonymous=401; diner=403; owner=403; admin=allow. Evidence key: AUTHZ-S4-120-GET-admin.
- `POST /api/auth/register` (registration) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-120-POST-csrf.
- `POST /api/auth/login` (login) uses policy `csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-120-POST-csrf.
- `POST /api/auth/logout` (logout) uses policy `auth-csrf`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-120-POST-auth-csrf.
- `GET /api/auth/me` (current user) uses policy `auth`. anonymous=401; diner=allow; owner=allow; admin=allow. Evidence key: AUTHZ-S4-120-GET-auth.
Override reminder 120: restaurant `ember-table` is controlled by `owner-ember-primary` / `owner.ember@example.test`. Wrong-owner access must be 403, never empty 200. Preserve marker `RBAC-S4-OWNER-EMBER` in authorization tests.
