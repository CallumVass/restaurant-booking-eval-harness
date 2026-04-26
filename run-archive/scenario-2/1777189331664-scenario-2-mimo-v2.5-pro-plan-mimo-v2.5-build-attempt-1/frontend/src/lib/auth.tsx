// pattern: Imperative Shell

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCsrfToken,
  type AuthResponse,
} from "../generated/booking-client";

interface AuthState {
  user: AuthResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await getCsrfToken({ credentials: "include" });
    if (res.status === 200 && "token" in res.data) {
      return res.data.token;
    }
  } catch {
    // CSRF token fetch failed
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function checkAuth() {
      try {
        const token = await fetchCsrfToken();
        if (!cancelled) setCsrfToken(token);

        const res = await getCurrentUser({ credentials: "include" });
        if (!cancelled) {
          if (res.status === 200 && "email" in res.data) {
            setUser(res.data);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setError(null);
      try {
        const token = csrfToken ?? (await fetchCsrfToken());
        const res = await apiLogin(
          { email, password },
          {
            credentials: "include",
            headers: token ? { "X-CSRF-TOKEN": token } : {},
          },
        );
        if (res.status === 200 && "email" in res.data) {
          setUser(res.data);
          return true;
        }
        setError("Invalid email or password.");
        return false;
      } catch {
        setError("Login failed. Please try again.");
        return false;
      }
    },
    [csrfToken],
  );

  const register = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setError(null);
      try {
        const token = csrfToken ?? (await fetchCsrfToken());
        const res = await apiRegister(
          { email, password },
          {
            credentials: "include",
            headers: token ? { "X-CSRF-TOKEN": token } : {},
          },
        );
        if (res.status === 200 && "email" in res.data) {
          setUser(res.data);
          return true;
        }
        if (res.status === 400 && "message" in res.data) {
          setError(res.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
        return false;
      } catch {
        setError("Registration failed. Please try again.");
        return false;
      }
    },
    [csrfToken],
  );

  const logout = useCallback(async () => {
    try {
      const token = csrfToken ?? (await fetchCsrfToken());
      await apiLogout({
        credentials: "include",
        headers: token ? { "X-CSRF-TOKEN": token } : {},
      });
    } finally {
      setUser(null);
      setCsrfToken(null);
    }
  }, [csrfToken]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({ user, isLoading, error, login, register, logout, clearError }),
    [user, isLoading, error, login, register, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
