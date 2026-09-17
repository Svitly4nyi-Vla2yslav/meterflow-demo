import { BadRequestException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  const projectFindUnique = jest.fn();
  const taskFindUnique = jest.fn();
  const taskCreate = jest.fn();
  const taskUpdate = jest.fn();
  const prisma = {
    project: { findUnique: projectFindUnique },
    task: { findUnique: taskFindUnique, create: taskCreate, update: taskUpdate },
  } as unknown as PrismaService;
  const service = new TasksService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('creates an open task for a project', async () => {
    projectFindUnique.mockResolvedValue({ id: 'project-1' });
    taskCreate.mockResolvedValue({ id: 'task-1', title: 'Anmeldung prüfen', status: TaskStatus.OPEN });
    const dto = { title: 'Anmeldung prüfen', status: TaskStatus.OPEN, dueDate: '2026-10-20T00:00:00.000Z' };
    await expect(service.create('project-1', dto)).resolves.toMatchObject({ id: 'task-1' });
    expect(taskCreate).toHaveBeenCalledWith({ data: { ...dto, dueDate: new Date(dto.dueDate), projectId: 'project-1' } });
  });

  it('updates a task status', async () => {
    taskFindUnique.mockResolvedValue({ id: 'task-1' });
    taskUpdate.mockResolvedValue({ id: 'task-1', status: TaskStatus.DONE });
    await expect(service.update('task-1', { status: TaskStatus.DONE })).resolves.toMatchObject({ status: TaskStatus.DONE });
    expect(taskUpdate).toHaveBeenCalledWith({ where: { id: 'task-1' }, data: { status: TaskStatus.DONE, dueDate: undefined } });
  });

  it('rejects an empty task update', async () => {
    await expect(service.update('task-1', {})).rejects.toBeInstanceOf(BadRequestException);
  });
});
