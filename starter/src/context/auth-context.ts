import { createContext } from "react";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AUTH_TOKEN_KEY = "auth.token";
export const AUTH_USER_KEY = "auth.user";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
