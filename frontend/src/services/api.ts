import type { Project, ProjectTask } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function request<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error('Die API ist nicht erreichbar. Bitte prüfe, ob das Backend läuft.');
  }

  if (!response.ok) {
    throw new Error(`Die Anfrage ist fehlgeschlagen (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getProjects: () => request<Project[]>('/projects'),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  getProjectTasks: (id: string) => request<ProjectTask[]>(`/projects/${id}/tasks`),
};
