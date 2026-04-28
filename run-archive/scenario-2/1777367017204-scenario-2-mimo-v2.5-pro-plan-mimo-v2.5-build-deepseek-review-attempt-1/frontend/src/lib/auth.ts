// pattern: Imperative Shell

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  getCsrfToken,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  type LoginRequest,
  type RegisterRequest,
  type UserInfo,
} from "../generated/booking-client";

let csrfToken: string | null = null;

export async function fetchCsrfToken(): Promise<string> {
  const response = await getCsrfToken();
  if (response.status === 200 && "token" in response.data) {
    csrfToken = response.data.token;
    return csrfToken;
  }
  throw new Error("Failed to fetch CSRF token");
}

export function getCsrfTokenSync(): string | null {
  return csrfToken;
}

export function csrfHeaders(): Record<string, string> {
  return csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {};
}

export function useAuth() {
  const queryClient = useQueryClient();

  const authQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await getCurrentUser();
        if (response.status === 200 && "email" in response.data) {
          return response.data as UserInfo;
        }
        return null;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 30_000,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      await fetchCsrfToken();
      const response = await apiLogin(credentials, {
        headers: csrfHeaders(),
        credentials: "include",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterRequest) => {
      await fetchCsrfToken();
      const response = await apiRegister(credentials, {
        headers: csrfHeaders(),
        credentials: "include",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetchCsrfToken();
      const response = await apiLogout({
        headers: csrfHeaders(),
        credentials: "include",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });

  return {
    user: authQuery.data,
    isLoading: authQuery.isLoading,
    isAuthenticated: !!authQuery.data,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
  };
}
