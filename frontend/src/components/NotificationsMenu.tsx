import { AlertTriangle, Bell, CheckCheck, Clock3, FilePlus2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../hooks';
import { api } from '../services/api';

interface Notice { id: string; title: string; detail: string; to: string; tone: string; icon: typeof Bell }
const storageKey = 'meterflow-read-notifications';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false); const [read, setRead] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(storageKey) ?? '[]') as string[]; } catch { return []; } });
  const loader = useCallback(async () => { const [tasks, documents] = await Promise.all([api.getTasks(), api.getDocuments()]); return { tasks, documents }; }, []);
  const result = useApiData(loader, [loader]);
  const notices = useMemo<Notice[]>(() => { if (!result.data) return []; const now = Date.now(); const week = 7 * 24 * 60 * 60 * 1000; return [...result.data.tasks.filter((task) => task.status !== 'DONE' && new Date(task.dueDate).getTime() < now).map((task) => ({ id: `overdue-${task.id}`, title: 'Aufgabe überfällig', detail: `${task.title} · ${task.project?.name ?? 'Projekt'}`, to: `/projects/${task.projectId}`, tone: 'danger', icon: AlertTriangle })), ...result.data.tasks.filter((task) => task.status !== 'DONE' && new Date(task.dueDate).getTime() >= now && new Date(task.dueDate).getTime() <= now + week).map((task) => ({ id: `soon-${task.id}`, title: 'Fälligkeit steht an', detail: `${task.title} · ${task.project?.name ?? 'Projekt'}`, to: `/projects/${task.projectId}`, tone: 'warning', icon: Clock3 })), ...result.data.documents.filter((document) => now - new Date(document.createdAt).getTime() <= week).map((document) => ({ id: `document-${document.id}`, title: 'Neues Dokument', detail: `${document.name} · ${document.project.name}`, to: `/documents?project=${document.projectId}`, tone: 'success', icon: FilePlus2 }))].slice(0, 8); }, [result.data]);
  const unread = notices.filter((notice) => !read.includes(notice.id));
  const markAll = () => { const ids = notices.map((notice) => notice.id); setRead(ids); localStorage.setItem(storageKey, JSON.stringify(ids)); };
  return <div className="notifications"><button className="topbar-icon notification-button" aria-label={`${unread.length} ungelesene Benachrichtigungen`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><Bell />{unread.length > 0 && <span />}</button>{open && <div className="notification-popover"><header><div><strong>Benachrichtigungen</strong><span>{unread.length ? `${unread.length} ungelesen` : 'Alles gelesen'}</span></div><button onClick={markAll} disabled={!unread.length}><CheckCheck /> Alle gelesen</button></header><div>{result.loading ? <p className="notification-empty">Wird geladen …</p> : notices.length ? notices.map((notice) => { const Icon = notice.icon; return <Link className={read.includes(notice.id) ? 'notice notice--read' : 'notice'} to={notice.to} key={notice.id} onClick={() => { const next = [...new Set([...read, notice.id])]; setRead(next); localStorage.setItem(storageKey, JSON.stringify(next)); setOpen(false); }}><span className={`notice__icon notice__icon--${notice.tone}`}><Icon /></span><div><strong>{notice.title}</strong><small>{notice.detail}</small></div>{!read.includes(notice.id) && <i />}</Link>; }) : <p className="notification-empty">Keine aktuellen Hinweise.</p>}</div></div>}</div>;
}
