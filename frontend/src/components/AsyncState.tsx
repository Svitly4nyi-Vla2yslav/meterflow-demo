import { AlertCircle, Inbox } from 'lucide-react';

export function LoadingState({ label = 'Daten werden geladen …' }: { label?: string }) {
  return <div className="state-card"><span className="spinner" /><p>{label}</p></div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="state-card state-card--error"><AlertCircle /><div><strong>Daten konnten nicht geladen werden</strong><p>{message}</p>{onRetry && <button className="button button--secondary" onClick={onRetry}>Erneut versuchen</button>}</div></div>;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="state-card"><Inbox /><p>{message}</p></div>;
}
