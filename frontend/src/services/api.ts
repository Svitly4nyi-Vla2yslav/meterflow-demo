import type { AuthResponse, DocumentRecord, LoginInput, Project, ProjectInput, ProjectStatus, ProjectTask, RegisterInput, SearchResults, TaskInput, TaskStatus, User } from '../types';
import { clearAccessToken, getAccessToken, notifyUnauthorized } from './auth-token';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (
  import.meta.env.MODE === 'development'
    ? (configuredApiUrl || 'http://localhost:3000/api')
    : '/api'
).replace(/\/$/, '');

interface ApiErrorBody { message?: string | string[] }

async function request<T>(path: string, init?: RequestInit, requiresAuth = true): Promise<T> {
  let response: Response;
  try {
    const token = getAccessToken();
    const headers = new Headers(init?.headers);
    if (!(init?.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    if (requiresAuth && token) headers.set('Authorization', `Bearer ${token}`);
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
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
  getDocuments: () => request<DocumentRecord[]>('/documents'),
  getProjectDocuments: (id: string) => request<DocumentRecord[]>(`/projects/${id}/documents`),
  deleteDocument: (id: string) => request<{ deleted: true }>(`/documents/${id}`, { method: 'DELETE' }),
  search: (query: string) => request<SearchResults>(`/search?q=${encodeURIComponent(query)}`),
  uploadDocument: (formData: FormData, onProgress?: (value: number) => void) => new Promise<DocumentRecord>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/documents`);
    const token = getAccessToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (event) => event.lengthComputable && onProgress?.(Math.round(event.loaded / event.total * 100));
    xhr.onerror = () => reject(new Error('Die API ist nicht erreichbar. Bitte prüfe, ob das Backend läuft.'));
    xhr.onload = () => {
      if (xhr.status === 401) { clearAccessToken(); notifyUnauthorized(); }
      const body = (() => { try { return JSON.parse(xhr.responseText) as DocumentRecord & ApiErrorBody; } catch { return null; } })();
      if (xhr.status >= 200 && xhr.status < 300 && body) resolve(body);
      else { const detail = Array.isArray(body?.message) ? body.message.join(' ') : body?.message; reject(new Error(detail || `Der Upload ist fehlgeschlagen (${xhr.status}).`)); }
    };
    xhr.send(formData);
  }),
  downloadDocument: async (id: string) => {
    const token = getAccessToken();
    const response = await fetch(`${API_URL}/documents/${id}/download`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!response.ok) throw new Error('Das Dokument konnte nicht geladen werden.');
    return response.blob();
  },
};
