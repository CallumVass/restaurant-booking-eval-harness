import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";

vi.mock("../generated/booking-client", () => ({
  useListRestaurants: () => ({ data: [], isLoading: false }),
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

describe("Authentication UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sign in button when unauthenticated", () => {
    renderApp();
    expect(screen.getByText("Sign in")).toBeDefined();
  });

  it("shows auth dialog when sign in is clicked", async () => {
    const user = userEvent.setup();
    renderApp();

    const signInButtons = screen.getAllByText("Sign in");
    await user.click(signInButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Sign in to manage your bookings."),
      ).toBeDefined();
    });
  });

  it("auth dialog shows email and password fields", async () => {
    const user = userEvent.setup();
    renderApp();

    const signInButtons = screen.getAllByText("Sign in");
    await user.click(signInButtons[0]);

    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toBeDefined();
      expect(screen.getByLabelText("Password")).toBeDefined();
    });
  });

  it("can close auth dialog", async () => {
    const user = userEvent.setup();
    renderApp();

    const signInButtons = screen.getAllByText("Sign in");
    await user.click(signInButtons[0]);

    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toBeDefined();
    });

    const closeButton = screen.getByLabelText("Close");
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByLabelText("Email")).toBeNull();
    });
  });
});
