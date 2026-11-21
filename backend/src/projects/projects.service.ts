import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  /** Отримує PrismaService через контейнер NestJS; конструктор сам не звертається до бази. */
  constructor(private readonly prisma: PrismaService) {}

  /** Повертає всі проєкти, відсортовані від найранішої дати створення. */
  findAll() { return this.prisma.project.findMany({ orderBy: { createdAt: 'asc' } }); }

  /** Повертає проєкт за id або кидає NotFoundException, якщо запису немає. */
  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }
  /** Створює проєкт із перевіреного DTO та повертає збережений запис. */
  create(dto: CreateProjectDto) { return this.prisma.project.create({ data: dto }); }

  /**
   * Оновлює наявний проєкт за id і повертає новий стан запису.
   * Порожній DTO відхиляється до звернення на update; `findOne` окремо гарантує зрозумілий 404.
   */
  async update(id: string, dto: UpdateProjectDto) {
    if (Object.keys(dto).length === 0) throw new BadRequestException('At least one project field is required');
    await this.findOne(id);
    return this.prisma.project.update({ where: { id }, data: dto });
  }
}
