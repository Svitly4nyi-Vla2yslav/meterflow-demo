import { CalendarDays, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getInitials, roleLabels } from '../auth/user-utils';

export function ProfilePage() {
  const { user, logout } = useAuth(); const navigate = useNavigate(); if (!user) return null;
  const signOut = () => { logout(); navigate('/login', { replace: true }); };
  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">Benutzerkonto</p><h2>Mein Profil</h2><p>Persönliche Informationen und Kontozugang.</p></div></section><section className="profile-card"><div className="profile-card__header"><span className="profile-avatar">{getInitials(user)}</span><div><h3>{user.firstName} {user.lastName}</h3><p>{roleLabels[user.role]}</p></div><button className="button button--danger" onClick={signOut}><LogOut /> Abmelden</button></div><div className="profile-details"><article><span><UserRound /></span><div><small>Vollständiger Name</small><strong>{user.firstName} {user.lastName}</strong></div></article><article><span><Mail /></span><div><small>E-Mail-Adresse</small><strong>{user.email}</strong></div></article><article><span><ShieldCheck /></span><div><small>Rolle</small><strong>{roleLabels[user.role]}</strong></div></article><article><span><CalendarDays /></span><div><small>Konto erstellt</small><strong>{new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(user.createdAt))}</strong></div></article></div></section></div>;
}
