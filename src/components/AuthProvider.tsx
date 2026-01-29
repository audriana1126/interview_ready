import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User, LoginInput } from "../services/auth";
import { login as loginService } from "../services/auth";

type AuthContextValue = {
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isHydrating: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = "ir_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
        try {
        const saved = JSON.parse(raw) as User;
        setUser(saved);
        } catch {
        localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  setIsHydrating(false);
  }, []);

  async function login(input: LoginInput) {
    setIsLoading(true);
    setError(null);
    try {
      const u = await loginService(input);
      setUser(u);
      // ✅ SAVE USER
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
      setUser(null);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setUser(null);
    // ✅ CLEAR USER
    localStorage.removeItem(AUTH_USER_KEY);
  }

  const value = useMemo(
    () => ({ user, login, logout, isLoading, error, isHydrating }),
    [user, isLoading, error, isHydrating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}



