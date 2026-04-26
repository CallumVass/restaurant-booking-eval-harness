import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AuthContext } from "./lib/use-auth";

vi.mock("./generated/booking-client", () => ({
  useListRestaurants: () => ({
    data: {
      data: [
        {
          id: "test-rest",
          name: "Test Kitchen",
          cuisine: "Test",
          neighborhood: "Test District",
          description: "A test restaurant.",
          tables: [{ id: "t2", capacity: 2 }],
        },
      ],
      status: 200,
    },
    isLoading: false,
    isFetching: false,
  }),
  useListBookings: () => ({
    data: { data: [], status: 200 },
    isLoading: false,
  }),
  useListAvailableSlots: () => ({
    data: { data: [], status: 200 },
    isLoading: false,
    isFetching: false,
    error: null,
  }),
  useCreateBooking: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useListMyBookings: () => ({
    data: { data: [], status: 200 },
    isLoading: false,
  }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user: { id: "test-id", email: "test@example.com" },
          isLoading: false,
          login: async () => {},
          register: async () => {},
          logout: async () => {},
        }}
      >
        {ui}
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe("App", () => {
  it("renders the header and restaurant list for authenticated users", () => {
    renderWithProviders(<App />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Test Kitchen")).toBeInTheDocument();
  });

  it("shows booking tab active and history tab for authenticated users", () => {
    renderWithProviders(<App />);

    expect(screen.getByText("My bookings")).toBeInTheDocument();
  });
});
