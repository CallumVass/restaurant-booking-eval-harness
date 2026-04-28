// pattern: Imperative Shell

import { useState } from "react";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

type Mode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      let ok: boolean;
      if (mode === "login") {
        ok = await login({ email, password });
      } else {
        ok = await register({ email, password, displayName });
      }

      if (ok) {
        setEmail("");
        setPassword("");
        setDisplayName("");
        onClose();
      } else {
        setError(
          mode === "login"
            ? "Invalid email or password."
            : "Registration failed. The email may already be in use.",
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-1 text-2xl font-semibold tracking-tight">
          {mode === "login" ? "Sign in" : "Create an account"}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          {mode === "login"
            ? "Welcome back. Sign in to book a table."
            : "Register to start reserving tables."}
        </p>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <FieldGroup>
            {mode === "register" && (
              <Field>
                <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required
                  minLength={1}
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="auth-email">Email</FieldLabel>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="auth-password">Password</FieldLabel>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
              />
            </Field>
          </FieldGroup>

          {error && (
            <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
              {error}
            </p>
          )}

          <Button disabled={loading} type="submit">
            {loading ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={switchMode}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
