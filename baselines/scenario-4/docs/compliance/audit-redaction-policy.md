# Scenario 4 Audit And Redaction Policy
Canonical audit stream id: AUDIT-S4-CANONICAL. All required successful state changes must append safe audit events using exact action names below.
Required action names: user.registered.v2, user.login.succeeded.v2, user.logout.succeeded.v2, booking.created.v2, owner.restaurant.profile.updated.v2, admin.audit.viewed.v2, admin.owner-map.viewed.v2
Mandatory denylist fields: password, plainTextPassword, passwordHash, csrfToken, xsrfToken, authCookie, setCookie, cookieHeader, authorization, securityStamp, resetToken, refreshToken, claimsPrincipal, rawHeaders, requestHeaders, sessionId, apiKey, connectionString

## Audit Segment 001
Policy key AUDIT-S4-001. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-001-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-001-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-001-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-001-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-001-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-001-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-001-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-001-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 002
Policy key AUDIT-S4-002. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-002-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-002-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-002-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-002-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-002-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-002-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-002-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-002-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 003
Policy key AUDIT-S4-003. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-003-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-003-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-003-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-003-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-003-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-003-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-003-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-003-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 004
Policy key AUDIT-S4-004. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-004-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-004-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-004-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-004-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-004-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-004-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-004-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-004-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 005
Policy key AUDIT-S4-005. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-005-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-005-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-005-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-005-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-005-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-005-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-005-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-005-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 006
Policy key AUDIT-S4-006. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-006-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-006-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-006-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-006-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-006-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-006-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-006-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-006-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 007
Policy key AUDIT-S4-007. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-007-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-007-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-007-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-007-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-007-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-007-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-007-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-007-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 008
Policy key AUDIT-S4-008. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-008-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-008-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-008-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-008-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-008-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-008-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-008-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-008-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 009
Policy key AUDIT-S4-009. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-009-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-009-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-009-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-009-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-009-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-009-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-009-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-009-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 010
Policy key AUDIT-S4-010. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-010-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-010-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-010-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-010-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-010-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-010-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-010-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-010-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 011
Policy key AUDIT-S4-011. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-011-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-011-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-011-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-011-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-011-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-011-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-011-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-011-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 012
Policy key AUDIT-S4-012. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-012-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-012-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-012-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-012-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-012-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-012-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-012-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-012-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 013
Policy key AUDIT-S4-013. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-013-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-013-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-013-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-013-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-013-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-013-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-013-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-013-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 014
Policy key AUDIT-S4-014. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-014-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-014-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-014-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-014-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-014-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-014-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-014-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-014-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 015
Policy key AUDIT-S4-015. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-015-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-015-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-015-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-015-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-015-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-015-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-015-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-015-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 016
Policy key AUDIT-S4-016. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-016-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-016-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-016-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-016-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-016-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-016-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-016-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-016-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 017
Policy key AUDIT-S4-017. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-017-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-017-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-017-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-017-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-017-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-017-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-017-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-017-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 018
Policy key AUDIT-S4-018. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-018-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-018-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-018-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-018-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-018-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-018-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-018-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-018-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 019
Policy key AUDIT-S4-019. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-019-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-019-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-019-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-019-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-019-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-019-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-019-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-019-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 020
Policy key AUDIT-S4-020. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-020-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-020-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-020-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-020-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-020-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-020-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-020-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-020-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 021
Policy key AUDIT-S4-021. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-021-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-021-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-021-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-021-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-021-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-021-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-021-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-021-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 022
Policy key AUDIT-S4-022. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-022-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-022-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-022-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-022-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-022-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-022-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-022-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-022-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 023
Policy key AUDIT-S4-023. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-023-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-023-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-023-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-023-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-023-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-023-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-023-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-023-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 024
Policy key AUDIT-S4-024. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-024-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-024-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-024-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-024-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-024-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-024-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-024-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-024-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 025
Policy key AUDIT-S4-025. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-025-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-025-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-025-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-025-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-025-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-025-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-025-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-025-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 026
Policy key AUDIT-S4-026. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-026-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-026-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-026-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-026-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-026-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-026-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-026-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-026-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 027
Policy key AUDIT-S4-027. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-027-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-027-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-027-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-027-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-027-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-027-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-027-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-027-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 028
Policy key AUDIT-S4-028. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-028-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-028-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-028-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-028-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-028-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-028-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-028-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-028-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 029
Policy key AUDIT-S4-029. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-029-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-029-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-029-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-029-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-029-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-029-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-029-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-029-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 030
Policy key AUDIT-S4-030. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-030-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-030-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-030-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-030-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-030-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-030-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-030-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-030-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 031
Policy key AUDIT-S4-031. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-031-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-031-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-031-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-031-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-031-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-031-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-031-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-031-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 032
Policy key AUDIT-S4-032. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-032-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-032-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-032-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-032-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-032-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-032-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-032-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-032-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 033
Policy key AUDIT-S4-033. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-033-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-033-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-033-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-033-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-033-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-033-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-033-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-033-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 034
Policy key AUDIT-S4-034. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-034-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-034-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-034-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-034-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-034-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-034-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-034-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-034-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 035
Policy key AUDIT-S4-035. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-035-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-035-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-035-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-035-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-035-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-035-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-035-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-035-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 036
Policy key AUDIT-S4-036. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-036-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-036-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-036-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-036-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-036-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-036-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-036-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-036-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 037
Policy key AUDIT-S4-037. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-037-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-037-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-037-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-037-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-037-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-037-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-037-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-037-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 038
Policy key AUDIT-S4-038. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-038-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-038-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-038-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-038-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-038-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-038-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-038-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-038-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 039
Policy key AUDIT-S4-039. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-039-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-039-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-039-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-039-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-039-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-039-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-039-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-039-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 040
Policy key AUDIT-S4-040. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-040-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-040-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-040-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-040-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-040-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-040-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-040-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-040-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 041
Policy key AUDIT-S4-041. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-041-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-041-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-041-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-041-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-041-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-041-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-041-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-041-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 042
Policy key AUDIT-S4-042. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-042-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-042-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-042-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-042-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-042-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-042-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-042-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-042-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 043
Policy key AUDIT-S4-043. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-043-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-043-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-043-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-043-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-043-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-043-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-043-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-043-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 044
Policy key AUDIT-S4-044. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-044-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-044-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-044-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-044-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-044-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-044-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-044-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-044-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 045
Policy key AUDIT-S4-045. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-045-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-045-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-045-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-045-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-045-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-045-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-045-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-045-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 046
Policy key AUDIT-S4-046. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-046-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-046-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-046-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-046-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-046-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-046-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-046-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-046-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 047
Policy key AUDIT-S4-047. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-047-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-047-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-047-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-047-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-047-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-047-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-047-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-047-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 048
Policy key AUDIT-S4-048. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-048-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-048-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-048-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-048-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-048-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-048-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-048-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-048-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 049
Policy key AUDIT-S4-049. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-049-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-049-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-049-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-049-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-049-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-049-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-049-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-049-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 050
Policy key AUDIT-S4-050. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-050-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-050-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-050-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-050-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-050-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-050-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-050-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-050-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 051
Policy key AUDIT-S4-051. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-051-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-051-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-051-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-051-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-051-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-051-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-051-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-051-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 052
Policy key AUDIT-S4-052. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-052-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-052-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-052-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-052-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-052-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-052-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-052-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-052-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 053
Policy key AUDIT-S4-053. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-053-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-053-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-053-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-053-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-053-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-053-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-053-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-053-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 054
Policy key AUDIT-S4-054. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-054-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-054-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-054-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-054-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-054-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-054-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-054-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-054-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 055
Policy key AUDIT-S4-055. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-055-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-055-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-055-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-055-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-055-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-055-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-055-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-055-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 056
Policy key AUDIT-S4-056. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-056-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-056-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-056-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-056-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-056-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-056-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-056-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-056-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 057
Policy key AUDIT-S4-057. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-057-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-057-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-057-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-057-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-057-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-057-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-057-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-057-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 058
Policy key AUDIT-S4-058. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-058-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-058-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-058-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-058-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-058-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-058-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-058-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-058-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 059
Policy key AUDIT-S4-059. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-059-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-059-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-059-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-059-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-059-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-059-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-059-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-059-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 060
Policy key AUDIT-S4-060. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-060-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-060-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-060-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-060-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-060-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-060-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-060-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-060-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 061
Policy key AUDIT-S4-061. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-061-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-061-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-061-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-061-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-061-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-061-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-061-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-061-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 062
Policy key AUDIT-S4-062. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-062-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-062-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-062-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-062-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-062-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-062-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-062-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-062-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 063
Policy key AUDIT-S4-063. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-063-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-063-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-063-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-063-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-063-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-063-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-063-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-063-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 064
Policy key AUDIT-S4-064. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-064-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-064-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-064-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-064-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-064-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-064-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-064-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-064-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 065
Policy key AUDIT-S4-065. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-065-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-065-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-065-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-065-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-065-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-065-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-065-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-065-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 066
Policy key AUDIT-S4-066. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-066-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-066-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-066-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-066-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-066-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-066-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-066-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-066-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 067
Policy key AUDIT-S4-067. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-067-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-067-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-067-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-067-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-067-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-067-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-067-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-067-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 068
Policy key AUDIT-S4-068. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-068-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-068-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-068-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-068-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-068-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-068-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-068-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-068-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 069
Policy key AUDIT-S4-069. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-069-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-069-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-069-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-069-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-069-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-069-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-069-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-069-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 070
Policy key AUDIT-S4-070. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-070-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-070-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-070-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-070-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-070-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-070-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-070-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-070-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 071
Policy key AUDIT-S4-071. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-071-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-071-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-071-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-071-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-071-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-071-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-071-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-071-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 072
Policy key AUDIT-S4-072. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-072-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-072-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-072-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-072-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-072-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-072-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-072-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-072-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 073
Policy key AUDIT-S4-073. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-073-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-073-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-073-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-073-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-073-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-073-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-073-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-073-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 074
Policy key AUDIT-S4-074. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-074-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-074-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-074-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-074-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-074-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-074-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-074-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-074-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 075
Policy key AUDIT-S4-075. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-075-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-075-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-075-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-075-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-075-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-075-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-075-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-075-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 076
Policy key AUDIT-S4-076. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-076-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-076-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-076-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-076-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-076-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-076-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-076-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-076-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 077
Policy key AUDIT-S4-077. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-077-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-077-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-077-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-077-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-077-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-077-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-077-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-077-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 078
Policy key AUDIT-S4-078. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-078-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-078-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-078-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-078-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-078-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-078-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-078-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-078-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 079
Policy key AUDIT-S4-079. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-079-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-079-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-079-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-079-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-079-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-079-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-079-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-079-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 080
Policy key AUDIT-S4-080. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-080-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-080-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-080-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-080-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-080-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-080-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-080-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-080-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 081
Policy key AUDIT-S4-081. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-081-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-081-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-081-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-081-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-081-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-081-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-081-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-081-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 082
Policy key AUDIT-S4-082. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-082-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-082-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-082-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-082-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-082-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-082-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-082-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-082-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 083
Policy key AUDIT-S4-083. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-083-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-083-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-083-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-083-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-083-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-083-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-083-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-083-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 084
Policy key AUDIT-S4-084. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-084-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-084-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-084-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-084-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-084-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-084-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-084-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-084-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 085
Policy key AUDIT-S4-085. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-085-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-085-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-085-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-085-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-085-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-085-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-085-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-085-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 086
Policy key AUDIT-S4-086. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-086-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-086-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-086-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-086-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-086-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-086-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-086-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-086-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 087
Policy key AUDIT-S4-087. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-087-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-087-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-087-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-087-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-087-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-087-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-087-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-087-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 088
Policy key AUDIT-S4-088. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-088-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-088-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-088-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-088-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-088-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-088-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-088-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-088-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 089
Policy key AUDIT-S4-089. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-089-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-089-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-089-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-089-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-089-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-089-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-089-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-089-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 090
Policy key AUDIT-S4-090. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-090-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-090-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-090-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-090-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-090-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-090-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-090-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-090-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 091
Policy key AUDIT-S4-091. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-091-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-091-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-091-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-091-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-091-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-091-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-091-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-091-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 092
Policy key AUDIT-S4-092. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-092-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-092-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-092-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-092-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-092-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-092-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-092-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-092-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 093
Policy key AUDIT-S4-093. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-093-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-093-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-093-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-093-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-093-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-093-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-093-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-093-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 094
Policy key AUDIT-S4-094. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-094-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-094-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-094-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-094-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-094-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-094-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-094-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-094-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 095
Policy key AUDIT-S4-095. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-095-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-095-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-095-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-095-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-095-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-095-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-095-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-095-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 096
Policy key AUDIT-S4-096. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-096-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-096-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-096-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-096-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-096-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-096-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-096-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-096-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 097
Policy key AUDIT-S4-097. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-097-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-097-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-097-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-097-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-097-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-097-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-097-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-097-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 098
Policy key AUDIT-S4-098. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-098-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-098-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-098-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-098-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-098-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-098-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-098-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-098-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 099
Policy key AUDIT-S4-099. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-099-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-099-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-099-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-099-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-099-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-099-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-099-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-099-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 100
Policy key AUDIT-S4-100. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-100-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-100-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-100-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-100-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-100-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-100-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-100-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-100-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 101
Policy key AUDIT-S4-101. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-101-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-101-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-101-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-101-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-101-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-101-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-101-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-101-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 102
Policy key AUDIT-S4-102. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-102-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-102-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-102-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-102-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-102-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-102-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-102-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-102-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 103
Policy key AUDIT-S4-103. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-103-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-103-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-103-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-103-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-103-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-103-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-103-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-103-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 104
Policy key AUDIT-S4-104. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-104-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-104-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-104-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-104-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-104-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-104-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-104-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-104-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 105
Policy key AUDIT-S4-105. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-105-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-105-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-105-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-105-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-105-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-105-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-105-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-105-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 106
Policy key AUDIT-S4-106. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-106-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-106-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-106-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-106-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-106-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-106-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-106-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-106-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 107
Policy key AUDIT-S4-107. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-107-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-107-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-107-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-107-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-107-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-107-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-107-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-107-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 108
Policy key AUDIT-S4-108. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-108-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-108-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-108-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-108-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-108-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-108-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-108-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-108-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 109
Policy key AUDIT-S4-109. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-109-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-109-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-109-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-109-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-109-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-109-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-109-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-109-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 110
Policy key AUDIT-S4-110. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-110-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-110-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-110-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-110-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-110-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-110-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-110-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-110-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 111
Policy key AUDIT-S4-111. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-111-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-111-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-111-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-111-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-111-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-111-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-111-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-111-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 112
Policy key AUDIT-S4-112. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-112-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-112-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-112-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-112-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-112-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-112-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-112-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-112-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 113
Policy key AUDIT-S4-113. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-113-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-113-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-113-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-113-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-113-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-113-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-113-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-113-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 114
Policy key AUDIT-S4-114. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-114-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-114-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-114-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-114-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-114-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-114-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-114-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-114-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 115
Policy key AUDIT-S4-115. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-115-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-115-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-115-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-115-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-115-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-115-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-115-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-115-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 116
Policy key AUDIT-S4-116. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-116-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-116-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-116-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-116-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-116-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-116-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-116-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-116-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 117
Policy key AUDIT-S4-117. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-117-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-117-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-117-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-117-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-117-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-117-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-117-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-117-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 118
Policy key AUDIT-S4-118. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-118-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-118-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-118-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-118-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-118-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-118-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-118-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-118-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 119
Policy key AUDIT-S4-119. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-119-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-119-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-119-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-119-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-119-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-119-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-119-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-119-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 120
Policy key AUDIT-S4-120. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-120-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-120-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-120-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-120-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-120-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-120-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-120-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-120-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 121
Policy key AUDIT-S4-121. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-121-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-121-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-121-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-121-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-121-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-121-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-121-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-121-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 122
Policy key AUDIT-S4-122. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-122-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-122-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-122-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-122-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-122-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-122-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-122-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-122-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 123
Policy key AUDIT-S4-123. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-123-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-123-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-123-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-123-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-123-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-123-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-123-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-123-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 124
Policy key AUDIT-S4-124. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-124-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-124-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-124-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-124-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-124-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-124-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-124-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-124-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 125
Policy key AUDIT-S4-125. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-125-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-125-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-125-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-125-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-125-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-125-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-125-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-125-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 126
Policy key AUDIT-S4-126. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-126-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-126-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-126-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-126-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-126-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-126-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-126-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-126-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 127
Policy key AUDIT-S4-127. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-127-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-127-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-127-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-127-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-127-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-127-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-127-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-127-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 128
Policy key AUDIT-S4-128. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-128-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-128-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-128-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-128-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-128-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-128-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-128-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-128-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 129
Policy key AUDIT-S4-129. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-129-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-129-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-129-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-129-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-129-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-129-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-129-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-129-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 130
Policy key AUDIT-S4-130. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-130-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-130-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-130-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-130-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-130-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-130-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-130-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-130-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 131
Policy key AUDIT-S4-131. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-131-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-131-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-131-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-131-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-131-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-131-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-131-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-131-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 132
Policy key AUDIT-S4-132. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-132-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-132-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-132-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-132-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-132-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-132-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-132-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-132-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 133
Policy key AUDIT-S4-133. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-133-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-133-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-133-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-133-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-133-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-133-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-133-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-133-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 134
Policy key AUDIT-S4-134. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-134-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-134-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-134-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-134-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-134-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-134-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-134-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-134-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 135
Policy key AUDIT-S4-135. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-135-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-135-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-135-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-135-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-135-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-135-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-135-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-135-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 136
Policy key AUDIT-S4-136. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-136-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-136-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-136-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-136-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-136-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-136-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-136-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-136-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 137
Policy key AUDIT-S4-137. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-137-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-137-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-137-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-137-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-137-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-137-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-137-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-137-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 138
Policy key AUDIT-S4-138. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-138-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-138-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-138-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-138-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-138-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-138-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-138-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-138-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 139
Policy key AUDIT-S4-139. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-139-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-139-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-139-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-139-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-139-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-139-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-139-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-139-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.

## Audit Segment 140
Policy key AUDIT-S4-140. Audit metadata must be useful but safe. Never serialize request headers, cookies, full claims, password hashes, CSRF tokens, auth tickets, or raw exception objects.
- Event `user.registered.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-140-user-registered-v2.
- Event `user.login.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-140-user-login-succeeded-v2.
- Event `user.logout.succeeded.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-140-user-logout-succeeded-v2.
- Event `booking.created.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-140-booking-created-v2.
- Event `owner.restaurant.profile.updated.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-140-owner-restaurant-profile-updated-v2.
- Event `admin.audit.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-140-admin-audit-viewed-v2.
- Event `admin.owner-map.viewed.v2` must include eventId, timestampUtc, actorUserId, actorEmail, actorRole, action, targetType, targetId, outcome, and safe metadata. Segment evidence AUDIT-S4-140-admin-owner-map-viewed-v2.
- Redaction sentinel `password`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-password.
- Redaction sentinel `plainTextPassword`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-plainTextPassword.
- Redaction sentinel `passwordHash`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-passwordHash.
- Redaction sentinel `csrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-csrfToken.
- Redaction sentinel `xsrfToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-xsrfToken.
- Redaction sentinel `authCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-authCookie.
- Redaction sentinel `setCookie`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-setCookie.
- Redaction sentinel `cookieHeader`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-cookieHeader.
- Redaction sentinel `authorization`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-authorization.
- Redaction sentinel `securityStamp`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-securityStamp.
- Redaction sentinel `resetToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-resetToken.
- Redaction sentinel `refreshToken`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-refreshToken.
- Redaction sentinel `claimsPrincipal`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-claimsPrincipal.
- Redaction sentinel `rawHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-rawHeaders.
- Redaction sentinel `requestHeaders`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-requestHeaders.
- Redaction sentinel `sessionId`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-sessionId.
- Redaction sentinel `apiKey`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-apiKey.
- Redaction sentinel `connectionString`: admin audit responses and stored metadata must not contain this key or value. Test marker REDACT-S4-140-connectionString.
Allowed metadata examples: restaurantId, bookingId, changedFields, previousDisplayValue, newDisplayValue, clientCorrelationId. Values must be scalar and bounded.
