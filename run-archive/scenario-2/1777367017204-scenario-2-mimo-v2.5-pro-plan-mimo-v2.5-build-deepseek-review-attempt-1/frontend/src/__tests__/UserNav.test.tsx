// pattern: Imperative Shell

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserNav } from "../components/UserNav";

describe("UserNav", () => {
  it("displays user email", () => {
    render(
      <UserNav email="test@example.com" onLogout={vi.fn()} isPending={false} />,
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("calls onLogout when sign out is clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const onLogout = vi.fn();
    render(
      <UserNav
        email="test@example.com"
        onLogout={onLogout}
        isPending={false}
      />,
    );

    await userEvent.click(screen.getByText("Sign out"));

    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("disables button when pending", () => {
    render(
      <UserNav email="test@example.com" onLogout={vi.fn()} isPending={true} />,
    );

    expect(screen.getByText("Sign out")).toBeDisabled();
  });
});
