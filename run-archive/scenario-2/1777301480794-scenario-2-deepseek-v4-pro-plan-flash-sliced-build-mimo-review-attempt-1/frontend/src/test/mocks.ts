import { http, HttpResponse } from "msw";

const today = new Date().toISOString().slice(0, 10);

export const handlers = [
  http.get("/api/restaurants", () => {
    return HttpResponse.json([
      {
        id: "ember-table",
        name: "Ember Table",
        cuisine: "Wood-fired seasonal",
        neighborhood: "Riverside",
        description:
          "Open-flame cooking, warm lighting, and produce-led tasting plates.",
        tables: [
          { id: "ember-2a", capacity: 2 },
          { id: "ember-2b", capacity: 2 },
          { id: "ember-4", capacity: 4 },
          { id: "ember-6", capacity: 6 },
        ],
      },
      {
        id: "luna-verde",
        name: "Luna Verde",
        cuisine: "Modern Italian",
        neighborhood: "Old Town",
        description:
          "Handmade pasta, coastal wines, and a relaxed plant-filled dining room.",
        tables: [
          { id: "luna-2", capacity: 2 },
          { id: "luna-4a", capacity: 4 },
          { id: "luna-4b", capacity: 4 },
          { id: "luna-8", capacity: 8 },
        ],
      },
    ]);
  }),

  http.get("/api/restaurants/:id/availability", ({ params, request }) => {
    const url = new URL(request.url);
    const partySize = Number(url.searchParams.get("partySize"));

    if (partySize < 1 || partySize > 8) {
      return HttpResponse.json(
        {
          code: "InvalidPartySize",
          message: "Party size must be between 1 and 8.",
        },
        { status: 400 },
      );
    }

    if (params.id === "unknown") {
      return HttpResponse.json(
        { code: "UnknownRestaurant", message: "Restaurant was not found." },
        { status: 404 },
      );
    }

    return HttpResponse.json([
      { time: "17:00", availableTableCount: 2 },
      { time: "18:00", availableTableCount: 1 },
      { time: "19:00", availableTableCount: 2 },
      { time: "20:00", availableTableCount: 1 },
      { time: "21:00", availableTableCount: 2 },
    ]);
  }),

  http.get("/api/bookings", () => {
    return HttpResponse.json([]);
  }),

  http.post("/api/bookings", async ({ request }) => {
    const body = (await request.json()) as {
      restaurantId: string;
      date: string;
      time: string;
      partySize: number;
      guestName: string;
      guestEmail: string;
    };

    if (body.partySize < 1 || body.partySize > 8) {
      return HttpResponse.json(
        {
          code: "InvalidPartySize",
          message: "Party size must be between 1 and 8.",
        },
        { status: 400 },
      );
    }

    if (body.restaurantId === "nonexistent") {
      return HttpResponse.json(
        { code: "UnknownRestaurant", message: "Restaurant was not found." },
        { status: 404 },
      );
    }

    if (body.restaurantId === "overlap-rest") {
      return HttpResponse.json(
        {
          code: "OverlappingReservation",
          message: "No suitable table is available at that time.",
        },
        { status: 409 },
      );
    }

    if (body.date < today) {
      return HttpResponse.json(
        {
          code: "InvalidDate",
          message: "Bookings must be made from today up to 30 days ahead.",
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        id: "new-booking-1",
        restaurantId: body.restaurantId,
        restaurantName: "Ember Table",
        tableId: "ember-2a",
        partySize: body.partySize,
        date: body.date,
        time: body.time,
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        userId: "test-user-id",
      },
      { status: 201 },
    );
  }),

  http.get("/api/bookings/mine", () => {
    return HttpResponse.json([
      {
        id: "my-booking-1",
        restaurantId: "ember-table",
        restaurantName: "Ember Table",
        tableId: "ember-2a",
        partySize: 2,
        date: today,
        time: "18:00",
        guestName: "Alice",
        guestEmail: "alice@example.com",
        userId: "test-user-id",
      },
    ]);
  }),

  http.get("/api/auth/csrf-token", () => {
    return HttpResponse.json({ token: "test-csrf-token" });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      displayName: string;
    };

    if (body.email === "existing@example.com") {
      return HttpResponse.json(
        {
          code: "DuplicateEmail",
          message: "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    return HttpResponse.json(
      { id: "new-user-id", email: body.email, displayName: body.displayName },
      { status: 200 },
    );
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === "fail@example.com") {
      return HttpResponse.json(
        { code: "InvalidCredentials", message: "Invalid email or password." },
        { status: 401 },
      );
    }

    return HttpResponse.json(
      { id: "user-id", email: body.email, displayName: "Test User" },
      { status: 200 },
    );
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ message: "Logged out." });
  }),

  http.get("/api/auth/me", ({ request }) => {
    const cookie = request.headers.get("cookie") || "";
    if (cookie.includes(".AspNetCore.Cookies")) {
      return HttpResponse.json(
        {
          id: "test-user-id",
          email: "test@example.com",
          displayName: "Test User",
        },
        { status: 200 },
      );
    }
    return HttpResponse.json(
      { code: "Unauthenticated", message: "Authentication required." },
      { status: 401 },
    );
  }),
];
