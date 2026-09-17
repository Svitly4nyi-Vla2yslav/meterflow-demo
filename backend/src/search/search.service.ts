import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const q = query.trim().slice(0, 80);
    if (q.length < 2) return { projects: [], tasks: [], documents: [] };
    const contains = { contains: q, mode: 'insensitive' as const };
    const [projects, tasks, documents] = await Promise.all([
      this.prisma.project.findMany({ where: { OR: [{ name: contains }, { city: contains }, { address: contains }] }, take: 6, orderBy: { updatedAt: 'desc' } }),
      this.prisma.task.findMany({ where: { title: contains }, include: { project: { select: { id: true, name: true } } }, take: 6, orderBy: { updatedAt: 'desc' } }),
      this.prisma.document.findMany({ where: { OR: [{ name: contains }, { originalName: contains }] }, include: { project: { select: { id: true, name: true } } }, take: 6, orderBy: { createdAt: 'desc' } }),
    ]);
    return { projects, tasks, documents };
  }
}
