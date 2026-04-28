import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const restaurant = {
  id: "ember-table",
  name: "Ember Table",
  cuisine: "Wood-fired seasonal",
  neighborhood: "Riverside",
  description: "Open-flame cooking and warm lighting.",
  tables: [{ id: "ember-2a", capacity: 2 }],
};

const slot = { time: "17:00:00", availableTableCount: 1 };

type MockState = {
  authenticated: boolean;
  bookingError: boolean;
  bookings: unknown[];
  email: string;
};

describe("booking app", () => {
  let state: MockState;

  beforeEach(() => {
    state = {
      authenticated: false,
      bookingError: false,
      bookings: [],
      email: "demo@restaurant.test",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn((input, init) => mockFetch(input, init, state)),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("requires login before booking", async () => {
    const user = userEvent.setup();
    renderApp();

    await chooseFirstSlot(user);
    await fillGuest(user);
    await user.click(screen.getByRole("button", { name: /sign in to book/i }));

    expect(
      await screen.findByText(
        /sign in or create an account before confirming/i,
      ),
    ).toBeTruthy();
  });

  it("logs in, creates a booking, and shows confirmation plus history", async () => {
    const user = userEvent.setup();
    renderApp();

    await clickLoginSubmit(user);
    expect(await screen.findByText(/signed in/i)).toBeTruthy();

    await chooseFirstSlot(user);
    await fillGuest(user);
    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(await screen.findByText(/booking confirmed/i)).toBeTruthy();
    expect(await screen.findByText("Avery Stone")).toBeTruthy();
  });

  it("registers a local account", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole("button", { name: /register/i }));
    await user.clear(
      screen.getByLabelText(/email/i, { selector: "#authEmail" }),
    );
    await user.type(
      screen.getByLabelText(/email/i, { selector: "#authEmail" }),
      "new@example.test",
    );
    await user.clear(
      screen.getByLabelText(/password/i, { selector: "#authPassword" }),
    );
    await user.type(
      screen.getByLabelText(/password/i, { selector: "#authPassword" }),
      "Register42!",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/signed in/i)).toBeTruthy();
    expect(screen.getByText(/new@example.test/i)).toBeTruthy();
  });

  it("shows booking API errors", async () => {
    state.bookingError = true;
    const user = userEvent.setup();
    renderApp();

    await clickLoginSubmit(user);
    await chooseFirstSlot(user);
    await fillGuest(user);
    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(
      await screen.findByText(/no suitable table is available/i),
    ).toBeTruthy();
  });

  it("logs out and hides booking history", async () => {
    const user = userEvent.setup();
    renderApp();

    await clickLoginSubmit(user);
    await user.click(await screen.findByRole("button", { name: /logout/i }));

    expect(
      await screen.findByText(/use the seeded demo account/i),
    ).toBeTruthy();
    expect(
      screen.getByText(/sign in to see your booking history/i),
    ).toBeTruthy();
  });
});

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

async function chooseFirstSlot(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: /17:00/i }));
}

async function fillGuest(user: ReturnType<typeof userEvent.setup>) {
  await user.clear(screen.getByLabelText(/guest name/i));
  await user.type(screen.getByLabelText(/guest name/i), "Avery Stone");
  await user.clear(
    screen.getByLabelText(/^email$/i, { selector: "#guestEmail" }),
  );
  await user.type(
    screen.getByLabelText(/^email$/i, { selector: "#guestEmail" }),
    "avery@example.com",
  );
}

async function clickLoginSubmit(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByText(/use the seeded demo account/i);
  const buttons = screen.getAllByRole("button", { name: /^login$/i });
  await user.click(buttons[buttons.length - 1]);
}

async function mockFetch(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  state: MockState,
) {
  const url = String(input);
  const method = init?.method ?? "GET";

  if (url === "/api/auth/csrf") {
    return json({ token: "csrf-token" });
  }

  if (url === "/api/auth/me") {
    return state.authenticated
      ? json({ id: "user-1", email: state.email })
      : json(undefined, 401);
  }

  if (url === "/api/auth/login" && method === "POST") {
    state.authenticated = true;
    state.email = "demo@restaurant.test";
    return json({ id: "user-1", email: "demo@restaurant.test" });
  }

  if (url === "/api/auth/register" && method === "POST") {
    state.authenticated = true;
    const body = JSON.parse(String(init?.body ?? "{}")) as { email: string };
    state.email = body.email;
    return json({ id: "user-2", email: body.email }, 201);
  }

  if (url === "/api/auth/logout" && method === "POST") {
    state.authenticated = false;
    state.bookings = [];
    return json(undefined, 204);
  }

  if (url === "/api/restaurants") {
    return json([restaurant]);
  }

  if (url.startsWith("/api/restaurants/ember-table/availability")) {
    return json([slot]);
  }

  if (url === "/api/restaurants/ember-table/bookings") {
    return state.authenticated ? json(state.bookings) : json(undefined, 401);
  }

  if (url === "/api/bookings" && method === "POST") {
    if (!state.authenticated) {
      return json(undefined, 401);
    }

    if (state.bookingError) {
      return json(
        {
          code: "OverlappingReservation",
          message: "No suitable table is available at that time.",
        },
        409,
      );
    }

    const request = JSON.parse(String(init?.body ?? "{}"));
    const booking = {
      id: "booking-1",
      userId: "user-1",
      restaurantName: restaurant.name,
      tableId: "ember-2a",
      ...request,
    };
    state.bookings = [booking];
    return json(booking, 201);
  }

  throw new Error(`Unhandled request: ${method} ${url}`);
}

function json(body: unknown, status = 200) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
