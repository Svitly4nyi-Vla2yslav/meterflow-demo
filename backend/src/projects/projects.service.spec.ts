import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectStatus } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  const findUnique = jest.fn();
  const create = jest.fn();
  const update = jest.fn();
  const prisma = { project: { findUnique, create, update } } as unknown as PrismaService;
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

  it('creates a project', async () => {
    const dto = { name: 'Hafenblick', address: 'Am Kai 1', city: 'Hamburg', units: 20, pvPower: 40, status: ProjectStatus.INQUIRY };
    create.mockResolvedValue({ id: 'project-2', ...dto });
    await expect(service.create(dto)).resolves.toMatchObject({ id: 'project-2', name: 'Hafenblick' });
    expect(create).toHaveBeenCalledWith({ data: dto });
  });

  it('updates an existing project', async () => {
    findUnique.mockResolvedValue({ id: 'project-1' });
    update.mockResolvedValue({ id: 'project-1', name: 'Sonnenhof Neu' });
    await expect(service.update('project-1', { name: 'Sonnenhof Neu' })).resolves.toMatchObject({ name: 'Sonnenhof Neu' });
    expect(update).toHaveBeenCalledWith({ where: { id: 'project-1' }, data: { name: 'Sonnenhof Neu' } });
  });

  it('rejects an empty project update', async () => {
    await expect(service.update('project-1', {})).rejects.toBeInstanceOf(BadRequestException);
  });
});
