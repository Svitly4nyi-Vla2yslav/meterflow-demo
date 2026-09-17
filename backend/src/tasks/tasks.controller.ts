import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Get() findAll() { return this.tasks.findAll(); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.tasks.update(id, dto); }
}
