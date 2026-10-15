import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { TasksService } from '../tasks/tasks.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  /** Отримує сервіси проєктів і завдань через механізм залежностей NestJS. */
  constructor(private readonly projects: ProjectsService, private readonly tasks: TasksService) {}

  /** Повертає всі проєкти, делегуючи читання ProjectsService. */
  @Get() findAll() { return this.projects.findAll(); }

  /** Приймає ідентифікатор проєкту та повертає пов'язані з ним завдання. */
  @Get(':id/tasks') findTasks(@Param('id') id: string) { return this.tasks.findByProject(id); }

  /** Створює завдання в указаному проєкті з перевіреним тілом CreateTaskDto. */
  @Post(':id/tasks') createTask(@Param('id') id: string, @Body() dto: CreateTaskDto) { return this.tasks.create(id, dto); }

  /** Повертає один проєкт за параметром маршруту id. */
  @Get(':id') findOne(@Param('id') id: string) { return this.projects.findOne(id); }

  /** Створює проєкт із даних CreateProjectDto та повертає результат сервісу. */
  @Post() create(@Body() dto: CreateProjectDto) { return this.projects.create(dto); }

  /** Частково оновлює проєкт за id даними UpdateProjectDto. */
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateProjectDto) { return this.projects.update(id, dto); }
}

