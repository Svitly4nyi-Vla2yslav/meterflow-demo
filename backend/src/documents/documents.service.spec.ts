import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

const pdf = {
  originalname: 'contract.pdf',
  mimetype: 'application/octet-stream',
  buffer: Buffer.from('%PDF-1.7'),
  size: 8,
} as Express.Multer.File;

describe('DocumentsService', () => {
  const prisma = {
    project: { findUnique: jest.fn(), count: jest.fn() },
    document: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
  };
  const storage = { put: jest.fn(), get: jest.fn(), remove: jest.fn() };
  const service = new DocumentsService(prisma as never, storage as never);

  beforeEach(() => jest.clearAllMocks());

  it('creates document metadata linked to its project and uploader', async () => {
    prisma.project.findUnique.mockResolvedValue({ id: 'project-1' });
    prisma.document.create.mockImplementation(async ({ data }) => ({ id: 'document-1', ...data }));

    const result = await service.create({ projectId: 'project-1', name: 'Contract' }, pdf, 'user-1');

    expect(storage.put).toHaveBeenCalledWith(expect.stringMatching(/^project-1\/.+\.pdf$/), pdf.buffer, expect.objectContaining({ mimeType: 'application/pdf' }));
    expect(prisma.document.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ projectId: 'project-1', uploadedById: 'user-1', originalName: 'contract.pdf' }) }));
    expect(result).toMatchObject({ projectId: 'project-1', uploadedById: 'user-1' });
  });

  it('lists only documents belonging to the requested project', async () => {
    prisma.project.count.mockResolvedValue(1);
    prisma.document.findMany.mockResolvedValue([]);

    await service.findByProject('project-1');

    expect(prisma.document.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { projectId: 'project-1' } }));
  });

  it('removes file bytes before deleting document metadata', async () => {
    prisma.document.findUnique.mockResolvedValue({ id: 'document-1', storageKey: 'project-1/file.pdf' });
    const order: string[] = [];
    storage.remove.mockImplementation(async () => { order.push('storage'); });
    prisma.document.delete.mockImplementation(async () => { order.push('metadata'); });

    await expect(service.remove('document-1')).resolves.toEqual({ deleted: true });
    expect(order).toEqual(['storage', 'metadata']);
  });

  it('protects every document endpoint with the JWT guard', () => {
    expect(Reflect.getMetadata(GUARDS_METADATA, DocumentsController)).toContain(JwtAuthGuard);
  });
});
