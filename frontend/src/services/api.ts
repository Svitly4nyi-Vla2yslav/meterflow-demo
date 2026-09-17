import type { AuthResponse, LoginInput, Project, ProjectInput, ProjectStatus, ProjectTask, RegisterInput, TaskInput, TaskStatus, User } from '../types';
import { clearAccessToken, getAccessToken, notifyUnauthorized } from './auth-token';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

interface ApiErrorBody { message?: string | string[] }

async function request<T>(path: string, init?: RequestInit, requiresAuth = true): Promise<T> {
  let response: Response;
  try {
    const token = getAccessToken();
    response = await fetch(`${API_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers } });
  } catch {
    throw new Error('Die API ist nicht erreichbar. Bitte prüfe, ob das Backend läuft.');
  }
  if (!response.ok) {
    if (response.status === 401 && requiresAuth) { clearAccessToken(); notifyUnauthorized(); }
    const body = await response.json().catch(() => null) as ApiErrorBody | null;
    const detail = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
    throw new Error(detail || `Die Anfrage ist fehlgeschlagen (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  register: (data: RegisterInput) => request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }, false),
  login: (data: LoginInput) => request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }, false),
  getMe: () => request<User>('/auth/me'),
  getProjects: () => request<Project[]>('/projects'),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  createProject: (data: ProjectInput) => request<Project>('/projects', { method: 'POST', body: JSON.stringify({ ...data, status: 'INQUIRY' }) }),
  updateProject: (id: string, data: Partial<ProjectInput> | { status: ProjectStatus }) => request<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getProjectTasks: (id: string) => request<ProjectTask[]>(`/projects/${id}/tasks`),
  getTasks: () => request<ProjectTask[]>('/tasks'),
  createTask: (projectId: string, data: TaskInput) => request<ProjectTask>(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify({ ...data, status: data.status ?? 'OPEN' }) }),
  updateTaskStatus: (id: string, status: TaskStatus) => request<ProjectTask>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
