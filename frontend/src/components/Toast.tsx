import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

type ToastTone = 'success' | 'error';
interface ToastMessage { id: number; message: string; tone: ToastTone }
interface ToastContextValue { showToast: (message: string, tone?: ToastTone) => void }
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const dismiss = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return <ToastContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div className={`toast toast--${toast.tone}`} key={toast.id}>{toast.tone === 'success' ? <CheckCircle2 /> : <AlertCircle />}<span>{toast.message}</span><button onClick={() => dismiss(toast.id)} aria-label="Meldung schließen"><X /></button></div>)}</div></ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
