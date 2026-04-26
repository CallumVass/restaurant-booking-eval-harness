// pattern: Imperative Shell

import { type ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext.tsx";

type AuthContextType = {
  user: { id: string; email: string; displayName?: string } | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

export function AuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AuthContextType;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
