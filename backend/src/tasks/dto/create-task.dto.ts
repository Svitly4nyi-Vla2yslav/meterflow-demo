import { TaskStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString() @IsNotEmpty() title: string;
  @IsEnum(TaskStatus) status: TaskStatus;
  @IsDateString() dueDate: string;
}
