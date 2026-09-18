import { ProjectStatus } from '../../../../generated/prisma';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() address: string;
  @IsInt() @IsPositive() units: number;
  @IsInt() @IsPositive() pvPower: number;
  @IsEnum(ProjectStatus) status: ProjectStatus;
}
