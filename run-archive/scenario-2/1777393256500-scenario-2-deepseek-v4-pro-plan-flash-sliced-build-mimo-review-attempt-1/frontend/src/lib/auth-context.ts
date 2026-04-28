// pattern: Imperative Shell

import { createContext, useContext } from "react";
import type {
  UserResponse,
  LoginRequest,
  RegisterRequest,
} from "../generated/booking-client";

export interface AuthContextValue {
  user: UserResponse | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (data: LoginRequest) => void;
  register: (data: RegisterRequest) => void;
  logout: () => void;
  loginError: string | null;
  registerError: string | null;
  loginPending: boolean;
  registerPending: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
