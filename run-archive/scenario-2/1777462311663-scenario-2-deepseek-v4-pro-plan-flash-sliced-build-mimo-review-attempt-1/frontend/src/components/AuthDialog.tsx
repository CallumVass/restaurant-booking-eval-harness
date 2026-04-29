// pattern: Imperative Shell

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
  error: string;
  clearError: () => void;
}

export function AuthDialog({
  open,
  onClose,
  onLogin,
  onRegister,
  error,
  clearError,
}: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    clearError();
    setPending(true);
    try {
      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onRegister(email, password);
      }
      setEmail("");
      setPassword("");
      onClose();
    } catch {
      // error is handled by parent
    } finally {
      setPending(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    clearError();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle>
            {mode === "login" ? "Sign in" : "Create account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to book tables and view your reservations."
              : "Register to start booking tables at your favourite restaurants."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field>
              <FieldLabel htmlFor="auth-email">Email</FieldLabel>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="auth-password">Password</FieldLabel>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </Field>
            {error ? (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button type="submit" disabled={pending || !email || !password}>
                {pending ? <Loader2 className="animate-spin" /> : null}
                {mode === "login" ? "Sign in" : "Create account"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={switchMode}
                disabled={pending}
              >
                {mode === "login"
                  ? "Need an account? Register"
                  : "Already registered? Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <div className="px-6 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
