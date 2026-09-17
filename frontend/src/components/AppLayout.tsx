import { ClipboardCheck, FileText, FolderKanban, LayoutDashboard, Leaf, Menu, X } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projekte', icon: FolderKanban },
  { to: '/tasks', label: 'Aufgaben', icon: ClipboardCheck },
  { to: '/documents', label: 'Dokumente', icon: FileText, disabled: true },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projekte',
  '/tasks': 'Aufgaben',
};

export function AppLayout({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const title = pathname.startsWith('/projects/') ? 'Projektdetails' : pageTitles[pathname] ?? 'MeterFlow';

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="brand"><span className="brand__mark"><Leaf size={20} /></span><span>MeterFlow</span></div>
        <button className="sidebar__close icon-button" onClick={() => setIsOpen(false)} aria-label="Navigation schließen"><X /></button>
        <nav className="nav" aria-label="Hauptnavigation">
          <p className="nav__label">Arbeitsbereich</p>
          {navigation.map(({ to, label, icon: Icon, disabled }) => disabled ? (
            <span className="nav__item nav__item--disabled" key={to} title="In einer späteren Phase verfügbar"><Icon size={19} /><span>{label}</span><small>Bald</small></span>
          ) : (
            <NavLink className={({ isActive }) => `nav__item ${isActive ? 'nav__item--active' : ''}`} to={to} key={to} onClick={() => setIsOpen(false)}>
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer"><span className="status-dot" /> System bereit</div>
      </aside>
      {isOpen && <button className="sidebar-overlay" onClick={() => setIsOpen(false)} aria-label="Navigation schließen" />}
      <div className="app-main">
        <header className="topbar">
          <div className="topbar__title"><button className="menu-button icon-button" onClick={() => setIsOpen(true)} aria-label="Navigation öffnen"><Menu /></button><h1>{title}</h1></div>
          <div className="user"><span className="avatar">VS</span><div><strong>Vladyslav</strong><span>Developer</span></div></div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
