// pattern: Imperative Shell

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setCsrfToken } from "./api";
import {
  useAuthMe,
  useAuthLogin,
  useAuthRegister,
  useAuthLogout,
  useAuthCsrf,
  getAuthCsrfQueryKey,
  getAuthMeQueryKey,
  type ErrorResponse,
  type LoginRequest,
  type RegisterRequest,
} from "../generated/booking-client";
import { AuthContext } from "./auth-context";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const csrfQuery = useAuthCsrf({
    query: {
      staleTime: 5 * 60 * 1000,
    },
  });

  useEffect(() => {
    const token = csrfQuery.data?.data?.csrfToken;
    if (token) {
      setCsrfToken(token);
    }
  }, [csrfQuery.data]);

  const meQuery = useAuthMe({ query: { retry: false } });
  const user = meQuery.data?.status === 200 ? meQuery.data.data : null;
  const authLoading = meQuery.isLoading && !meQuery.data;

  const loginMutation = useAuthLogin({
    mutation: {
      onSuccess: async (response) => {
        if (response.status === 200) {
          setLoginError(null);
          queryClient.setQueryData(getAuthMeQueryKey(), response);
          await queryClient.invalidateQueries({
            queryKey: getAuthCsrfQueryKey(),
          });
        } else {
          setLoginError((response.data as ErrorResponse).message);
        }
      },
      onError: () => setLoginError("Network error. Please try again."),
    },
  });

  const registerMutation = useAuthRegister({
    mutation: {
      onSuccess: async (response) => {
        if (response.status === 201) {
          setRegisterError(null);
          queryClient.setQueryData(getAuthMeQueryKey(), response);
          await queryClient.invalidateQueries({
            queryKey: getAuthCsrfQueryKey(),
          });
        } else {
          setRegisterError((response.data as ErrorResponse).message);
        }
      },
      onError: () => setRegisterError("Network error. Please try again."),
    },
  });

  const logoutMutation = useAuthLogout({
    mutation: {
      onSuccess: () => {
        setCsrfToken(null);
        queryClient.clear();
      },
    },
  });

  function login(data: LoginRequest) {
    setLoginError(null);
    loginMutation.mutate({ data });
  }

  function register(data: RegisterRequest) {
    setRegisterError(null);
    registerMutation.mutate({ data });
  }

  function logout() {
    logoutMutation.mutate();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authLoading,
        login,
        register,
        logout,
        loginError,
        registerError,
        loginPending: loginMutation.isPending,
        registerPending: registerMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
