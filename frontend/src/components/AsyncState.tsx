import { AlertCircle, Inbox } from 'lucide-react';

/**
 * Показує спільний індикатор завантаження з необов'язковим текстом.
 * Компонент не має стану й повертає лише презентаційну картку.
 */
export function LoadingState({ label = 'Daten werden geladen …' }: { label?: string }) {
  return <div className="state-card"><span className="spinner" /><p>{label}</p></div>;
}

/**
 * Показує повідомлення про помилку та, якщо передано `onRetry`, кнопку повторної спроби.
 * Натискання кнопки викликає callback батьківського компонента; без нього кнопка не рендериться.
 */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="state-card state-card--error"><AlertCircle /><div><strong>Daten konnten nicht geladen werden</strong><p>{message}</p>{onRetry && <button className="button button--secondary" onClick={onRetry}>Erneut versuchen</button>}</div></div>;
}

/**
 * Показує порожній стан із переданим повідомленням, коли запит успішний, але даних немає.
 * Компонент не виконує запитів і не змінює зовнішній стан.
 */
export function EmptyState({ message }: { message: string }) {
  return <div className="state-card"><Inbox /><p>{message}</p></div>;
}
