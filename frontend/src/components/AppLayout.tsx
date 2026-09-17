import { Bell, ClipboardCheck, FileText, FolderKanban, LayoutDashboard, Leaf, Menu, Search, X } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projekte', icon: FolderKanban },
  { to: '/tasks', label: 'Aufgaben', icon: ClipboardCheck },
  { to: '/documents', label: 'Dokumente', icon: FileText },
];

function getPageMeta(pathname: string) {
  if (pathname === '/projects/new') return ['Neues Projekt', 'Projektportfolio erweitern'];
  if (pathname.endsWith('/edit')) return ['Projekt bearbeiten', 'Stammdaten aktualisieren'];
  if (pathname.startsWith('/projects/')) return ['Projektdetails', 'Fortschritt und Aufgaben'];
  const pages: Record<string, [string, string]> = {
    '/dashboard': ['Dashboard', 'Portfolio im Überblick'], '/projects': ['Projekte', 'Alle Mieterstrom-Projekte'],
    '/tasks': ['Aufgaben', 'Projektübergreifende Arbeitsliste'], '/documents': ['Dokumente', 'Zentrale Projektablage'],
  };
  return pages[pathname] ?? ['MeterFlow', 'Mieterstrom-Projekte'];
}

export function AppLayout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false); const { pathname } = useLocation(); const [title, subtitle] = getPageMeta(pathname);
  return <div className="app-shell">
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="brand"><span className="brand__mark"><Leaf /></span><span>MeterFlow<small>Energy projects</small></span></div>
      <button className="sidebar__close icon-button" onClick={() => setIsOpen(false)} aria-label="Navigation schließen"><X /></button>
      <nav className="nav" aria-label="Hauptnavigation"><p className="nav__label">Arbeitsbereich</p>{navigation.map(({ to, label, icon: Icon }) => <NavLink className={({ isActive }) => `nav__item ${isActive ? 'nav__item--active' : ''}`} to={to} key={to} onClick={() => setIsOpen(false)}><Icon /><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-profile"><span className="avatar avatar--dark">VS</span><div><strong>Vladyslav</strong><span>Developer</span></div><span className="profile-status" title="Online" /></div>
    </aside>
    {isOpen && <button className="sidebar-overlay" onClick={() => setIsOpen(false)} aria-label="Navigation schließen" />}
    <div className="app-main"><header className="topbar"><div className="topbar__title"><button className="menu-button icon-button" onClick={() => setIsOpen(true)} aria-label="Navigation öffnen"><Menu /></button><div><h1>{title}</h1><span>{subtitle}</span></div></div><div className="topbar__actions"><button className="topbar-icon" aria-label="Suchen" title="Suche folgt in einer späteren Phase"><Search /></button><button className="topbar-icon notification-button" aria-label="Benachrichtigungen" title="Keine neuen Benachrichtigungen"><Bell /><span /></button><span className="avatar">VS</span></div></header><main className="content">{children}</main></div>
  </div>;
}
