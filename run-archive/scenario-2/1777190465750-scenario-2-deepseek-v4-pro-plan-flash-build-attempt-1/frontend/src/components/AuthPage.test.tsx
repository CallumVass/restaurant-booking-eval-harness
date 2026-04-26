import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AuthPage } from "./AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "../lib/use-auth";

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user: null,
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

describe("AuthPage", () => {
  it("renders login form by default", () => {
    renderWithProviders(<AuthPage />);

    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("switches to register mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthPage />);

    await user.click(screen.getByText("Register here"));
    expect(
      screen.getByRole("heading", { name: "Create account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });
});
