import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  // NestJS передає PrismaService через конструктор; сервіс сам не керує життєвим циклом з’єднання.
  constructor(private readonly prisma: PrismaService) {}

  // Приймає довільний пошуковий рядок і повертає до шести проєктів, задач та документів у кожній групі.
  // Запит обрізається до 80 символів; значення коротші за два символи не звертаються до бази.
  async search(query: string) {
    const q = query.trim().slice(0, 80);
    if (q.length < 2) return { projects: [], tasks: [], documents: [] };
    const contains = { contains: q, mode: 'insensitive' as const };
    // Три незалежні нечутливі до регістру запити виконуються паралельно для меншої загальної затримки.
    const [projects, tasks, documents] = await Promise.all([
      this.prisma.project.findMany({ where: { OR: [{ name: contains }, { city: contains }, { address: contains }] }, take: 6, orderBy: { updatedAt: 'desc' } }),
      this.prisma.task.findMany({ where: { title: contains }, include: { project: { select: { id: true, name: true } } }, take: 6, orderBy: { updatedAt: 'desc' } }),
      this.prisma.document.findMany({ where: { OR: [{ name: contains }, { originalName: contains }] }, include: { project: { select: { id: true, name: true } } }, take: 6, orderBy: { createdAt: 'desc' } }),
    ]);
    // Результат зберігає окремі типізовані групи й додає мінімальні дані пов’язаного проєкту.
    return { projects, tasks, documents };
  }
}
