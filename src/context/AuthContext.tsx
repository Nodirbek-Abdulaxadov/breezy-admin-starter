import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError, isMockMode } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = "auth.accessToken";
const USER_KEY = "auth.user";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

const readStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"));
    }
  }, []);

  // Initial restore + background refresh
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      const storedToken = readStoredToken();
      const storedUser = readStoredUser();

      if (storedToken && storedUser) {
        if (!cancelled) {
          setUser(storedUser);
        }

        // Background refresh
        try {
          if (!isMockMode()) {
            const fresh = await api.get<AuthUser>("/auth/me");
            if (!cancelled) {
              setUser(fresh);
              localStorage.setItem(USER_KEY, JSON.stringify(fresh));
            }
          }
        } catch (err) {
          if (!cancelled) {
            const status = err instanceof ApiError ? err.status : undefined;
            if (status === 401 || status === undefined) {
              // silent logout
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
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

  // Listen for unauthorized events
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
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    const result = await api.post<{
      accessToken: string;
      user: AuthUser;
    }>("/auth/login", { email, password });

    localStorage.setItem(TOKEN_KEY, result.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider };
export default AuthProvider;
