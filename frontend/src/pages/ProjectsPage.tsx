import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AsyncProjectList } from './shared/AsyncProjectList';

/**
 * Формує сторінку портфеля з переходом до створення проєкту та асинхронним списком.
 * Компонент не завантажує дані самостійно: стани запиту й таблицю делеговано
 * `AsyncProjectList`, а посилання лише змінює маршрут на `/projects/new`.
 */
export function ProjectsPage() {
  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">Projektportfolio</p><h2>Alle Projekte</h2><p>Verwalte Stammdaten, Status und Aufgaben deiner Mieterstrom-Projekte.</p></div><Link className="button" to="/projects/new"><Plus /> Neues Projekt</Link></section><section className="panel"><div className="panel__header"><div><h3>Projektübersicht</h3><p>Wähle ein Projekt aus, um Details und Aufgaben zu bearbeiten.</p></div></div><AsyncProjectList /></section></div>;
}
