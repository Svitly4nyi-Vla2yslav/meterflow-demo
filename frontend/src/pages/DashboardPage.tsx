import { ArrowRight, CheckCircle2, CircleDot, FolderKanban, Hammer, Plus } from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getGreeting } from '../auth/user-utils';
import { EmptyState, ErrorState, LoadingState } from '../components/AsyncState';
import { ProjectTable } from '../components/ProjectTable';
import { getProjectPhase } from '../constants';
import { useApiData } from '../hooks';
import { api } from '../services/api';

export function DashboardPage() {
  const { user } = useAuth();
  const loader = useCallback(() => api.getProjects(), []); const { data, loading, error, retry } = useApiData(loader, [loader]);
  const projects = data ?? [];
  const greeting = getGreeting();
  const greetingWithName = user?.firstName ? `${greeting}, ${user.firstName}` : greeting;
  const stats = [
    { label: 'Projekte gesamt', value: projects.length, icon: FolderKanban, tone: 'navy', hint: 'Aktives Portfolio' },
    { label: 'In Planung', value: projects.filter((p) => getProjectPhase(p.status) === 'In Planung').length, icon: CircleDot, tone: 'blue', hint: 'Vor Umsetzung' },
    { label: 'In Umsetzung', value: projects.filter((p) => getProjectPhase(p.status) === 'In Umsetzung').length, icon: Hammer, tone: 'amber', hint: 'Aktive Bauphase' },
    { label: 'Abgeschlossen', value: projects.filter((p) => p.status === 'COMPLETED').length, icon: CheckCircle2, tone: 'green', hint: 'Erfolgreich beendet' },
  ];
  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">Portfolioübersicht</p><h2>{greetingWithName}</h2><p>Alle Mieterstrom-Projekte und nächsten Schritte auf einen Blick.</p></div><Link className="button" to="/projects/new"><Plus /> Neues Projekt</Link></section>
    <section className="stats-grid" aria-label="Projektstatistiken">{stats.map(({ label, value, icon: Icon, tone, hint }) => <article className="stat-card" key={label}><div className={`stat-card__icon stat-card__icon--${tone}`}><Icon /></div><div><span>{label}</span><strong>{loading ? '–' : value}</strong><small>{hint}</small></div></article>)}</section>
    <section className="panel"><div className="panel__header"><div><h3>Aktuelle Projekte</h3><p>Projektstatus und technische Eckdaten</p></div><Link className="text-link" to="/projects">Alle Projekte <ArrowRight /></Link></div>{loading ? <LoadingState label="Projekte werden geladen …" /> : error ? <ErrorState message={error} onRetry={retry} /> : !projects.length ? <EmptyState message="Noch keine Projekte vorhanden." /> : <ProjectTable projects={projects.slice(0, 5)} />}</section>
  </div>;
}
