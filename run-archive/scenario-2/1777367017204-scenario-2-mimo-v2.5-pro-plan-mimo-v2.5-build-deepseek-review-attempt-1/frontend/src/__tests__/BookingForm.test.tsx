// pattern: Imperative Shell

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockMutateAsync = vi.fn();

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
    useQuery: vi.fn().mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "restaurants") {
        return {
          data: [
            {
              id: "ember-table",
              name: "Ember Table",
              cuisine: "Wood-fired",
              neighborhood: "Riverside",
              description: "A test restaurant.",
              tables: [
                { id: "ember-2a", capacity: 2 },
                { id: "ember-4", capacity: 4 },
              ],
            },
          ],
          isLoading: false,
          isFetching: false,
        };
      }
      if (queryKey[0] === "availability") {
        return {
          data: [
            { time: "17:00:00", availableTableCount: 2 },
            { time: "18:00:00", availableTableCount: 1 },
            { time: "19:00:00", availableTableCount: 3 },
          ],
          isLoading: false,
          isFetching: false,
        };
      }
      if (queryKey[0] === "myBookings") {
        return { data: [], isLoading: false };
      }
      return { data: [], isLoading: false, isFetching: false };
    }),
    useMutation: vi.fn().mockReturnValue({
      mutate: mockMutateAsync,
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

vi.mock("../generated/booking-client", () => ({
  createBooking: vi.fn(),
  listAvailableSlots: vi.fn(),
  listMyBookings: vi.fn(),
  listRestaurants: vi.fn(),
}));

describe("Booking form", () => {
  it("renders booking form with date and party size fields", async () => {
    const { default: App } = await import("../App");
    render(<App />);

    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Party size")).toBeInTheDocument();
    expect(screen.getByText("Available times")).toBeInTheDocument();
  });

  it("shows available time slots", async () => {
    const { default: App } = await import("../App");
    render(<App />);

    expect(screen.getByText("17:00")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
    expect(screen.getByText("19:00")).toBeInTheDocument();
  });

  it("shows error when submitting without selecting a time", async () => {
    const user = userEvent.setup();
    const { default: App } = await import("../App");
    render(<App />);

    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(
      screen.getByText("Choose an available seating time before booking."),
    ).toBeInTheDocument();
  });

  it("calls mutate when form is submitted with valid data", async () => {
    const user = userEvent.setup();
    const { default: App } = await import("../App");
    render(<App />);

    await user.click(screen.getByText("18:00"));
    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(mockMutateAsync).toHaveBeenCalled();
  });

  it("displays booking confirmation after successful submission", async () => {
    const { useMutation } = await import("@tanstack/react-query");
    const mockConfirmation = {
      id: "booking-1",
      restaurantName: "Ember Table",
      guestName: "test@example.com",
      date: "2026-04-28",
      time: "18:00:00",
      partySize: 2,
      tableId: "ember-2a",
      restaurantId: "ember-table",
      guestEmail: "test@example.com",
      userId: "user-1",
    };

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn().mockResolvedValue({
        status: 201,
        data: mockConfirmation,
      }),
      isPending: false,
      isError: false,
      error: null,
      data: { status: 201, data: mockConfirmation },
      isSuccess: true,
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: false,
      isPaused: false,
      submittedAt: Date.now(),
      variables: undefined,
      status: "success" as const,
    } as ReturnType<typeof useMutation>);

    const { default: App } = await import("../App");
    render(<App />);

    expect(screen.getByText("Book Ember Table")).toBeInTheDocument();
  });
});
