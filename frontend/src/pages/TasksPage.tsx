import { CalendarDays, Check } from 'lucide-react';
import { useCallback } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../components/AsyncState';
import { TaskStatusBadge } from '../components/StatusBadge';
import { useApiData } from '../hooks';
import { api } from '../services/api';

export function TasksPage() {
  const loader = useCallback(async () => {
    const projects = await api.getProjects();
    const tasks = await Promise.all(projects.map(async (project) => (await api.getProjectTasks(project.id)).map((task) => ({ ...task, project: { id: project.id, name: project.name } }))));
    return tasks.flat();
  }, []);
  const { data, loading, error, retry } = useApiData(loader, [loader]);
  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">Arbeitsliste</p><h2>Alle Aufgaben</h2><p>Anstehende Tätigkeiten über alle Projekte hinweg.</p></div></section><section className="panel"><div className="panel__header"><div><h3>Aufgabenübersicht</h3><p>Nach Projekt und Bearbeitungsstand gegliedert</p></div></div>
    {loading ? <LoadingState label="Aufgaben werden geladen …" /> : error ? <ErrorState message={error} onRetry={retry} /> : !data?.length ? <EmptyState message="Aktuell sind keine Aufgaben vorhanden." /> : <div className="task-list">{data.map((task) => <article className="task-row" key={task.id}><span className={`task-check task-check--${task.status.toLowerCase()}`}>{task.status === 'DONE' && <Check size={15} />}</span><div className="task-row__title"><strong>{task.title}</strong><span><CalendarDays size={14} /> {task.project?.name} · {new Intl.DateTimeFormat('de-DE').format(new Date(task.dueDate))}</span></div><TaskStatusBadge status={task.status} /></article>)}</div>}
  </section></div>;
}
