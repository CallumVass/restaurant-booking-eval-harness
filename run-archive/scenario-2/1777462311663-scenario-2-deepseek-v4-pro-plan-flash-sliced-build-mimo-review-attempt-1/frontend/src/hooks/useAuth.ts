// pattern: Imperative Shell

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAntiforgeryToken,
  type UserInfo,
  useGetAuthMe,
  useLogin,
  useLogout,
  useRegister,
} from "../generated/booking-client";

export function useAuth() {
  const queryClient = useQueryClient();
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    getAntiforgeryToken().then((res) => {
      if (res.status === 200) setCsrfToken(res.data.token);
    });
  }, []);

  const fetchOptions: RequestInit | undefined = useMemo(
    () =>
      csrfToken
        ? { headers: { "X-CSRF-TOKEN": csrfToken } as Record<string, string> }
        : undefined,
    [csrfToken],
  );

  const meQuery = useGetAuthMe();
  const loginMutation = useLogin({ fetch: fetchOptions });
  const registerMutation = useRegister({ fetch: fetchOptions });
  const logoutMutation = useLogout({ fetch: fetchOptions });

  const user: UserInfo | null = meQuery.data?.data ?? null;
  const isAuthenticated = user !== null;
  const isLoading = meQuery.isLoading;

  const login = useCallback(
    async (email: string, password: string) => {
      if (!csrfToken) throw new Error("CSRF token not loaded yet");
      const result = await loginMutation.mutateAsync({
        data: { email, password },
      });
      await meQuery.refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/mine"] });
      return result;
    },
    [csrfToken, loginMutation, meQuery, queryClient],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      if (!csrfToken) throw new Error("CSRF token not loaded yet");
      const result = await registerMutation.mutateAsync({
        data: { email, password },
      });
      await meQuery.refetch();
      return result;
    },
    [csrfToken, registerMutation, meQuery],
  );

  const logout = useCallback(async () => {
    if (!csrfToken) throw new Error("CSRF token not loaded yet");
    const result = await logoutMutation.mutateAsync(undefined);
    await meQuery.refetch();
    queryClient.invalidateQueries({ queryKey: ["/api/bookings/mine"] });
    return result;
  }, [csrfToken, logoutMutation, meQuery, queryClient]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    csrfToken,
  };
}
