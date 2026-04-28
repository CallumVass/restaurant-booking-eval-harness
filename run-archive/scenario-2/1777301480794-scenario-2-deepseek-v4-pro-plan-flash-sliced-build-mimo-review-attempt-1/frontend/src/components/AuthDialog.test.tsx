import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthDialog } from "./AuthDialog";
import { renderWithProviders } from "../test/test-utils";

describe("AuthDialog", () => {
  it("renders login form by default", () => {
    renderWithProviders(<AuthDialog open={true} onClose={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("toggles between login and register forms", async () => {
    renderWithProviders(<AuthDialog open={true} onClose={vi.fn()} />);

    const registerLink = screen.getByText("Register");
    await userEvent.click(registerLink);

    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();

    const signInLink = screen.getByText("Sign in");
    await userEvent.click(signInLink);

    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("returns null when closed", () => {
    const { container } = renderWithProviders(
      <AuthDialog open={false} onClose={vi.fn()} />,
    );

    expect(container.innerHTML).toBe("");
  });
});
