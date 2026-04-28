import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginDialog } from "../components/auth/LoginDialog";

afterEach(cleanup);

describe("LoginDialog", () => {
  it("renders email and password fields in login mode", () => {
    render(
      <LoginDialog onLogin={vi.fn()} onRegister={vi.fn()} onClose={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows error message for invalid credentials", async () => {
    const onLogin = vi.fn().mockRejectedValue(new Error("Invalid credentials"));
    render(
      <LoginDialog onLogin={onLogin} onRegister={vi.fn()} onClose={vi.fn()} />,
    );

    await userEvent.type(screen.getByLabelText("Email"), "bad@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("calls onClose after successful login", async () => {
    const onClose = vi.fn();
    const onLogin = vi.fn().mockResolvedValue(undefined);
    render(
      <LoginDialog onLogin={onLogin} onRegister={vi.fn()} onClose={onClose} />,
    );

    await userEvent.type(screen.getByLabelText("Email"), "demo@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("toggles between login and register modes", async () => {
    render(
      <LoginDialog onLogin={vi.fn()} onRegister={vi.fn()} onClose={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText(/No account/));
    expect(
      screen.getByRole("heading", { name: "Create account" }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText(/Already have an account/));
    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
  });
});
