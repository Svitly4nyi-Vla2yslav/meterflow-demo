import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  findByProject(projectId: string) { return this.prisma.task.findMany({ where: { projectId }, orderBy: { dueDate: 'asc' } }); }
  async create(projectId: string, dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    return this.prisma.task.create({ data: { ...dto, dueDate: new Date(dto.dueDate), projectId } });
  }
  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id }, select: { id: true } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    const data = { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined };
    return this.prisma.task.update({ where: { id }, data });
  }
}
