import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthDialog } from "../components/AuthDialog";
import type { AuthContextValue } from "../lib/auth-context";

const mockLogin = vi.fn();
const mockRegister = vi.fn();

function createMockAuth(
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue {
  return {
    user: null,
    isAuthenticated: false,
    authLoading: false,
    login: mockLogin,
    register: mockRegister,
    logout: vi.fn(),
    loginError: null,
    registerError: null,
    loginPending: false,
    registerPending: false,
    ...overrides,
  };
}

vi.mock("../lib/auth-context", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../lib/auth-context";

describe("AuthDialog", () => {
  const onOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(createMockAuth());
  });

  it("renders login mode by default", () => {
    render(<AuthDialog open={true} onOpenChange={onOpenChange} />);
    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("switches to register tab and shows name + confirm fields", async () => {
    const user = userEvent.setup();
    render(<AuthDialog open={true} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(
      screen.getByRole("heading", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("calls login with email + password on submit", async () => {
    const user = userEvent.setup();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(createMockAuth());

    render(<AuthDialog open={true} onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText(/email/i), "alice@test.com");
    // Submit form by pressing Enter in password field
    await user.type(screen.getByLabelText(/password/i), "secret123{Enter}");

    expect(mockLogin).toHaveBeenCalledWith({
      email: "alice@test.com",
      password: "secret123",
    });
  });

  it("shows validation error when passwords do not match in register mode", async () => {
    const user = userEvent.setup();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(createMockAuth());

    render(<AuthDialog open={true} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: /register/i }));

    await user.type(screen.getByLabelText(/name/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@test.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret123");
    await user.type(screen.getByLabelText(/confirm password/i), "different");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("displays login API error message", () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockAuth({ loginError: "Invalid credentials." }),
    );

    render(<AuthDialog open={true} onOpenChange={onOpenChange} />);

    expect(screen.getByText("Invalid credentials.")).toBeInTheDocument();
  });

  it("displays register API error message in register mode", async () => {
    const user = userEvent.setup();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockAuth({ registerError: "Email already registered." }),
    );

    render(<AuthDialog open={true} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText("Email already registered.")).toBeInTheDocument();
  });

  it("disables submit button during login pending", () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(
      createMockAuth({ loginPending: true }),
    );

    const { container } = render(
      <AuthDialog open={true} onOpenChange={onOpenChange} />,
    );
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
  });

  it("does not render when closed", () => {
    render(<AuthDialog open={false} onOpenChange={onOpenChange} />);
    expect(
      screen.queryByRole("heading", { name: /sign in/i }),
    ).not.toBeInTheDocument();
  });
});
