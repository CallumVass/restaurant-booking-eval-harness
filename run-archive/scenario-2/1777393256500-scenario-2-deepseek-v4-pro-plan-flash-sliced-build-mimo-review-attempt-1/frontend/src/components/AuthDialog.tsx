// pattern: Imperative Shell

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldLabel } from "./ui/field";
import { useAuth } from "../lib/auth-context";
import { cn } from "../lib/utils";

type AuthMode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const prevAuthRef = useRef(auth.isAuthenticated);

  function resetForm() {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setLocalError(null);
  }

  useEffect(() => {
    if (auth.isAuthenticated && !prevAuthRef.current) {
      onOpenChange(false);
      resetForm();
    }
    prevAuthRef.current = auth.isAuthenticated;
  }, [auth.isAuthenticated, onOpenChange]);

  function handleModeChange(newMode: AuthMode) {
    setMode(newMode);
    resetForm();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (mode === "register") {
      if (!name.trim()) {
        setLocalError("Name is required.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setLocalError("Password must be at least 8 characters.");
        return;
      }
      auth.register({ name: name.trim(), email: email.trim(), password });
    } else {
      if (!email.trim()) {
        setLocalError("Email is required.");
        return;
      }
      auth.login({ email: email.trim(), password });
    }
  }

  const pending = mode === "login" ? auth.loginPending : auth.registerPending;
  const error =
    localError || (mode === "login" ? auth.loginError : auth.registerError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {mode === "login" ? "Sign in" : "Create account"}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <button
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              mode === "login"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => handleModeChange("login")}
          >
            Sign in
          </button>
          <button
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              mode === "register"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => handleModeChange("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <Field>
              <FieldLabel htmlFor="auth-name">Name</FieldLabel>
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Avery Stone"
                required
                autoComplete="name"
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
              placeholder="avery@example.com"
              required
              autoComplete={mode === "login" ? "email" : "username"}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="auth-password">Password</FieldLabel>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </Field>
          {mode === "register" && (
            <Field>
              <FieldLabel htmlFor="auth-confirm">Confirm password</FieldLabel>
              <Input
                id="auth-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </Field>
          )}
          {error ? (
            <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
              {error}
            </p>
          ) : null}
          <Button disabled={pending} type="submit">
            {pending ? <Loader2 className="animate-spin" /> : null}
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </div>
    </Dialog>
  );
}
