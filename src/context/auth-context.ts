import { createContext } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  avatarUrl?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AUTH_TOKEN_KEY = "auth.accessToken";
export const AUTH_USER_KEY = "auth.user";
