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
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  project?: Pick<Project, 'id' | 'name'>;
}
