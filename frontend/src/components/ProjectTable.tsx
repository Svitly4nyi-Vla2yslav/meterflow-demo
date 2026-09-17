import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProjectPhase } from '../constants';
import type { Project } from '../types';
import { ProjectStatusBadge } from './StatusBadge';

export function ProjectTable({ projects }: { projects: Project[] }) {
  const navigate = useNavigate();
  return <div className="table-wrap"><table><thead><tr><th>Projekt</th><th>Ort</th><th>Einheiten</th><th>PV-Leistung</th><th>Aktueller Schritt</th><th>Status</th><th aria-label="Öffnen" /></tr></thead><tbody>{projects.map((project) => <tr key={project.id} tabIndex={0} onClick={() => navigate(`/projects/${project.id}`)} onKeyDown={(event) => event.key === 'Enter' && navigate(`/projects/${project.id}`)}><td><strong>{project.name}</strong><small className="table-subline">{project.address}</small></td><td>{project.city}</td><td>{project.units}</td><td>{project.pvPower} kWp</td><td><ProjectStatusBadge status={project.status} /></td><td><span className={`phase-label phase-label--${getProjectPhase(project.status).toLowerCase().replace(' ', '-')}`}><i />{getProjectPhase(project.status)}</span></td><td><ArrowUpRight /></td></tr>)}</tbody></table></div>;
}
