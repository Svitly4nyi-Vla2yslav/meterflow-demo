import { ArrowLeft, PencilLine } from 'lucide-react';
import { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/AsyncState';
import { ProjectForm } from '../components/ProjectForm';
import { useToast } from '../components/Toast';
import { useApiData } from '../hooks';
import { api } from '../services/api';
import type { ProjectInput } from '../types';

export function ProjectEditPage() {
  const { id = '' } = useParams(); const navigate = useNavigate(); const { showToast } = useToast();
  const loader = useCallback(() => api.getProject(id), [id]); const project = useApiData(loader, [loader]);
  if (project.loading) return <LoadingState label="Projekt wird geladen …" />;
  if (project.error || !project.data) return <ErrorState message={project.error ?? 'Projekt nicht gefunden.'} onRetry={project.retry} />;
  const submit = async (data: ProjectInput) => { await api.updateProject(id, data); showToast('Projekt wurde aktualisiert.'); navigate(`/projects/${id}`); };
  return <div className="page-stack"><Link className="back-link" to={`/projects/${id}`}><ArrowLeft /> Zurück zum Projekt</Link><section className="form-shell"><div className="form-shell__intro"><span><PencilLine /></span><div><p className="eyebrow">Projektdaten</p><h2>Projekt bearbeiten</h2><p>Aktualisiere die Stammdaten des Projekts.</p></div></div><ProjectForm initial={project.data} submitLabel="Änderungen speichern" onSubmit={submit} onCancel={() => navigate(`/projects/${id}`)} /></section></div>;
}
