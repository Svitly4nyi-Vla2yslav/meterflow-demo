import { BarChart3, Bell, ChevronDown, ClipboardCheck, FileText, FolderKanban, Layers3, LayoutDashboard, Leaf, LogOut, Menu, Search, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getInitials, roleLabels } from '../auth/user-utils';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { to: '/projects', label: 'Projekte', icon: FolderKanban },
  { to: '/tasks', label: 'Aufgaben', icon: ClipboardCheck }, { to: '/documents', label: 'Dokumente', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 }, { to: '/tech-stack', label: 'Tech Stack', icon: Layers3 },
];
function getPageMeta(pathname: string) {
  if (pathname === '/projects/new') return ['Neues Projekt', 'Projektportfolio erweitern']; if (pathname.endsWith('/edit')) return ['Projekt bearbeiten', 'Stammdaten aktualisieren']; if (pathname.startsWith('/projects/')) return ['Projektdetails', 'Fortschritt und Aufgaben'];
  const pages: Record<string, [string, string]> = { '/dashboard': ['Dashboard', 'Portfolio im Überblick'], '/projects': ['Projekte', 'Alle Mieterstrom-Projekte'], '/tasks': ['Aufgaben', 'Projektübergreifende Arbeitsliste'], '/documents': ['Dokumente', 'Zentrale Projektablage'], '/analytics': ['Analytics', 'Portfolio-Kennzahlen und Trends'], '/tech-stack': ['Tech Stack', 'Architektur und Technologien'], '/profile': ['Mein Profil', 'Persönliche Kontoinformationen'] };
  return pages[pathname] ?? ['MeterFlow', 'Mieterstrom-Projekte'];
}

export function AppLayout() {
  const [isOpen, setIsOpen] = useState(false); const [profileOpen, setProfileOpen] = useState(false); const { pathname } = useLocation(); const navigate = useNavigate(); const { user, logout } = useAuth(); const [title, subtitle] = getPageMeta(pathname);
  if (!user) return null; const initials = getInitials(user); const signOut = () => { logout(); navigate('/login', { replace: true }); };
  return <div className="app-shell"><aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}><div className="brand"><span className="brand__mark"><Leaf /></span><span>MeterFlow<small>Energy projects</small></span></div><button className="sidebar__close icon-button" onClick={() => setIsOpen(false)} aria-label="Navigation schließen"><X /></button><nav className="nav" aria-label="Hauptnavigation"><p className="nav__label">Arbeitsbereich</p>{navigation.map(({ to, label, icon: Icon }) => <NavLink className={({ isActive }) => `nav__item ${isActive ? 'nav__item--active' : ''}`} to={to} key={to} onClick={() => setIsOpen(false)}><Icon /><span>{label}</span></NavLink>)}</nav><Link className="sidebar-profile" to="/profile" onClick={() => setIsOpen(false)}><span className="avatar avatar--dark">{initials}</span><div><strong>{user.firstName} {user.lastName}</strong><span>{roleLabels[user.role]}</span></div><span className="profile-status" title="Online" /></Link></aside>
    {isOpen && <button className="sidebar-overlay" onClick={() => setIsOpen(false)} aria-label="Navigation schließen" />}
    <div className="app-main"><header className="topbar"><div className="topbar__title"><button className="menu-button icon-button" onClick={() => setIsOpen(true)} aria-label="Navigation öffnen"><Menu /></button><div><h1>{title}</h1><span>{subtitle}</span></div></div><div className="topbar__actions"><button className="topbar-icon" aria-label="Suchen" title="Suche folgt in einer späteren Phase"><Search /></button><button className="topbar-icon notification-button" aria-label="Benachrichtigungen" title="Keine neuen Benachrichtigungen"><Bell /><span /></button><div className="profile-menu"><button className="profile-trigger" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}><span className="avatar">{initials}</span><ChevronDown /></button>{profileOpen && <div className="profile-dropdown"><div><strong>{user.firstName} {user.lastName}</strong><span>{user.email}</span></div><Link to="/profile" onClick={() => setProfileOpen(false)}><UserRound /> Mein Profil</Link><button onClick={signOut}><LogOut /> Abmelden</button></div>}</div></div></header><main className="content"><Outlet /></main></div>
  </div>;
}
