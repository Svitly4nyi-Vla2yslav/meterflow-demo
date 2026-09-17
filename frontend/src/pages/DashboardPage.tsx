import { CheckCircle2, CircleDot, FolderKanban, Hammer } from 'lucide-react';
import { AsyncProjectList } from './shared/AsyncProjectList';

const stats = [
  { label: 'Projekte gesamt', value: 12, icon: FolderKanban, tone: 'navy' },
  { label: 'In Planung', value: 4, icon: CircleDot, tone: 'blue' },
  { label: 'In Umsetzung', value: 5, icon: Hammer, tone: 'amber' },
  { label: 'Abgeschlossen', value: 3, icon: CheckCircle2, tone: 'green' },
];

export function DashboardPage() {
  return <div className="page-stack">
    <section className="page-intro"><div><p className="eyebrow">Übersicht</p><h2>Guten Morgen, Vladyslav</h2><p>Hier ist der aktuelle Stand deiner Mieterstrom-Projekte.</p></div><span className="date-chip">Projektportfolio 2026</span></section>
    <section className="stats-grid" aria-label="Projektstatistiken">
      {stats.map(({ label, value, icon: Icon, tone }) => <article className="stat-card" key={label}><div className={`stat-card__icon stat-card__icon--${tone}`}><Icon size={20} /></div><div><span>{label}</span><strong>{value}</strong></div></article>)}
    </section>
    <section className="panel"><div className="panel__header"><div><h3>Aktuelle Projekte</h3><p>Zuletzt bearbeitete Projekte und ihr Fortschritt</p></div><span className="live-label"><span className="status-dot" /> Live-Daten</span></div><AsyncProjectList limit={4} /></section>
  </div>;
}
