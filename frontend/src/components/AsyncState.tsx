import { AlertCircle, Inbox } from 'lucide-react';

/**
 * Показує спільний індикатор завантаження з необов’язковим `label` і німецьким текстом за замовчуванням.
 * Компонент не має стану, не запускає запитів і повертає лише презентаційну картку.
 */
export function LoadingState({ label = 'Daten werden geladen …' }: { label?: string }) {
  return <div className="state-card"><span className="spinner" /><p>{label}</p></div>;
}

/**
 * Показує переданий `message` під сталим заголовком помилки та, якщо є `onRetry`, кнопку повторної спроби.
 * Натискання лише викликає callback батьківського компонента; компонент сам не повторює запит і без callback не рендерить кнопку.
 */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="state-card state-card--error"><AlertCircle /><div><strong>Daten konnten nicht geladen werden</strong><p>{message}</p>{onRetry && <button className="button button--secondary" onClick={onRetry}>Erneut versuchen</button>}</div></div>;
}

/**
 * Показує порожній стан із переданим `message`, коли запит успішний, але даних немає.
 * Компонент не виконує запитів, не має дій і не змінює зовнішній стан.
 */
export function EmptyState({ message }: { message: string }) {
  return <div className="state-card"><Inbox /><p>{message}</p></div>;
}
