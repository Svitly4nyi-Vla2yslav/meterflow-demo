import { CalendarCheck2, Check, ListFilter } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/AsyncState';
import { useToast } from '../components/Toast';
import { useApiData } from '../hooks';
import { api } from '../services/api';
import type { TaskStatus } from '../types';

const filters: { value: 'ALL' | TaskStatus; label: string }[] = [{ value: 'ALL', label: 'Alle' }, { value: 'OPEN', label: 'Offen' }, { value: 'IN_PROGRESS', label: 'In Arbeit' }, { value: 'DONE', label: 'Erledigt' }];
const statusLabels: Record<TaskStatus, string> = { OPEN: 'Offen', IN_PROGRESS: 'In Arbeit', DONE: 'Erledigt' };

export function TasksPage() {
  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL'); const { showToast } = useToast();
  const loader = useCallback(() => api.getTasks(), []); const { data, loading, error, retry } = useApiData(loader, [loader]);
  const visibleTasks = (data ?? []).filter((task) => filter === 'ALL' || task.status === filter);
  const updateStatus = async (id: string, status: TaskStatus) => { try { await api.updateTaskStatus(id, status); await retry(); showToast('Aufgabenstatus wurde geändert.'); } catch (reason) { showToast(reason instanceof Error ? reason.message : 'Status konnte nicht geändert werden.', 'error'); } };
  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">Arbeitsliste</p><h2>Alle Aufgaben</h2><p>Priorisiere die nächsten Schritte über alle Projekte hinweg.</p></div><span className="summary-chip"><CalendarCheck2 /> {data?.length ?? 0} Aufgaben</span></section>
    <section className="panel"><div className="panel__header panel__header--filters"><div><h3>Aufgabenübersicht</h3><p>Nach Bearbeitungsstand filtern</p></div><div className="filter-group" aria-label="Aufgaben filtern"><ListFilter />{filters.map((item) => <button className={filter === item.value ? 'active' : ''} key={item.value} onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === 'ALL' ? data?.length ?? 0 : data?.filter((task) => task.status === item.value).length ?? 0}</span></button>)}</div></div>
      {loading ? <LoadingState label="Aufgaben werden geladen …" /> : error ? <ErrorState message={error} onRetry={retry} /> : !visibleTasks.length ? <EmptyState message="Für diesen Filter sind keine Aufgaben vorhanden." /> : <div className="table-wrap"><table className="task-table"><thead><tr><th>Aufgabe</th><th>Projekt</th><th>Status</th><th>Fällig am</th></tr></thead><tbody>{visibleTasks.map((task) => <tr className={task.status === 'DONE' ? 'row-done' : ''} key={task.id}><td><span className={`task-check task-check--${task.status.toLowerCase()}`}>{task.status === 'DONE' && <Check />}</span><strong>{task.title}</strong></td><td><Link to={`/projects/${task.projectId}`}>{task.project?.name ?? 'Projekt'}</Link></td><td><select className={`status-select status-select--${task.status.toLowerCase()}`} value={task.status} onChange={(event) => void updateStatus(task.id, event.target.value as TaskStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></td><td>{new Intl.DateTimeFormat('de-DE').format(new Date(task.dueDate))}</td></tr>)}</tbody></table></div>}
    </section></div>;
}
