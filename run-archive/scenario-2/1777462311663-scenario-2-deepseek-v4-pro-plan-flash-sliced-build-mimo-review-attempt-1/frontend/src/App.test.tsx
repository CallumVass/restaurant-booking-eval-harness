import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const mockRestaurants = [
  {
    id: "1",
    name: "Test Restaurant",
    cuisine: "Italian",
    neighborhood: "Downtown",
    description: "A test restaurant",
    tables: [
      { id: "t1", capacity: 4 },
      { id: "t2", capacity: 6 },
    ],
  },
];

const mockSlots = [
  { time: "17:00", availableTableCount: 2 },
  { time: "18:00", availableTableCount: 1 },
];

const mockBookings = [
  {
    id: "b1",
    restaurantId: "1",
    restaurantName: "Test Restaurant",
    tableId: "t1",
    partySize: 2,
    date: "2026-04-30",
    time: "17:00",
    guestName: "Alice",
    guestEmail: "alice@example.com",
  },
];

let mockUseAuthReturn: ReturnType<typeof getDefaultAuthReturn>;

function getDefaultAuthReturn() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    csrfToken: "test-csrf-token",
  };
}

let mockCreateBookingMutateHandler = vi.fn();

vi.mock("./generated/booking-client", () => ({
  useListRestaurants: () => ({
    data: { data: mockRestaurants, status: 200 },
    isLoading: false,
    isFetching: false,
  }),
  useListAvailableSlots: () => ({
    data: { data: mockSlots, status: 200 },
    isLoading: false,
    isFetching: false,
    error: null,
  }),
  useListBookingsMine: (opts: unknown) => {
    const enabled = (opts as { query?: { enabled?: boolean } })?.query?.enabled;
    return {
      data: enabled === false ? undefined : { data: mockBookings, status: 200 },
      isLoading: false,
    };
  },
  useCreateBooking: () => ({
    mutate: (...args: unknown[]) => mockCreateBookingMutateHandler(...args),
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useGetAuthMe: () => ({
    data: { data: null, status: 200 },
    isLoading: false,
    refetch: vi.fn(),
  }),
  useLogin: () => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useRegister: () => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useLogout: () => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("./hooks/useAuth", () => ({
  useAuth: () => mockUseAuthReturn,
}));

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthReturn = getDefaultAuthReturn();
    mockCreateBookingMutateHandler = vi.fn();
  });

  it("renders restaurant list", async () => {
    renderApp();
    const headings = screen.getAllByText("Restaurants");
    expect(headings.length).toBeGreaterThan(0);
    const names = screen.getAllByText("Test Restaurant");
    expect(names.length).toBeGreaterThan(0);
  });

  it("shows login prompt when unauthenticated", async () => {
    renderApp();
    const prompts = screen.getAllByText("Sign in to book a table");
    expect(prompts.length).toBeGreaterThan(0);
    const signInButtons = screen.getAllByRole("button", { name: "Sign in" });
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  it("shows booking form when authenticated", async () => {
    mockUseAuthReturn = {
      user: { id: "user-1", email: "alice@example.com" },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      csrfToken: "test-csrf-token",
    };

    renderApp();
    const confirmButtons = screen.getAllByRole("button", {
      name: "Confirm booking",
    });
    expect(confirmButtons.length).toBeGreaterThan(0);
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    const signOutButtons = screen.getAllByRole("button", { name: "Sign out" });
    expect(signOutButtons.length).toBeGreaterThan(0);
  });

  it("form submission triggers createBooking mutation", async () => {
    mockUseAuthReturn = {
      user: { id: "user-1", email: "alice@example.com" },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      csrfToken: "test-csrf-token",
    };

    let capturedArgs: unknown = null;
    mockCreateBookingMutateHandler = vi.fn((...args: unknown[]) => {
      capturedArgs = args;
    });

    renderApp();

    const user = userEvent.setup();

    const dateInput = screen.getByLabelText("Date");
    const guestNameInput = screen.getByLabelText("Guest name");
    const guestEmailInput = screen.getByLabelText("Email");

    await user.clear(dateInput);
    await user.type(dateInput, "2026-05-15");
    await user.clear(guestNameInput);
    await user.type(guestNameInput, "Alice");
    await user.clear(guestEmailInput);
    await user.type(guestEmailInput, "alice@example.com");

    const timeButtons = screen.getAllByRole("button", { name: /17:00/ });
    expect(timeButtons.length).toBeGreaterThan(0);
    await user.click(timeButtons[0]);

    const confirmButtons = screen.getAllByRole("button", {
      name: "Confirm booking",
    });
    await user.click(confirmButtons[0]);

    expect(capturedArgs).not.toBeNull();
    const mutationVar = (capturedArgs as unknown[])[0] as Record<
      string,
      unknown
    >;
    expect(mutationVar).toMatchObject({
      data: {
        restaurantId: "1",
        date: "2026-05-15",
        time: "17:00",
        partySize: 2,
        guestName: "Alice",
        guestEmail: "alice@example.com",
      },
    });
  });

  it("displays API error messages", async () => {
    mockUseAuthReturn = {
      user: { id: "user-1", email: "alice@example.com" },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      csrfToken: "test-csrf-token",
    };

    mockCreateBookingMutateHandler = vi.fn(
      (
        _args: unknown,
        options: { onSuccess?: (response: unknown) => void },
      ) => {
        options?.onSuccess?.({
          status: 400,
          data: { code: "INVALID_PARTY_SIZE", message: "Invalid party size" },
        });
      },
    );

    renderApp();

    const user = userEvent.setup();

    const timeButtons = screen.getAllByRole("button", { name: /17:00/ });
    await user.click(timeButtons[0]);

    const confirmButtons = screen.getAllByRole("button", {
      name: "Confirm booking",
    });
    await user.click(confirmButtons[0]);

    await waitFor(() => {
      const errors = screen.getAllByText("Invalid party size");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it("shows confirmation after booking", async () => {
    mockUseAuthReturn = {
      user: { id: "user-1", email: "alice@example.com" },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      csrfToken: "test-csrf-token",
    };

    mockCreateBookingMutateHandler = vi.fn(
      (
        _args: unknown,
        options: { onSuccess?: (response: unknown) => void },
      ) => {
        options?.onSuccess?.({
          status: 201,
          data: {
            id: "new-booking",
            restaurantId: "1",
            restaurantName: "Test Restaurant",
            tableId: "t1",
            partySize: 2,
            date: "2026-05-15",
            time: "17:00",
            guestName: "Alice",
            guestEmail: "alice@example.com",
          },
        });
      },
    );

    renderApp();

    const user = userEvent.setup();

    const timeButtons = screen.getAllByRole("button", { name: /17:00/ });
    await user.click(timeButtons[0]);

    const confirmButtons = screen.getAllByRole("button", {
      name: "Confirm booking",
    });
    await user.click(confirmButtons[0]);

    await waitFor(() => {
      const confirmed = screen.getAllByText("Booking confirmed");
      expect(confirmed.length).toBeGreaterThan(0);
      const reserved = screen.getAllByText(
        /Alice, your table at Test Restaurant is reserved/,
      );
      expect(reserved.length).toBeGreaterThan(0);
    });
  });

  it("shows booking history", async () => {
    mockUseAuthReturn = {
      user: { id: "user-1", email: "alice@example.com" },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      csrfToken: "test-csrf-token",
    };

    renderApp();
    const yourBookings = screen.getAllByText("Your bookings");
    expect(yourBookings.length).toBeGreaterThan(0);
    const names = screen.getAllByText("Test Restaurant");
    expect(names.length).toBeGreaterThan(0);
    const alice = screen.getAllByText(/Alice/);
    expect(alice.length).toBeGreaterThan(0);
  });
});
