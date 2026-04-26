import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { Booking, Restaurant } from "./generated/booking-client";

const mutateLogin = vi.fn();
const mutateRegister = vi.fn();
const mutateLogout = vi.fn();
const mutateCreateBooking = vi.fn();
let authenticated = false;
let bookingResponse:
  | { status: 201; data: Booking }
  | { status: 409; data: { code: string; message: string } }
  | null = null;

const restaurants: Restaurant[] = [
  {
    id: "ember-table",
    name: "Ember Table",
    cuisine: "Wood-fired seasonal",
    neighborhood: "Riverside",
    description: "Open-flame cooking and warm lighting.",
    tables: [{ id: "ember-2a", capacity: 2 }],
  },
];

const confirmedBooking: Booking = {
  id: "booking-1",
  restaurantId: "ember-table",
  restaurantName: "Ember Table",
  tableId: "ember-2a",
  partySize: 2,
  date: "2026-04-27",
  time: "17:00:00",
  guestName: "Avery Stone",
  guestEmail: "avery@example.com",
};

vi.mock("./generated/booking-client", async () => {
  const actual = await vi.importActual<
    typeof import("./generated/booking-client")
  >("./generated/booking-client");

  return {
    ...actual,
    useGetCsrfToken: () => ({
      data: { status: 200, data: { token: "csrf-token" } },
      refetch: vi.fn(),
    }),
    useGetCurrentUser: () => ({
      data: authenticated
        ? { status: 200, data: { email: "avery@example.com" } }
        : { status: 401, data: undefined },
    }),
    useListRestaurants: () => ({
      data: { status: 200, data: restaurants },
      isLoading: false,
    }),
    useListAvailableSlots: () => ({
      data: {
        status: 200,
        data: [{ time: "17:00:00", availableTableCount: 1 }],
      },
      isFetching: false,
    }),
    useListBookings: () => ({
      data: { status: 200, data: authenticated ? [confirmedBooking] : [] },
      isLoading: false,
    }),
    useLogin: (options: {
      mutation?: { onSuccess?: (response: unknown) => void };
    }) => ({
      mutate: (payload: unknown) => {
        mutateLogin(payload);
        authenticated = true;
        options.mutation?.onSuccess?.({
          status: 200,
          data: { email: "avery@example.com" },
        });
      },
      isPending: false,
    }),
    useRegister: (options: {
      mutation?: { onSuccess?: (response: unknown) => void };
    }) => ({
      mutate: (payload: unknown) => {
        mutateRegister(payload);
        authenticated = true;
        options.mutation?.onSuccess?.({
          status: 200,
          data: { email: "avery@example.com" },
        });
      },
      isPending: false,
    }),
    useLogout: () => ({ mutate: mutateLogout, isPending: false }),
    useCreateBooking: (options: {
      mutation?: { onSuccess?: (response: unknown) => void };
    }) => ({
      mutate: (payload: unknown) => {
        mutateCreateBooking(payload);
        options.mutation?.onSuccess?.(
          bookingResponse ?? { status: 201, data: confirmedBooking },
        );
      },
      isPending: false,
    }),
  };
});

describe("App", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    authenticated = false;
    bookingResponse = null;
    mutateLogin.mockClear();
    mutateRegister.mockClear();
    mutateLogout.mockClear();
    mutateCreateBooking.mockClear();
  });

  it("gates booking creation until the user is authenticated", async () => {
    renderApp();

    expect(
      screen.getByText(/sign in or create a local account/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm booking/i }),
    ).toBeDisabled();
  });

  it("submits login with the generated auth mutation shape", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getAllByRole("button", { name: /^login$/i })[1]);

    expect(mutateLogin).toHaveBeenCalledWith({
      data: { email: "demo@example.com", password: "Password123!" },
    });
  });

  it("creates a booking and displays confirmation/history for signed-in users", async () => {
    authenticated = true;
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: /17:00/i }));
    await user.type(screen.getByLabelText(/guest name/i), "Avery Stone");
    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(mutateCreateBooking).toHaveBeenCalledWith({
      data: expect.objectContaining({
        restaurantId: "ember-table",
        time: "17:00:00",
      }),
    });
    expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/your booking history/i)).toBeInTheDocument();
  });

  it("shows API conflict errors from booking creation", async () => {
    authenticated = true;
    bookingResponse = {
      status: 409,
      data: {
        code: "OverlappingReservation",
        message: "No suitable table is available.",
      },
    };
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: /17:00/i }));
    await user.type(screen.getByLabelText(/guest name/i), "Avery Stone");
    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(
      screen.getByText("No suitable table is available."),
    ).toBeInTheDocument();
  });
});

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}
