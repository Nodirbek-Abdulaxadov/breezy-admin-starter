import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError, isMockMode } from "@/lib/api";
import {
  AuthContext,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  type AuthContextValue,
  type AuthUser,
} from "@/context/auth-context";

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

const readStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      const storedToken = readStoredToken();
      const storedUser = readStoredUser();

      if (storedToken && storedUser) {
        if (!cancelled) {
          setUser(storedUser);
        }

        try {
          if (!isMockMode()) {
            const fresh = await api.get<AuthUser>("/auth/me");
            if (!cancelled) {
              setUser(fresh);
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fresh));
            }
          }
        } catch (err) {
          if (!cancelled) {
            const status = err instanceof ApiError ? err.status : undefined;
            if (status === 401 || status === undefined) {
              localStorage.removeItem(AUTH_TOKEN_KEY);
              localStorage.removeItem(AUTH_USER_KEY);
              setUser(null);
            }
          }
        }
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      logout();
    };
    window.addEventListener("auth:unauthorized", handler);
    return () => {
      window.removeEventListener("auth:unauthorized", handler);
    };
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const token = `mock-token-${Date.now()}`;
      const mockUser: AuthUser = {
        id: "u_1",
        email,
        name: email.split("@")[0],
      };
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    const result = await api.post<{
      accessToken: string;
      user: AuthUser;
    }>("/auth/login", { email, password });

    localStorage.setItem(AUTH_TOKEN_KEY, result.accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthProvider;
