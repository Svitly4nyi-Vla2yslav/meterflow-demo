import { TaskStatus } from '../../../../generated/prisma';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString() @IsNotEmpty() title: string;
  @IsEnum(TaskStatus) status: TaskStatus;
  @IsDateString() dueDate: string;
}
