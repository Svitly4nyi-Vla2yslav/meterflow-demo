import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  /** Повертає всі задачі за dueDate разом із мінімальними id/name даними пов'язаного проєкту. */
  findAll() {
    return this.prisma.task.findMany({
      include: { project: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }
  /** Приймає projectId і повертає його задачі за датою; існування самого проєкту окремо не перевіряє. */
  findByProject(projectId: string) { return this.prisma.task.findMany({ where: { projectId }, orderBy: { dueDate: 'asc' } }); }
  /**
   * Перевіряє точне існування проєкту, перетворює dueDate DTO на Date і створює пов'язану задачу.
   * За невідомого projectId кидає NotFoundException; запис у базу є єдиним побічним ефектом успіху.
   */
  async create(projectId: string, dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    return this.prisma.task.create({ data: { ...dto, dueDate: new Date(dto.dueDate), projectId } });
  }
  /**
   * Відхиляє порожній patch, перевіряє задачу та оновлює лише передані поля.
   * dueDate перетворюється на Date тільки коли присутній; невідомий id дає NotFoundException.
   */
  async update(id: string, dto: UpdateTaskDto) {
    if (Object.keys(dto).length === 0) throw new BadRequestException('At least one task field is required');
    const task = await this.prisma.task.findUnique({ where: { id }, select: { id: true } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    const data = { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined };
    return this.prisma.task.update({ where: { id }, data });
  }
}
