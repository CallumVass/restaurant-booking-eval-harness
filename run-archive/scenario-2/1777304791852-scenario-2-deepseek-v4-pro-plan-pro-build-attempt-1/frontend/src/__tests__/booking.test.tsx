import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";

const mockRestaurants = [
  {
    id: "ember-table",
    name: "Ember Table",
    cuisine: "Wood-fired seasonal",
    neighborhood: "Riverside",
    description: "Open-flame cooking",
    tables: [
      { id: "t2", capacity: 2 },
      { id: "t4", capacity: 4 },
    ],
  },
];

vi.mock("../generated/booking-client", () => ({
  useListRestaurants: () => ({ data: mockRestaurants, isLoading: false }),
  useListAvailableSlots: () => ({ data: [], isFetching: false }),
  useListBookings: () => ({ data: [], isLoading: false }),
  useCreateBooking: () => ({ mutate: vi.fn(), isPending: false, data: null }),
  useAuthMe: () => ({
    data: { email: "", isAuthenticated: false },
    isLoading: false,
  }),
  useAuthLogin: () => ({ mutate: vi.fn(), isPending: false, data: null }),
  useAuthRegister: () => ({ mutate: vi.fn(), isPending: false, data: null }),
  useAuthLogout: () => ({ mutate: vi.fn(), isPending: false }),
  useAuthCsrf: () => ({ data: { token: "test-token" } }),
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

describe("Booking UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders restaurant list", () => {
    renderApp();
    expect(screen.getByText("Ember Table")).toBeDefined();
  });

  it("shows login prompt when unauthenticated", () => {
    renderApp();
    const prompts = screen.getAllByText("Sign in to book a table");
    expect(prompts.length).toBeGreaterThan(0);
    const buttons = screen.getAllByText("Sign in to continue");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders booking form title with selected restaurant", () => {
    renderApp();
    const headings = screen.getAllByText("Book Ember Table");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("shows My bookings section", () => {
    renderApp();
    const headings = screen.getAllByText("My bookings");
    expect(headings.length).toBeGreaterThan(0);
  });
});
