import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AuthHeader } from "../components/auth/AuthHeader";

afterEach(cleanup);

describe("AuthHeader", () => {
  it("shows sign in button when unauthenticated", () => {
    render(
      <AuthHeader
        email=""
        onLogout={vi.fn()}
        onShowLogin={vi.fn()}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("shows user email and logout when authenticated", () => {
    render(
      <AuthHeader
        email="demo@example.com"
        onLogout={vi.fn()}
        onShowLogin={vi.fn()}
        isAuthenticated={true}
      />,
    );

    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("calls onShowLogin when sign in is clicked", async () => {
    const onShowLogin = vi.fn();
    render(
      <AuthHeader
        email=""
        onLogout={vi.fn()}
        onShowLogin={onShowLogin}
        isAuthenticated={false}
      />,
    );

    await screen.getByText("Sign in").click();
    expect(onShowLogin).toHaveBeenCalledOnce();
  });

  it("calls onLogout when logout is clicked", async () => {
    const onLogout = vi.fn();
    render(
      <AuthHeader
        email="demo@example.com"
        onLogout={onLogout}
        onShowLogin={vi.fn()}
        isAuthenticated={true}
      />,
    );

    await screen.getByText("Log out").click();
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
