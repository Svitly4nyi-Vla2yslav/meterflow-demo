import type { ProjectStatus, TaskStatus } from '../types';

// Мапи гарантують текстову мітку для кожного допустимого статусу проєкту й завдання.
export const projectStatusLabels: Record<ProjectStatus, string> = {
  INQUIRY: 'Anfrage', ECONOMIC_CHECK: 'Wirtschaftlichkeitsprüfung', CONTRACT: 'Vertrag',
  METERING_CONCEPT: 'Messkonzept', GRID_REGISTRATION: 'Anmeldung', INSTALLATION: 'Installation',
  COMMISSIONING: 'Inbetriebnahme', BILLING: 'Abrechnung', COMPLETED: 'Abgeschlossen',
};
export const taskStatusLabels: Record<TaskStatus, string> = { OPEN: 'Offen', IN_PROGRESS: 'In Arbeit', DONE: 'Erledigt' };
/**
 * Перетворює ProjectStatus на німецьку мітку та CSS-модифікатор у нижньому регістрі.
 */
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) { return <span className={`badge badge--${status.toLowerCase()}`}>{projectStatusLabels[status]}</span>; }
/**
 * Перетворює TaskStatus на компактну позначку завдання без локального стану чи побічних ефектів.
 */
export function TaskStatusBadge({ status }: { status: TaskStatus }) { return <span className={`badge task-badge badge--${status.toLowerCase()}`}>{taskStatusLabels[status]}</span>; }
