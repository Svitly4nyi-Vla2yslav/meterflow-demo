import { ArrowDown, Bot, FileUp, ShieldCheck } from 'lucide-react';
import { siDocker, siGithub, siGithubactions, siJest, siNestjs, siNetlify, siPostgresql, siPrisma, siReact, siTypescript, type SimpleIcon } from 'simple-icons';

const technologies = [
  { title: 'React', category: 'Frontend', icon: siReact, text: 'Komponentenbasierte Oberfläche mit responsiven Seiten, Formularen und geschützten Routen.' },
  { title: 'TypeScript', category: 'Sprache', icon: siTypescript, text: 'Durchgängige Typisierung zwischen UI, API-Services, DTOs und Geschäftslogik.' },
  { title: 'NestJS', category: 'Backend', icon: siNestjs, text: 'Modulare REST API für Authentifizierung, Projekte, Aufgaben, Suche und Dokumente.' },
  { title: 'PostgreSQL', category: 'Datenbank', icon: siPostgresql, text: 'Persistente relationale Datenhaltung für Benutzer und operative Projektdaten.' },
  { title: 'Prisma', category: 'Data Access', icon: siPrisma, text: 'Typsichere Datenmodelle, Migrationen und nachvollziehbare relationale Abfragen.' },
  { title: 'Docker', category: 'Infrastruktur', icon: siDocker, text: 'Reproduzierbare lokale PostgreSQL-Umgebung über Docker Compose.' },
  { title: 'Jest', category: 'Qualität', icon: siJest, text: 'Automatisierte Tests für Authentifizierung, Geschäftslogik und Dokumentvalidierung.' },
  { title: 'GitHub', category: 'Quellcode', icon: siGithub, text: 'Versionsverwaltung und nachvollziehbare Entwicklung des unabhängigen Projekts.' },
  { title: 'GitHub Actions', category: 'CI-ready', icon: siGithubactions, text: 'Build- und Testbefehle sind für eine schlanke CI-Pipeline vorbereitet.' },
  { title: 'Netlify', category: 'Deployment', icon: siNetlify, text: 'Ein Site-Deployment für React und die serverlose NestJS API inklusive Blob Storage.' },
  { title: 'AI Assistants', category: 'Entwicklung', icon: null, text: 'Unterstützung bei Implementierung und Review; integrierter Code wird verstanden und getestet.' },
];

function BrandIcon({ icon }: { icon: SimpleIcon | null }) { return icon ? <svg role="img" aria-label={`${icon.title} Logo`} viewBox="0 0 24 24" fill="currentColor"><path d={icon.path} /></svg> : <Bot aria-label="AI Assistants" />; }

export function TechStackPage() {
  return <div className="page-stack"><section className="about-hero"><div><p className="eyebrow">Über dieses Projekt</p><h2>Fullstack Engineering für die Energiewende</h2><p>MeterFlow ist ein unabhängiges Demo- und Portfolio-Projekt, inspiriert von realen Mieterstrom-Workflows. Es demonstriert eine vollständige TypeScript-Anwendung für Projektabläufe von der Anfrage bis zur Abrechnung – ohne Verbindung zu einem offiziellen Anbieter oder dessen Markenauftritt.</p><div className="about-tags"><span>Independent Demo</span><span>End-to-End TypeScript</span><span>EnergyTech SaaS</span></div></div><div className="architecture-mark"><span>React + Vite</span><i>→</i><span>Netlify Function</span><i>→</i><span>NestJS + Prisma</span><i>→</i><span>PostgreSQL</span></div></section>
    <section><div className="section-heading"><div><p className="eyebrow">Technologie</p><h3>Der Stack hinter MeterFlow</h3></div><p>Bewährte Werkzeuge, klar getrennte Verantwortlichkeiten und eine Architektur, die für Junior-Entwickler nachvollziehbar bleibt.</p></div><div className="tech-grid">{technologies.map(({ title, category, icon, text }) => <article className="tech-card" key={title}><span><BrandIcon icon={icon} /></span><small>{category}</small><h4>{title}</h4><p>{text}</p></article>)}</div></section>
    <section><div className="section-heading"><div><p className="eyebrow">Architektur</p><h3>Zwei klare Datenwege</h3></div><p>Metadaten bleiben relational abfragbar; Binärdateien werden unabhängig davon gespeichert.</p></div><div className="architecture-grid"><article className="architecture-flow"><h4><ShieldCheck /> Anwendungsdaten</h4><div><span>React Client</span><ArrowDown /><span>Netlify Function / NestJS</span><ArrowDown /><span>Prisma ORM</span><ArrowDown /><span>PostgreSQL</span></div></article><article className="architecture-flow"><h4><FileUp /> Dokumente</h4><div><span>Upload im Browser</span><ArrowDown /><span>NestJS Validierung</span><ArrowDown /><span>Netlify Blobs</span><small>Metadaten → PostgreSQL</small></div></article></div></section>
  </div>;
}
