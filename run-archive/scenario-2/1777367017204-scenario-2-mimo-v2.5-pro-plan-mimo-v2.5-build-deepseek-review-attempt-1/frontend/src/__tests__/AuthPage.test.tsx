// pattern: Imperative Shell

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthPage } from "../components/AuthPage";

describe("AuthPage", () => {
  const defaultProps = {
    onLogin: vi.fn().mockResolvedValue(undefined),
    onRegister: vi.fn().mockResolvedValue(undefined),
    isLoginPending: false,
    isRegisterPending: false,
    loginError: null,
    registerError: null,
  };

  it("renders login form by default", () => {
    render(<AuthPage {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("switches to register mode", async () => {
    const user = userEvent.setup();
    render(<AuthPage {...defaultProps} />);

    await user.click(screen.getByText("Register"));

    expect(
      screen.getByRole("heading", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("calls onLogin with credentials", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn().mockResolvedValue(undefined);
    render(<AuthPage {...defaultProps} onLogin={onLogin} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("displays login error", () => {
    render(<AuthPage {...defaultProps} loginError="Invalid credentials" />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("displays register error", async () => {
    const user = userEvent.setup();
    render(<AuthPage {...defaultProps} registerError="Email already taken" />);

    await user.click(screen.getByText("Register"));

    expect(screen.getByText("Email already taken")).toBeInTheDocument();
  });

  it("shows demo account info", () => {
    render(<AuthPage {...defaultProps} />);

    expect(screen.getByText("Demo account")).toBeInTheDocument();
    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
  });
});
