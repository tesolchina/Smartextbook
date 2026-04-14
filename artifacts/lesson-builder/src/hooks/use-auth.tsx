import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ ok: boolean; needsVerification?: boolean; useCode?: boolean; error?: string }>;
  sendCode: (email: string) => Promise<{ ok: boolean; emailSent?: boolean; needsVerification?: boolean; notFound?: boolean; error?: string }>;
  register: (email: string, displayName: string, password?: string) => Promise<{ ok: boolean; emailSent?: boolean; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ ok: boolean; error?: string }>;
  resendOtp: (email: string, purpose?: "verify" | "login") => Promise<{ emailSent?: boolean }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { user: AuthUser };
        setState({ user: data.user, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json() as { ok?: boolean; user?: AuthUser; needsVerification?: boolean; useCode?: boolean; error?: string };
    if (res.ok && data.user) {
      setState({ user: data.user, loading: false });
      return { ok: true };
    }
    return { ok: false, needsVerification: data.needsVerification, useCode: data.useCode, error: data.error };
  }, []);

  const sendCode = useCallback(async (email: string) => {
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json() as { ok?: boolean; emailSent?: boolean; needsVerification?: boolean; notFound?: boolean; error?: string };
    return {
      ok: res.ok,
      emailSent: data.emailSent,
      needsVerification: data.needsVerification,
      notFound: data.notFound,
      error: data.error,
    };
  }, []);

  const register = useCallback(async (email: string, displayName: string, password?: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, displayName, password }),
    });
    const data = await res.json() as { ok?: boolean; emailSent?: boolean; error?: string };
    if (res.ok) return { ok: true, emailSent: data.emailSent };
    return { ok: false, error: data.error };
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json() as { ok?: boolean; user?: AuthUser; error?: string };
    if (res.ok && data.user) {
      setState({ user: data.user, loading: false });
      return { ok: true };
    }
    return { ok: false, error: data.error };
  }, []);

  const resendOtp = useCallback(async (email: string, purpose: "verify" | "login" = "verify") => {
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose }),
    });
    const data = await res.json() as { emailSent?: boolean };
    return { emailSent: data.emailSent };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setState({ user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, sendCode, register, verifyOtp, resendOtp, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
