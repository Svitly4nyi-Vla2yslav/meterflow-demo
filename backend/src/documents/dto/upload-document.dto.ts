import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @MinLength(1)
  projectId: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;
}
