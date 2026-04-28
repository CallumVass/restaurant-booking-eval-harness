// pattern: Imperative Shell
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserInfo } from "../generated/booking-hooks";

interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  csrfToken: string;
  csrfHeaderName: string;
  login: (email: string, password: string) => Promise<UserInfo>;
  register: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  refreshCsrf: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [csrfHeaderName, setCsrfHeaderName] = useState("X-CSRF-TOKEN");

  const refreshCsrf = useCallback(async () => {
    const response = await fetch("/api/antiforgery/token", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setCsrfToken(data.token);
      setCsrfHeaderName(data.headerName ?? "X-CSRF-TOKEN");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await fetch("/api/auth/me", { credentials: "include" });
    if (response.ok) {
      setUser(await response.json());
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    async function init() {
      await Promise.all([refreshCsrf(), refreshUser()]);
      setIsLoading(false);
    }
    init();
  }, [refreshCsrf, refreshUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<UserInfo> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          [csrfHeaderName]: csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({ message: "Login failed" }));
        throw new Error(err.message ?? "Login failed");
      }
      const userInfo: UserInfo = await response.json();
      setUser(userInfo);
      await refreshCsrf();
      return userInfo;
    },
    [csrfToken, csrfHeaderName, refreshCsrf],
  );

  const register = useCallback(
    async (email: string, password: string): Promise<UserInfo> => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          [csrfHeaderName]: csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({ message: "Registration failed" }));
        throw new Error(err.message ?? "Registration failed");
      }
      const userInfo: UserInfo = await response.json();
      setUser(userInfo);
      await refreshCsrf();
      return userInfo;
    },
    [csrfToken, csrfHeaderName, refreshCsrf],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        [csrfHeaderName]: csrfToken,
      },
      body: "{}",
    });
    setUser(null);
    await refreshCsrf();
  }, [csrfToken, csrfHeaderName, refreshCsrf]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      csrfToken,
      csrfHeaderName,
      login,
      register,
      logout,
      refreshCsrf,
    }),
    [
      user,
      isLoading,
      csrfToken,
      csrfHeaderName,
      login,
      register,
      logout,
      refreshCsrf,
    ],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
