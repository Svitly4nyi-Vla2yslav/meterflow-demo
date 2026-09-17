import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types';
import { ProjectStatusBadge } from './StatusBadge';

export function ProjectTable({ projects }: { projects: Project[] }) {
  const navigate = useNavigate();
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Projekt</th><th>Ort</th><th>Einheiten</th><th>PV-Leistung</th><th>Status</th><th aria-label="Öffnen" /></tr></thead>
        <tbody>{projects.map((project) => (
          <tr key={project.id} tabIndex={0} onClick={() => navigate(`/projects/${project.id}`)} onKeyDown={(event) => event.key === 'Enter' && navigate(`/projects/${project.id}`)}>
            <td><strong>{project.name}</strong></td><td>{project.city}</td><td>{project.units}</td><td>{project.pvPower} kWp</td><td><ProjectStatusBadge status={project.status} /></td><td><ArrowUpRight size={17} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
