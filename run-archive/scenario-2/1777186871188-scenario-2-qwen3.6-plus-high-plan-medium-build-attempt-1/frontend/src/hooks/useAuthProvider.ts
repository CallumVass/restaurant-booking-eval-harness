// pattern: Imperative Shell

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  type UserInfo,
  type RegisterRequest,
} from "../generated/booking-client";
import { initCsrfToken } from "../api/custom-fetch";

export function useAuthProvider() {
  const queryClient = useQueryClient();
  const [csrfReady, setCsrfReady] = useState(false);

  useEffect(() => {
    initCsrfToken().then(() => setCsrfReady(true));
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.status === 200
        ? (response.data as UserInfo | null)
        : null;
    },
    enabled: csrfReady,
    staleTime: 30_000,
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await loginUser({ email, password });
      if (response.status !== 200) {
        throw new Error(
          (response.data as { message?: string }).message ?? "Login failed",
        );
      }
      return response.data as UserInfo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (req: RegisterRequest) => {
      const response = await registerUser(req);
      if (response.status !== 200) {
        throw new Error(
          (response.data as { message?: string }).message ??
            "Registration failed",
        );
      }
      return response.data as UserInfo;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.clear();
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginMutation.mutateAsync({ email, password });
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Login failed",
        };
      }
    },
    [loginMutation],
  );

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        await registerMutation.mutateAsync({ email, password, displayName });
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Registration failed",
        };
      }
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return {
    user: (user ?? null) as {
      id: string;
      email: string;
      displayName?: string;
    } | null,
    isLoading,
    login,
    register,
    logout,
  };
}
