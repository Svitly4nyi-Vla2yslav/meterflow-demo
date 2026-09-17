import { Activity, CalendarDays, CheckCircle2, CircleDot, FolderKanban, ListChecks, SunMedium } from 'lucide-react';
import { useCallback, type CSSProperties } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/AsyncState';
import { projectStatusLabels, taskStatusLabels } from '../components/StatusBadge';
import { workflowStages } from '../constants';
import { useApiData } from '../hooks';
import { api } from '../services/api';
import type { TaskStatus } from '../types';

const taskStatuses: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'DONE'];
const taskColors: Record<TaskStatus, string> = { OPEN: '#82918a', IN_PROGRESS: '#d89a43', DONE: '#39a66d' };

export function AnalyticsPage() {
  const loader = useCallback(async () => { const [projects, tasks] = await Promise.all([api.getProjects(), api.getTasks()]); return { projects, tasks }; }, []);
  const { data, loading, error, retry } = useApiData(loader, [loader]);
  if (loading) return <LoadingState label="Analysedaten werden geladen …" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!data) return <EmptyState message="Keine Analysedaten verfügbar." />;

  const { projects, tasks } = data;
  const totalPower = projects.reduce((sum, project) => sum + project.pvPower, 0);
  const active = projects.filter((project) => project.status !== 'COMPLETED').length;
  const completed = projects.length - active;
  const openTasks = tasks.filter((task) => task.status !== 'DONE').length;
  const stats = [
    { label: 'Aktive Projekte', value: active, detail: `${projects.length} Projekte gesamt`, icon: FolderKanban, tone: 'navy' },
    { label: 'Abgeschlossene Projekte', value: completed, detail: 'Erfolgreich beendet', icon: CheckCircle2, tone: 'green' },
    { label: 'Offene Aufgaben', value: openTasks, detail: `${tasks.filter((task) => task.status === 'IN_PROGRESS').length} davon in Arbeit`, icon: ListChecks, tone: 'amber' },
    { label: 'Gesamtleistung', value: `${totalPower} kWp`, detail: 'Installierte und geplante PV', icon: SunMedium, tone: 'blue' },
  ];
  const projectDistribution = workflowStages.map((stage) => ({ ...stage, count: projects.filter((project) => project.status === stage.status).length })).filter((item) => item.count > 0);
  const monthMap = new Map<string, { date: Date; count: number; power: number }>();
  projects.forEach((project) => { const created = new Date(project.createdAt); const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`; const current = monthMap.get(key) ?? { date: new Date(created.getFullYear(), created.getMonth(), 1), count: 0, power: 0 }; current.count += 1; current.power += project.pvPower; monthMap.set(key, current); });
  let cumulativePower = 0;
  const development = [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => { cumulativePower += value.power; return { key, month: new Intl.DateTimeFormat('de-DE', { month: 'short', year: '2-digit' }).format(value.date), count: value.count, power: cumulativePower }; });
  const maxMonthlyProjects = Math.max(1, ...development.map((item) => item.count));

  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">Portfolio Insights</p><h2>Analytics</h2><p>Kennzahlen und Verteilungen aus dem aktuellen Projektportfolio.</p></div><span className="summary-chip"><Activity /> Live aus PostgreSQL</span></section>
    <section className="stats-grid analytics-stats">{stats.map(({ label, value, detail, icon: Icon, tone }) => <article className="stat-card" key={label}><div className={`stat-card__icon stat-card__icon--${tone}`}><Icon /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>)}</section>
    <section className="analytics-grid"><article className="panel chart-panel"><div className="panel__header"><div><h3>Projekte nach Status</h3><p>Aktueller Schritt im Mieterstrom-Workflow</p></div><CircleDot /></div><div className="horizontal-chart">{projectDistribution.map((item) => <div className="chart-row" key={item.status}><div><span>{projectStatusLabels[item.status]}</span><strong>{item.count}</strong></div><div className="chart-track"><span style={{ '--bar-width': `${projects.length ? (item.count / projects.length) * 100 : 0}%` } as CSSProperties} /></div></div>)}</div></article>
      <article className="panel chart-panel"><div className="panel__header"><div><h3>Aufgaben nach Status</h3><p>Verteilung der operativen Arbeitsliste</p></div><ListChecks /></div><div className="donut-layout"><div className="donut-chart" style={{ '--done': `${tasks.length ? tasks.filter((task) => task.status === 'DONE').length / tasks.length * 100 : 0}%`, '--progress': `${tasks.length ? tasks.filter((task) => task.status !== 'OPEN').length / tasks.length * 100 : 0}%` } as CSSProperties}><div><strong>{tasks.length}</strong><span>Aufgaben</span></div></div><div className="chart-legend">{taskStatuses.map((status) => { const count = tasks.filter((task) => task.status === status).length; return <div key={status}><i style={{ background: taskColors[status] }} /><span>{taskStatusLabels[status]}</span><strong>{count}</strong><small>{tasks.length ? Math.round(count / tasks.length * 100) : 0}%</small></div>; })}</div></div></article>
    </section>
    <section className="panel chart-panel"><div className="panel__header"><div><h3>Projekte nach Erstellungsmonat</h3><p>Neue Projekte als Balken, kumulierte PV-Leistung als Wert</p></div><span className="demo-label"><CalendarDays /> Reale Zeitstempel</span></div>{development.length ? <><div className="column-chart column-chart--actual" style={{ '--month-count': development.length } as CSSProperties}>{development.map((item) => <div className="column-chart__item" key={item.key} aria-label={`${item.count} Projekte, kumuliert ${item.power} Kilowatt-Peak`}><span>{item.power} kWp</span><div><i style={{ '--column-height': `${item.count / maxMonthlyProjects * 100}%` } as CSSProperties}><b>{item.count}</b></i></div><strong>{item.month}</strong></div>)}</div>{development.length < 4 && <p className="sparse-history">Die Historie umfasst aktuell {development.length === 1 ? 'einen Erstellungsmonat' : `${development.length} Erstellungsmonate`}. Die Darstellung erweitert sich automatisch mit neuen Projekten.</p>}</> : <EmptyState message="Noch keine Projekthistorie verfügbar." />}</section>
  </div>;
}
