// pattern: Imperative Shell

import { useEffect, useState, type ReactNode } from "react";
import { getCsrfToken, setCsrfToken } from "./api-fetch";
import { AuthContext } from "./use-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshCsrf() {
    const res = await fetch("/api/auth/antiforgery/token", {
      credentials: "include",
    });
    if (res.ok) {
      const data = (await res.json()) as { requestToken: string };
      setCsrfToken(data.requestToken);
    }
  }

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { id: string; email: string };
        setUser(data);
        return;
      }
    } catch {
      // Not authenticated
    }
    setUser(null);
  }

  useEffect(() => {
    async function init() {
      await refreshCsrf();
      await fetchUser();
      setIsLoading(false);
    }
    init();
  }, []);

  async function login(email: string, password: string) {
    await refreshCsrf();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Login failed");
    }

    const data = (await res.json()) as { id: string; email: string };
    setUser(data);
    await refreshCsrf();
  }

  async function register(email: string, password: string) {
    await refreshCsrf();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Registration failed");
    }

    const data = (await res.json()) as { id: string; email: string };
    setUser(data);
    await refreshCsrf();
  }

  async function logout() {
    await refreshCsrf();
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "X-CSRF-TOKEN": getCsrfToken() },
      credentials: "include",
    });
    setUser(null);
    await refreshCsrf();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
