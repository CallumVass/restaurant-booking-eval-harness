import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import App from "./App";
import type { Booking, Restaurant } from "./generated/booking-client";

const mocks = vi.hoisted(() => ({
  currentUser: null as { email: string } | null,
  bookings: [] as Booking[],
  loginMutate: vi.fn(),
  registerMutate: vi.fn(),
  logoutMutate: vi.fn(),
  createBookingMutate: vi.fn(),
  createBookingResponse: null as { status: number; data: unknown } | null,
}));

const restaurant: Restaurant = {
  id: "ember-table",
  name: "Ember Table",
  cuisine: "Wood-fired seasonal",
  neighborhood: "Riverside",
  description: "Open-flame cooking and warm lighting.",
  tables: [{ id: "ember-2a", capacity: 2 }],
};

const confirmedBooking: Booking = {
  id: "b1",
  restaurantId: "ember-table",
  restaurantName: "Ember Table",
  tableId: "ember-2a",
  partySize: 2,
  date: "2026-05-16",
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
    getGetCurrentUserQueryKey: () => ["/api/auth/me"],
    getListRestaurantBookingsQueryKey: (id: string) => [
      `/api/restaurants/${id}/bookings`,
    ],
    useGetCsrfToken: () => ({
      data: { status: 200, data: { token: "csrf-token" } },
      refetch: vi.fn(),
    }),
    useGetCurrentUser: () => ({
      data: mocks.currentUser
        ? { status: 200, data: mocks.currentUser }
        : { status: 401, data: undefined },
    }),
    useListRestaurants: () => ({ data: { status: 200, data: [restaurant] } }),
    useListAvailableSlots: () => ({
      data: {
        status: 200,
        data: [{ time: "17:00:00", availableTableCount: 1 }],
      },
      isFetching: false,
    }),
    useListRestaurantBookings: () => ({
      data: { status: 200, data: mocks.bookings },
      isLoading: false,
    }),
    useLogin: () => ({ mutate: mocks.loginMutate, isPending: false }),
    useRegister: () => ({ mutate: mocks.registerMutate, isPending: false }),
    useLogout: () => ({ mutate: mocks.logoutMutate, isPending: false }),
    useCreateBooking: (options: {
      mutation?: { onSuccess?: (response: unknown) => void };
    }) => ({
      mutate: (payload: unknown) => {
        mocks.createBookingMutate(payload);
        if (mocks.createBookingResponse) {
          options.mutation?.onSuccess?.(mocks.createBookingResponse);
        }
      },
      isPending: false,
    }),
  };
});

describe("App booking account flows", () => {
  beforeEach(() => {
    mocks.currentUser = null;
    mocks.bookings = [];
    mocks.createBookingResponse = null;
    vi.clearAllMocks();
  });

  it("requires login before booking and offers an auth path", async () => {
    renderApp();

    await userEvent.click(screen.getByRole("button", { name: "17:00" }));
    await userEvent.type(screen.getByLabelText("Guest name"), "Avery Stone");
    await userEvent.type(
      screen.getByLabelText("Email", { selector: "#guestEmail" }),
      "avery@example.com",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Confirm booking" }),
    );

    expect(
      screen.getByText(/sign in or create an account/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to see your restaurant booking history/i),
    ).toBeInTheDocument();
    expect(mocks.createBookingMutate).not.toHaveBeenCalled();
  });

  it("submits login with the generated auth mutation", async () => {
    renderApp();

    await userEvent.click(
      screen.getAllByRole("button", { name: "Log in" }).at(-1)!,
    );

    expect(mocks.loginMutate).toHaveBeenCalledWith({
      data: { email: "demo@example.com", password: "Password123!" },
    });
  });

  it("creates a booking, shows confirmation, and displays scoped history", async () => {
    mocks.currentUser = { email: "demo@example.com" };
    mocks.bookings = [confirmedBooking];
    mocks.createBookingResponse = { status: 201, data: confirmedBooking };
    renderApp();

    await userEvent.click(screen.getByRole("button", { name: "17:00" }));
    await userEvent.type(screen.getByLabelText("Guest name"), "Avery Stone");
    await userEvent.click(
      screen.getByRole("button", { name: "Confirm booking" }),
    );

    expect(mocks.createBookingMutate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        restaurantId: "ember-table",
        guestName: "Avery Stone",
        guestEmail: "demo@example.com",
      }),
    });
    expect(await screen.findByText(/Booking confirmed/i)).toBeInTheDocument();
    expect(screen.getAllByText("Avery Stone").length).toBeGreaterThan(0);
  });

  it("shows API booking errors", async () => {
    mocks.currentUser = { email: "demo@example.com" };
    mocks.createBookingResponse = {
      status: 409,
      data: {
        code: "OverlappingReservation",
        message: "No suitable table is available at that time.",
      },
    };
    renderApp();

    await userEvent.click(screen.getByRole("button", { name: "17:00" }));
    await userEvent.type(screen.getByLabelText("Guest name"), "Avery Stone");
    await userEvent.click(
      screen.getByRole("button", { name: "Confirm booking" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "No suitable table is available at that time.",
      );
    });
  });
});

function renderApp() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  );
}
