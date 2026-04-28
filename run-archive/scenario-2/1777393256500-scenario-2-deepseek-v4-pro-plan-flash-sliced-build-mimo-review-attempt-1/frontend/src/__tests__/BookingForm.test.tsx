import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockLogout = vi.fn();

vi.mock("../generated/booking-client", () => ({
  useListRestaurants: vi.fn(),
  useListBookings: vi.fn(),
  useListMyBookings: vi.fn(),
  useListAvailableSlots: vi.fn(),
  useCreateBooking: vi.fn(),
  getListBookingsQueryKey: vi.fn(() => ["/api/bookings"]),
  getListMyBookingsQueryKey: vi.fn(() => ["/api/bookings/mine"]),
  getListAvailableSlotsQueryKey: vi.fn(() => [
    "/api/restaurants/1/availability",
  ]),
}));

vi.mock("../lib/auth-context", () => ({
  useAuth: vi.fn(),
}));

import {
  useListRestaurants,
  useListBookings,
  useListMyBookings,
  useListAvailableSlots,
  useCreateBooking,
} from "../generated/booking-client";
import { useAuth } from "../lib/auth-context";

const restaurantsData = [
  {
    id: "saffron-court",
    name: "Saffron Court",
    cuisine: "Modern Indian",
    neighborhood: "Downtown",
    description: "Elegant tasting menus.",
    tables: [
      { id: "saffron-4", capacity: 4 },
      { id: "saffron-8", capacity: 8 },
    ],
  },
];

const availabilitySlots = [
  { time: "17:00:00", availableTableCount: 2 },
  { time: "18:00:00", availableTableCount: 1 },
];

function renderApp(authenticated = true) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
    user: authenticated
      ? { id: "u1", name: "Alice", email: "alice@test.com" }
      : null,
    isAuthenticated: authenticated,
    authLoading: false,
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
    loginError: null,
    registerError: null,
    loginPending: false,
    registerPending: false,
  });

  (useListRestaurants as ReturnType<typeof vi.fn>).mockReturnValue({
    data: { data: restaurantsData, status: 200 },
    isLoading: false,
  });

  (useListBookings as ReturnType<typeof vi.fn>).mockReturnValue({
    data: { data: [], status: 200 },
    isLoading: false,
  });

  (useListMyBookings as ReturnType<typeof vi.fn>).mockReturnValue({
    data: { data: [], status: 200 },
    isLoading: false,
  });

  (useListAvailableSlots as ReturnType<typeof vi.fn>).mockReturnValue({
    data: { data: availabilitySlots, status: 200 },
    isFetching: false,
  });

  (useCreateBooking as ReturnType<typeof vi.fn>).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe("BookingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows sign-in prompt when unauthenticated", async () => {
    const user = userEvent.setup();
    renderApp(false);

    await user.click(screen.getByRole("button", { name: /book a table/i }));

    expect(screen.getByText(/sign in to book a table/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in or create an account/i }),
    ).toBeInTheDocument();
  });

  it("renders booking form fields when authenticated", async () => {
    const user = userEvent.setup();
    renderApp(true);

    await user.click(screen.getByRole("button", { name: /book a table/i }));

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/party size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm booking/i }),
    ).toBeInTheDocument();
  });

  it("displays availability slots when authenticated", async () => {
    const user = userEvent.setup();
    renderApp(true);

    await user.click(screen.getByRole("button", { name: /book a table/i }));

    expect(
      screen.getByLabelText(/available seating times/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/17:00/i)).toBeInTheDocument();
    expect(screen.getByText(/18:00/i)).toBeInTheDocument();
  });

  it("shows error message on API failure", async () => {
    const user = userEvent.setup();
    const mutate = vi.fn();
    (useCreateBooking as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate,
      isPending: false,
    });

    renderApp(true);
    await user.click(screen.getByRole("button", { name: /book a table/i }));

    expect(
      screen.getByRole("button", { name: /confirm booking/i }),
    ).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });
});
