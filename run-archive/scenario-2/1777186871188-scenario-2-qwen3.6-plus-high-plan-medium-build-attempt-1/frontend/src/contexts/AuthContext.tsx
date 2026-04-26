// pattern: Imperative Shell

import { createContext } from "react";

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

export const AuthContext = createContext<AuthContextType | null>(null);
