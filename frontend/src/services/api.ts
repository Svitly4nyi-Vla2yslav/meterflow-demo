import type { Project, ProjectInput, ProjectStatus, ProjectTask, TaskInput, TaskStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

interface ApiErrorBody { message?: string | string[] }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  } catch {
    throw new Error('Die API ist nicht erreichbar. Bitte prüfe, ob das Backend läuft.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null) as ApiErrorBody | null;
    const detail = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
    throw new Error(detail || `Die Anfrage ist fehlgeschlagen (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getProjects: () => request<Project[]>('/projects'),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  createProject: (data: ProjectInput) => request<Project>('/projects', { method: 'POST', body: JSON.stringify({ ...data, status: 'INQUIRY' }) }),
  updateProject: (id: string, data: Partial<ProjectInput> | { status: ProjectStatus }) => request<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getProjectTasks: (id: string) => request<ProjectTask[]>(`/projects/${id}/tasks`),
  getTasks: () => request<ProjectTask[]>('/tasks'),
  createTask: (projectId: string, data: TaskInput) => request<ProjectTask>(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify({ ...data, status: data.status ?? 'OPEN' }) }),
  updateTaskStatus: (id: string, status: TaskStatus) => request<ProjectTask>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
