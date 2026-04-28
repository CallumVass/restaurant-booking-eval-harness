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
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type AuthPageProps = {
  onLogin: (email: string, password: string) => Promise<unknown>;
  onRegister: (email: string, password: string) => Promise<unknown>;
  isLoginPending: boolean;
  isRegisterPending: boolean;
  loginError: string | null;
  registerError: string | null;
};

export function AuthPage({
  onLogin,
  onRegister,
  isLoginPending,
  isRegisterPending,
  loginError,
  registerError,
}: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isPending = mode === "login" ? isLoginPending : isRegisterPending;
  const error = mode === "login" ? loginError : registerError;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "login") {
      await onLogin(email, password);
    } else {
      await onRegister(email, password);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Sign in" : "Create account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to make a booking."
              : "Register to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                <Input
                  id="auth-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Field>
            </FieldGroup>
            {error ? (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : null}
              {mode === "login" ? "Sign in" : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
          <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium">Demo account</p>
            <p>
              Email: <span className="font-mono">demo@example.com</span>
            </p>
            <p>
              Password: <span className="font-mono">Demo123!</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
