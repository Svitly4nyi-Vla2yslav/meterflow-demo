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

/**
 * Зберігає поточного користувача, відновлює сесію з access token і надає
 * login/register/logout дочірньому дереву. Побічні ефекти — API-запити,
 * запис або очищення localStorage та реєстрація глобального 401-handler.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    // Відновлює профіль лише за наявності token; невалідну сесію очищає,
    // а loading завершує незалежно від результату запиту.
    const restore = async () => { if (!getAccessToken()) return setLoading(false); try { setUser(await api.getMe()); } catch { clearAccessToken(); setUser(null); } finally { setLoading(false); } };
    void restore(); return () => setUnauthorizedHandler(null);
  }, []);
  // Мемоізований контракт виконує auth-запити, зберігає отриманий token
  // і синхронізує user; logout працює локально та не викликає API.
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    login: async (data) => { const session = await api.login(data); saveAccessToken(session.accessToken); setUser(session.user); },
    register: async (data) => { const session = await api.register(data); saveAccessToken(session.accessToken); setUser(session.user); },
    logout: () => { clearAccessToken(); setUser(null); },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Повертає поточний AuthContext або кидає помилку поза AuthProvider,
 * щоб споживач не працював із неініціалізованою сесією.
 */
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }
