import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AuthContext,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  type AuthContextValue,
  type AuthUser,
} from "./auth-context";

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const stored = readStoredUser();
    if (token && stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 300));
    if (!email || !password) throw new Error("Email yoki parol noto'g'ri");
    const mock: AuthUser = {
      id: "u_1",
      email,
      name: email.split("@")[0].replace(/\./g, " "),
    };
    localStorage.setItem(AUTH_TOKEN_KEY, `mock-${Date.now()}`);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mock));
    setUser(mock);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
