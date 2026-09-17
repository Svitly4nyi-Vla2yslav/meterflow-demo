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
  constructor(private readonly projects: ProjectsService, private readonly tasks: TasksService) {}
  @Get() findAll() { return this.projects.findAll(); }
  @Get(':id/tasks') findTasks(@Param('id') id: string) { return this.tasks.findByProject(id); }
  @Post(':id/tasks') createTask(@Param('id') id: string, @Body() dto: CreateTaskDto) { return this.tasks.create(id, dto); }
  @Get(':id') findOne(@Param('id') id: string) { return this.projects.findOne(id); }
  @Post() create(@Body() dto: CreateProjectDto) { return this.projects.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateProjectDto) { return this.projects.update(id, dto); }
}
