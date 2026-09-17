export type ProjectStatus =
  | 'INQUIRY'
  | 'ECONOMIC_CHECK'
  | 'CONTRACT'
  | 'METERING_CONCEPT'
  | 'GRID_REGISTRATION'
  | 'INSTALLATION'
  | 'COMMISSIONING'
  | 'BILLING'
  | 'COMPLETED';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Project {
  id: string;
  name: string;
  city: string;
  address: string;
  units: number;
  pvPower: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  name: string;
  city: string;
  address: string;
  units: number;
  pvPower: number;
  status?: ProjectStatus;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  project?: Pick<Project, 'id' | 'name'>;
}

export interface TaskInput {
  title: string;
  dueDate: string;
  status?: TaskStatus;
}

export type UserRole = 'DEVELOPER' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse { accessToken: string; user: User }
export interface LoginInput { email: string; password: string }
export interface RegisterInput extends LoginInput { firstName: string; lastName: string }

export interface DocumentRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  projectId: string;
  uploadedById: string;
  project: Pick<Project, 'id' | 'name'>;
  uploadedBy: Pick<User, 'id' | 'firstName' | 'lastName'>;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResults {
  projects: Project[];
  tasks: ProjectTask[];
  documents: DocumentRecord[];
}
