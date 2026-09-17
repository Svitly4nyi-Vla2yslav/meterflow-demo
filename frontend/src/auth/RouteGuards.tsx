import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '../components/AsyncState';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth(); const location = useLocation();
  if (loading) return <div className="auth-route-loading"><LoadingState label="Sitzung wird geladen …" /></div>;
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export function PublicOnlyRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-route-loading"><LoadingState label="Sitzung wird geladen …" /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}
