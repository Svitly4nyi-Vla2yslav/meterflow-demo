import { Bot, Boxes, Braces, Container, Database, GitBranch, Network, TestTube2 } from 'lucide-react';

const technologies = [
  { title: 'React', category: 'Frontend', icon: Boxes, text: 'Komponentenbasierte Benutzeroberfläche mit responsiven Seiten, Formularen und geschützten Routen.' },
  { title: 'TypeScript', category: 'Sprache', icon: Braces, text: 'Durchgängige Typisierung zwischen UI, API-Services, DTOs und Geschäftslogik.' },
  { title: 'NestJS', category: 'Backend', icon: Network, text: 'Modulare REST API für Authentifizierung, Projekte und Aufgaben mit DTO-Validierung.' },
  { title: 'PostgreSQL', category: 'Datenbank', icon: Database, text: 'Persistente relationale Datenhaltung für Benutzer, Projekte und Aufgaben.' },
  { title: 'Docker', category: 'Infrastruktur', icon: Container, text: 'Reproduzierbare lokale PostgreSQL-Umgebung über Docker Compose.' },
  { title: 'Jest', category: 'Qualität', icon: TestTube2, text: 'Automatisierte Backend-Tests für zentrale Authentifizierungs- und Geschäftsaktionen.' },
  { title: 'GitHub Actions', category: 'CI-ready', icon: GitBranch, text: 'Die getrennten Build- und Testbefehle sind für eine schlanke CI-Pipeline vorbereitet.' },
  { title: 'AI Assistants', category: 'Entwicklung', icon: Bot, text: 'Unterstützung bei Implementierung und Review; integrierter Code wird verstanden und getestet.' },
];

export function TechStackPage() {
  return <div className="page-stack"><section className="about-hero"><div><p className="eyebrow">Über dieses Projekt</p><h2>Fullstack Engineering für die Energiewende</h2><p>MeterFlow ist ein unabhängiges Demo- und Portfolio-Projekt, inspiriert von realen Mieterstrom-Workflows. Es demonstriert eine vollständige TypeScript-Anwendung für Projektabläufe von der Anfrage bis zur Abrechnung – ohne Verbindung zu einem offiziellen Anbieter oder dessen Markenauftritt.</p><div className="about-tags"><span>Independent Demo</span><span>End-to-End TypeScript</span><span>EnergyTech SaaS</span></div></div><div className="architecture-mark"><span>React</span><i>→</i><span>NestJS</span><i>→</i><span>PostgreSQL</span></div></section>
    <section><div className="section-heading"><div><p className="eyebrow">Technologie</p><h3>Der Stack hinter MeterFlow</h3></div><p>Bewährte Werkzeuge, klar getrennte Verantwortlichkeiten und eine Architektur, die für Junior-Entwickler nachvollziehbar bleibt.</p></div><div className="tech-grid">{technologies.map(({ title, category, icon: Icon, text }) => <article className="tech-card" key={title}><span><Icon /></span><small>{category}</small><h4>{title}</h4><p>{text}</p></article>)}</div></section>
  </div>;
}
