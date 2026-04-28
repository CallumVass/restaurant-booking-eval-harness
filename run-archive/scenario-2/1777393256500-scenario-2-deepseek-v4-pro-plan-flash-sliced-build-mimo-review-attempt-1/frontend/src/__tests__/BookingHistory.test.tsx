import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

const mockMyBookings = [
  {
    id: "b1",
    restaurantId: "saffron-court",
    restaurantName: "Saffron Court",
    tableId: "saffron-4",
    partySize: 2,
    date: "2026-05-15",
    time: "18:00:00",
    guestName: "Alice",
    guestEmail: "alice@test.com",
    userId: "u1",
  },
];

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

describe("BookingHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setupMocks(overrides: {
    authenticated?: boolean;
    myBookingsData?: typeof mockMyBookings;
    myBookingsLoading?: boolean;
    myBookingsStatus?: number;
  }) {
    const {
      authenticated = true,
      myBookingsData = mockMyBookings,
      myBookingsLoading = false,
      myBookingsStatus = 200,
    } = overrides;

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
      data:
        myBookingsStatus === 200
          ? { data: myBookingsData, status: 200 }
          : {
              data: { code: "Unauthorized", message: "Unauthorized" },
              status: myBookingsStatus,
            },
      isLoading: myBookingsLoading,
    });

    (useListAvailableSlots as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { data: [], status: 200 },
      isFetching: false,
    });

    (useCreateBooking as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  }

  function renderApp() {
    const queryClient = createQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  }

  async function navigateToMyBookings(
    user: ReturnType<typeof userEvent.setup>,
  ) {
    await user.click(screen.getByRole("button", { name: /your bookings/i }));
  }

  it("shows user bookings from /mine endpoint", async () => {
    const user = userEvent.setup();
    setupMocks({ authenticated: true, myBookingsData: mockMyBookings });
    renderApp();
    await navigateToMyBookings(user);

    await waitFor(() => {
      expect(screen.getByText("Saffron Court")).toBeInTheDocument();
    });
    expect(screen.getByText(/2026-05-15/i)).toBeInTheDocument();
  });

  it("shows empty state when no bookings", async () => {
    const user = userEvent.setup();
    setupMocks({ authenticated: true, myBookingsData: [] });
    renderApp();
    await navigateToMyBookings(user);

    await waitFor(() => {
      expect(screen.getByText(/no bookings yet/i)).toBeInTheDocument();
    });
    const ctaButtons = screen.getAllByRole("button", { name: /book a table/i });
    expect(ctaButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("shows loading state while fetching", async () => {
    const user = userEvent.setup();
    setupMocks({
      authenticated: true,
      myBookingsLoading: true,
      myBookingsData: [],
    });
    renderApp();
    await navigateToMyBookings(user);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/loading your bookings/i),
      ).toBeInTheDocument();
    });
  });

  it("shows sign-in prompt when unauthenticated", async () => {
    const user = userEvent.setup();
    setupMocks({ authenticated: false });
    renderApp();
    await navigateToMyBookings(user);

    await waitFor(() => {
      expect(
        screen.getByText(/sign in to view your bookings/i),
      ).toBeInTheDocument();
    });
  });

  it("shows session expired on 401", async () => {
    const user = userEvent.setup();
    setupMocks({
      authenticated: true,
      myBookingsStatus: 401,
      myBookingsData: [],
    });
    renderApp();
    await navigateToMyBookings(user);

    await waitFor(() => {
      expect(screen.getByText(/session expired/i)).toBeInTheDocument();
    });
  });
});
