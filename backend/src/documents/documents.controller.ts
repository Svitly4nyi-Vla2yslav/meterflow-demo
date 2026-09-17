import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get('documents') findAll() { return this.documents.findAll(); }
  @Get('projects/:projectId/documents') findByProject(@Param('projectId') projectId: string) { return this.documents.findByProject(projectId); }

  @Post('documents')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024, files: 1 } }))
  create(@Body() dto: UploadDocumentDto, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: AuthenticatedUser) {
    return this.documents.create(dto, file, user.id);
  }

  @Get('documents/:id/download')
  async download(@Param('id') id: string, @Res() response: Response) {
    const { document, data } = await this.documents.download(id);
    const safeName = document.originalName.replace(/["\\\r\n]/g, '_');
    response.setHeader('Content-Type', document.mimeType);
    response.setHeader('Content-Length', data.length);
    response.setHeader('Content-Disposition', `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`);
    response.send(data);
  }

  @Delete('documents/:id') remove(@Param('id') id: string) { return this.documents.remove(id); }
}
