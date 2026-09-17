import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  const findUnique = jest.fn();
  const prisma = { project: { findUnique } } as unknown as PrismaService;
  const service = new ProjectsService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('returns an existing project', async () => {
    findUnique.mockResolvedValue({ id: 'project-1', name: 'Sonnenhof' });
    await expect(service.findOne('project-1')).resolves.toMatchObject({ name: 'Sonnenhof' });
  });

  it('throws for a missing project', async () => {
    findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
