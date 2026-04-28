// pattern: Imperative Shell

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getCsrfToken,
  login as apiLogin,
  logout as apiLogout,
  me as apiMe,
  register as apiRegister,
  type GetCsrfToken200,
  type LoginRequest,
  type RegisterRequest,
  type UserInfo,
} from "../generated/booking-client";

type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: UserInfo }
  | { status: "unauthenticated" };

interface AuthContextValue {
  auth: AuthState;
  csrfToken: string | null;
  login: (data: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const csrfRes = await getCsrfToken();
        if (csrfRes.status === 200) {
          const token = (csrfRes.data as GetCsrfToken200).token;
          if (!cancelled) setCsrfToken(token);
        }
      } catch {
        // CSRF token fetch failed; continue without it
      }

      try {
        const meRes = await apiMe();
        if (!cancelled) {
          if (meRes.status === 200) {
            setAuth({ status: "authenticated", user: meRes.data as UserInfo });
          } else {
            setAuth({ status: "unauthenticated" });
          }
        }
      } catch {
        if (!cancelled) setAuth({ status: "unauthenticated" });
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const csrfHeaders = useMemo(() => {
    return csrfToken
      ? ({ "X-CSRF-TOKEN": csrfToken } as Record<string, string>)
      : ({} as Record<string, string>);
  }, [csrfToken]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const res = await apiLogin(data, { headers: csrfHeaders });
      if (res.status === 200) {
        setAuth({ status: "authenticated", user: res.data as UserInfo });
        queryClient.invalidateQueries({ queryKey: ["/api/bookings/mine"] });
        return true;
      }
      return false;
    },
    [csrfHeaders, queryClient],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const res = await apiRegister(data, { headers: csrfHeaders });
      if (res.status === 200) {
        setAuth({ status: "authenticated", user: res.data as UserInfo });
        queryClient.invalidateQueries({ queryKey: ["/api/bookings/mine"] });
        return true;
      }
      return false;
    },
    [csrfHeaders, queryClient],
  );

  const logout = useCallback(async () => {
    await apiLogout({ headers: csrfHeaders });
    setAuth({ status: "unauthenticated" });
    queryClient.invalidateQueries({ queryKey: ["/api/bookings/mine"] });
  }, [csrfHeaders, queryClient]);

  const value = useMemo(
    () => ({ auth, csrfToken, login, register, logout }),
    [auth, csrfToken, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCsrfHeaders() {
  const { csrfToken } = useAuth();
  return csrfToken
    ? ({ "X-CSRF-TOKEN": csrfToken } as Record<string, string>)
    : ({} as Record<string, string>);
}
