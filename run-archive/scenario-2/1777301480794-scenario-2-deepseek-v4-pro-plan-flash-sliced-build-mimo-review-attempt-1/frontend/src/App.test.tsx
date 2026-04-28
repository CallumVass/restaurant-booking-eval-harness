import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { renderWithProviders } from "./test/test-utils";

describe("App", () => {
  it("renders restaurant list", async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText("Ember Table")).toBeInTheDocument();
    });

    expect(screen.getByText("Luna Verde")).toBeInTheDocument();
  });

  it("renders sign-in buttons when unauthenticated", async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
      expect(signInButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows auth dialog when clicking sign in", async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText("Sign in to book a table")).toBeInTheDocument();
    });

    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    await userEvent.click(signInButtons[0]);

    expect(
      screen.getByText("Welcome back. Sign in to book a table."),
    ).toBeInTheDocument();
  });

  it("shows sign-in prompt for booking form when unauthenticated", async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText("Sign in to book a table")).toBeInTheDocument();
    });
  });
});
