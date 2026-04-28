import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AuthGate } from "../components/auth/AuthGate";

afterEach(cleanup);

describe("AuthGate", () => {
  it("shows sign in to book message and button", () => {
    render(<AuthGate onSignIn={vi.fn()} />);

    expect(screen.getByText("Book a table")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to book a table at your favorite restaurant."),
    ).toBeInTheDocument();
    expect(screen.getByText("Sign in to book")).toBeInTheDocument();
  });

  it("calls onSignIn when button is clicked", async () => {
    const onSignIn = vi.fn();
    render(<AuthGate onSignIn={onSignIn} />);

    await screen.getByText("Sign in to book").click();
    expect(onSignIn).toHaveBeenCalledOnce();
  });
});
