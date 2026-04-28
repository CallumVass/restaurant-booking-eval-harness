// pattern: Imperative Shell

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../lib/auth", () => ({
  useAuth: vi.fn(),
  fetchCsrfToken: vi.fn().mockResolvedValue("test-token"),
  csrfHeaders: vi.fn().mockReturnValue({}),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
    }),
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

function mockAuth(overrides: Record<string, unknown> = {}) {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
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
    ...overrides,
  } as never;
}

describe("App auth gate", () => {
  it("shows auth page when not authenticated", async () => {
    const { useAuth } = await import("../lib/auth");
    vi.mocked(useAuth).mockReturnValue(mockAuth());

    const { default: App } = await import("../App");
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows loading state while checking auth", async () => {
    const { useAuth } = await import("../lib/auth");
    vi.mocked(useAuth).mockReturnValue(mockAuth({ isLoading: true }));

    const { default: App } = await import("../App");
    const { container } = render(<App />);

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows booking UI when authenticated", async () => {
    const { useAuth } = await import("../lib/auth");
    vi.mocked(useAuth).mockReturnValue(
      mockAuth({
        user: { email: "test@example.com", id: "user-1" },
        isAuthenticated: true,
      }),
    );

    const { default: App } = await import("../App");
    render(<App />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Restaurants" }),
    ).toBeInTheDocument();
  });
});
