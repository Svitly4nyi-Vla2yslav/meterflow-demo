import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { api } from '../services/api';
import { clearAccessToken, getAccessToken, saveAccessToken, setUnauthorizedHandler } from '../services/auth-token';
import type { LoginInput, RegisterInput, User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    const restore = async () => { if (!getAccessToken()) return setLoading(false); try { setUser(await api.getMe()); } catch { clearAccessToken(); setUser(null); } finally { setLoading(false); } };
    void restore(); return () => setUnauthorizedHandler(null);
  }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    login: async (data) => { const session = await api.login(data); saveAccessToken(session.accessToken); setUser(session.user); },
    register: async (data) => { const session = await api.register(data); saveAccessToken(session.accessToken); setUser(session.user); },
    logout: () => { clearAccessToken(); setUser(null); },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }
