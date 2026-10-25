import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '../components/AsyncState';
import { useAuth } from './AuthContext';

/**
 * Поки сесія відновлюється, показує спільний loading-стан; авторизованому
 * користувачу повертає children, а гостя переводить на login зі шляхом повернення.
 */
export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth(); const location = useLocation();
  if (loading) return <div className="auth-route-loading"><LoadingState label="Sitzung wird geladen …" /></div>;
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

/**
 * Обмежує login/register для вже авторизованих користувачів.
 * Після завантаження сесії користувач переходить на dashboard, а гість бачить children.
 */
export function PublicOnlyRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-route-loading"><LoadingState label="Sitzung wird geladen …" /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}
