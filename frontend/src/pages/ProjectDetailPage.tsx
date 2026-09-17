import { ArrowLeft, Building2, CalendarDays, Check, MapPin, SunMedium, Users } from 'lucide-react';
import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/AsyncState';
import { ProjectStatusBadge, TaskStatusBadge, projectStatusLabels } from '../components/StatusBadge';
import { useApiData } from '../hooks';
import { api } from '../services/api';
import type { ProjectStatus } from '../types';

const stages: { status: ProjectStatus; label: string }[] = [
  { status: 'INQUIRY', label: 'Anfrage' }, { status: 'ECONOMIC_CHECK', label: 'Wirtschaftlichkeitsprüfung' },
  { status: 'CONTRACT', label: 'Vertrag' }, { status: 'METERING_CONCEPT', label: 'Messkonzept' },
  { status: 'GRID_REGISTRATION', label: 'Anmeldung Netzbetreiber' }, { status: 'INSTALLATION', label: 'Installation' },
  { status: 'COMMISSIONING', label: 'Inbetriebnahme' }, { status: 'BILLING', label: 'Abrechnung' },
];

function formatDate(date: string) { return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date)); }

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const projectLoader = useCallback(() => api.getProject(id), [id]);
  const tasksLoader = useCallback(() => api.getProjectTasks(id), [id]);
  const project = useApiData(projectLoader, [projectLoader]);
  const tasks = useApiData(tasksLoader, [tasksLoader]);

  if (project.loading) return <LoadingState label="Projekt wird geladen …" />;
  if (project.error) return <ErrorState message={project.error} onRetry={project.retry} />;
  if (!project.data) return <EmptyState message="Projekt nicht gefunden." />;

  const currentIndex = project.data.status === 'COMPLETED' ? stages.length : stages.findIndex((stage) => stage.status === project.data?.status);
  const completedCount = Math.max(0, currentIndex);
  const progress = project.data.status === 'COMPLETED' ? 100 : Math.round(((currentIndex + 1) / stages.length) * 100);

  return <div className="page-stack">
    <Link className="back-link" to="/projects"><ArrowLeft size={17} /> Zurück zu Projekte</Link>
    <section className="detail-hero"><div><p className="eyebrow">Projekt</p><div className="detail-hero__title"><h2>{project.data.name}</h2><ProjectStatusBadge status={project.data.status} /></div><p><MapPin size={16} /> {project.data.address}</p></div><div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><div><strong>{progress}%</strong><span>Fortschritt</span></div></div></section>
    <section className="detail-grid">
      <article className="info-card"><span><MapPin /></span><div><small>Adresse</small><strong>{project.data.address}</strong></div></article>
      <article className="info-card"><span><Users /></span><div><small>Wohneinheiten</small><strong>{project.data.units} Einheiten</strong></div></article>
      <article className="info-card"><span><SunMedium /></span><div><small>PV-Leistung</small><strong>{project.data.pvPower} kWp</strong></div></article>
      <article className="info-card"><span><Building2 /></span><div><small>Aktueller Status</small><strong>{projectStatusLabels[project.data.status]}</strong></div></article>
    </section>
    <section className="panel"><div className="panel__header"><div><h3>Projektfortschritt</h3><p>Von der Anfrage bis zur laufenden Abrechnung</p></div><strong className="progress-text">{completedCount} von 8 Phasen abgeschlossen</strong></div>
      <div className="timeline">{stages.map((stage, index) => { const state = index < currentIndex || project.data?.status === 'COMPLETED' ? 'complete' : index === currentIndex ? 'current' : 'future'; return <div className={`timeline__step timeline__step--${state}`} key={stage.status}><span className="timeline__marker">{state === 'complete' ? <Check size={15} /> : index + 1}</span><span>{stage.label}</span></div>; })}</div>
    </section>
    <section className="panel"><div className="panel__header"><div><h3>Nächste Aufgaben</h3><p>Offene Schritte und anstehende Termine</p></div></div>
      {tasks.loading ? <LoadingState label="Aufgaben werden geladen …" /> : tasks.error ? <ErrorState message={tasks.error} onRetry={tasks.retry} /> : !tasks.data?.length ? <EmptyState message="Für dieses Projekt sind keine Aufgaben vorhanden." /> : <div className="task-list">{tasks.data.map((task) => <article className="task-row" key={task.id}><span className={`task-check task-check--${task.status.toLowerCase()}`}>{task.status === 'DONE' && <Check size={15} />}</span><div className="task-row__title"><strong>{task.title}</strong><span><CalendarDays size={14} /> Fällig am {formatDate(task.dueDate)}</span></div><TaskStatusBadge status={task.status} /></article>)}</div>}
    </section>
  </div>;
}
