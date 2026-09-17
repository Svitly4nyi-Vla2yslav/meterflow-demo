import { Plus } from 'lucide-react';
import { AsyncProjectList } from './shared/AsyncProjectList';

export function ProjectsPage() {
  return <div className="page-stack">
    <section className="page-intro"><div><p className="eyebrow">Portfolio</p><h2>Alle Projekte</h2><p>Überblick über deine Mieterstrom-Projekte und deren Status.</p></div><button className="button" disabled title="Projekterstellung folgt in einer späteren Phase"><Plus size={18} /> Neues Projekt</button></section>
    <section className="panel"><div className="panel__header"><div><h3>Projektübersicht</h3><p>Wähle ein Projekt aus, um Details und Aufgaben zu sehen.</p></div></div><AsyncProjectList /></section>
  </div>;
}
