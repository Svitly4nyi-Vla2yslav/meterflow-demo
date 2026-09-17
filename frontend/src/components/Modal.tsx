import { X } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function Modal({ title, description, onClose, children }: PropsWithChildren<{ title: string; description?: string; onClose: () => void }>) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header><div><h3 id="modal-title">{title}</h3>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Dialog schließen"><X /></button></header>{children}</section></div>;
}
