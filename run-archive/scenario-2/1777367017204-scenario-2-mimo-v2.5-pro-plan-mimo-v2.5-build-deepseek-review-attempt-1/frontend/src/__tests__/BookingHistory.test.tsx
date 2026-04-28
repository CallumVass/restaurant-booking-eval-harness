// pattern: Imperative Shell

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockUseQuery = vi.fn();

vi.mock("../lib/auth", () => ({
  useAuth: vi.fn().mockReturnValue({
    user: { email: "test@example.com", id: "user-1" },
    isLoading: false,
    isAuthenticated: true,
    login: {
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    },
    register: {
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    },
    logout: { mutate: vi.fn(), isPending: false },
  }),
  fetchCsrfToken: vi.fn().mockResolvedValue("test-token"),
  csrfHeaders: vi.fn().mockReturnValue({}),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: mockUseQuery,
    useMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    }),
    useQueryClient: vi.fn().mockReturnValue({
      invalidateQueries: vi.fn(),
    }),
  };
});

function defaultQueryImpl({ queryKey }: { queryKey: unknown[] }) {
  if (queryKey[0] === "restaurants") {
    return {
      data: [
        {
          id: "ember-table",
          name: "Ember Table",
          cuisine: "Wood-fired",
          neighborhood: "Riverside",
          description: "A test restaurant.",
          tables: [{ id: "ember-2a", capacity: 2 }],
        },
      ],
      isLoading: false,
      isFetching: false,
    };
  }
  if (queryKey[0] === "availability") {
    return { data: [], isLoading: false, isFetching: false };
  }
  if (queryKey[0] === "myBookings") {
    return { data: [], isLoading: false };
  }
  return { data: [], isLoading: false, isFetching: false };
}

describe("Booking history", () => {
  beforeEach(() => {
    mockUseQuery.mockImplementation(defaultQueryImpl);
  });

  it("shows empty state when no bookings exist", async () => {
    const { default: App } = await import("../App");
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "My bookings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No bookings yet. The first table is yours."),
    ).toBeInTheDocument();
  });

  it("displays user bookings when they exist", async () => {
    const mockBookings = [
      {
        id: "booking-1",
        restaurantId: "ember-table",
        restaurantName: "Ember Table",
        tableId: "ember-2a",
        partySize: 2,
        date: "2026-04-28",
        time: "18:00:00",
        guestName: "Test User",
        guestEmail: "test@example.com",
        userId: "user-1",
      },
      {
        id: "booking-2",
        restaurantId: "ember-table",
        restaurantName: "Ember Table",
        tableId: "ember-4",
        partySize: 4,
        date: "2026-04-29",
        time: "19:00:00",
        guestName: "Test User",
        guestEmail: "test@example.com",
        userId: "user-1",
      },
    ];

    mockUseQuery.mockImplementation(({ queryKey }: { queryKey: unknown[] }) => {
      if (queryKey[0] === "myBookings") {
        return { data: mockBookings, isLoading: false };
      }
      return defaultQueryImpl({ queryKey });
    });

    const { default: App } = await import("../App");
    render(<App />);

    const emberElements = screen.getAllByText(/Ember Table/);
    expect(emberElements.length).toBeGreaterThanOrEqual(1);
    const userElements = screen.getAllByText(/Test User/);
    expect(userElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Table ember-2a")).toBeInTheDocument();
    expect(screen.getByText("Table ember-4")).toBeInTheDocument();
  });

  it("shows loading state for bookings", async () => {
    mockUseQuery.mockImplementation(({ queryKey }: { queryKey: unknown[] }) => {
      if (queryKey[0] === "myBookings") {
        return { data: undefined, isLoading: true };
      }
      return defaultQueryImpl({ queryKey });
    });

    const { default: App } = await import("../App");
    render(<App />);

    expect(screen.getByText("Loading bookings...")).toBeInTheDocument();
  });
});
