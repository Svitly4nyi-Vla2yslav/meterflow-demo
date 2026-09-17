import { ArrowLeft, CirclePlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProjectForm } from '../components/ProjectForm';
import { useToast } from '../components/Toast';
import { api } from '../services/api';
import type { ProjectInput } from '../types';

export function ProjectCreatePage() {
  const navigate = useNavigate(); const { showToast } = useToast();
  const submit = async (data: ProjectInput) => { const project = await api.createProject(data); showToast('Projekt erfolgreich erstellt.'); navigate(`/projects/${project.id}`); };
  return <div className="page-stack"><Link className="back-link" to="/projects"><ArrowLeft /> Zurück zu Projekte</Link><section className="form-shell"><div className="form-shell__intro"><span><CirclePlus /></span><div><p className="eyebrow">Neues Projekt</p><h2>Projekt anlegen</h2><p>Erfasse die wichtigsten Eckdaten. Das Projekt startet automatisch in der Anfragephase.</p></div></div><ProjectForm submitLabel="Projekt erstellen" onSubmit={submit} onCancel={() => navigate('/projects')} /></section></div>;
}
