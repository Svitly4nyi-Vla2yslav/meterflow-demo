import { X } from 'lucide-react';
import { useEffect, useRef, type PropsWithChildren } from 'react';

/**
 * Приймає заголовок, необов’язковий опис, вміст і `onClose`, повертаючи модальне вікно з dialog-семантикою.
 * Після монтування фокусує перший контрол, утримує Tab усередині, закриває через Escape або клік
 * на backdrop і повертає попередній фокус під час cleanup. Прокручування `body` компонент не блокує.
 */
export function Modal({ title, description, onClose, children }: PropsWithChildren<{ title: string; description?: string; onClose: () => void }>) {
  const modalRef = useRef<HTMLElement>(null);
  // Ефект запам’ятовує `activeElement`, фокусує перший контрол, підписується на клавіатуру й відновлює фокус після закриття.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const modal = modalRef.current;
    modal?.querySelector<HTMLElement>('input, select, button, [href]')?.focus();
    // Обробник закриває діалог через Escape та циклічно переводить Tab/Shift+Tab між доступними контролами.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !modal) return;
      const focusable = [...modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus(); };
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header><div><h3 id="modal-title">{title}</h3>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Dialog schließen"><X /></button></header>{children}</section></div>;
}
