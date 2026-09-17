import { FileText } from 'lucide-react';

export function DocumentsPage() {
  return <div className="page-stack"><section className="page-intro"><div><p className="eyebrow">Projektablage</p><h2>Dokumente</h2><p>Technische Unterlagen und Vertragsdokumente zentral verwalten.</p></div></section><section className="empty-feature"><span><FileText /></span><h3>Noch keine Dokumente</h3><p>Die Dokumentenverwaltung wird in einer späteren Phase ergänzt.</p></section></div>;
}
