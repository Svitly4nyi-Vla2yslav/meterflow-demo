import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { validateDocumentFile } from './document-file.validator';
import { DocumentStorageService } from './document-storage.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

const include = {
  project: { select: { id: true, name: true } },
  uploadedBy: { select: { id: true, firstName: true, lastName: true } },
};

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: DocumentStorageService) {}

  findAll() { return this.prisma.document.findMany({ include, orderBy: { createdAt: 'desc' } }); }

  async findByProject(projectId: string) {
    const exists = await this.prisma.project.count({ where: { id: projectId } });
    if (!exists) throw new NotFoundException(`Project ${projectId} not found`);
    return this.prisma.document.findMany({ where: { projectId }, include, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: UploadDocumentDto, file: Express.Multer.File, uploadedById: string) {
    const project = await this.prisma.project.findUnique({ where: { id: dto.projectId }, select: { id: true } });
    if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);
    const { extension, mimeType } = validateDocumentFile(file);
    const originalName = basename(file.originalname).replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 255);
    const name = (dto.name?.trim() || originalName.replace(/\.[^.]+$/, '')).slice(0, 160);
    const storageKey = `${dto.projectId}/${randomUUID()}${extension}`;
    await this.storage.put(storageKey, file.buffer, { originalName, mimeType, uploadedById });
    try {
      return await this.prisma.document.create({ data: { name, originalName, mimeType, size: file.size, storageKey, projectId: dto.projectId, uploadedById }, include });
    } catch (error) {
      await this.storage.remove(storageKey);
      throw error;
    }
  }

  async download(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException(`Document ${id} not found`);
    return { document, data: await this.storage.get(document.storageKey) };
  }

  async remove(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException(`Document ${id} not found`);
    await this.storage.remove(document.storageKey);
    await this.prisma.document.delete({ where: { id } });
    return { deleted: true };
  }
}
