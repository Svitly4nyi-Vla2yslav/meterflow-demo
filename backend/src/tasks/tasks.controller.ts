import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  /** Отримує TasksService через механізм залежностей NestJS. */
  constructor(private readonly tasks: TasksService) {}

  /** Повертає всі завдання, делегуючи читання сервісу без перетворення результату. */
  @Get() findAll() { return this.tasks.findAll(); }

  /** Частково оновлює завдання за id даними UpdateTaskDto та повертає результат сервісу. */
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.tasks.update(id, dto); }
}

