import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ProjectStatus, TaskStatus } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const projects = [
  { id: 'sonnenhof', name: 'Sonnenhof', city: 'Hamburg', address: 'Musterstraße 12, 20095 Hamburg', units: 18, pvPower: 32, status: ProjectStatus.METERING_CONCEPT },
  { id: 'elbquartier', name: 'Elbquartier', city: 'Hamburg', address: 'Hafenallee 8, 20457 Hamburg', units: 36, pvPower: 74, status: ProjectStatus.INSTALLATION },
  { id: 'lindenhof', name: 'Lindenhof', city: 'Hannover', address: 'Lindenweg 24, 30159 Hannover', units: 12, pvPower: 22, status: ProjectStatus.GRID_REGISTRATION },
  { id: 'parkstrasse', name: 'Parkstraße', city: 'Hildesheim', address: 'Parkstraße 7, 31134 Hildesheim', units: 24, pvPower: 48, status: ProjectStatus.CONTRACT },
];

const tasks = [
  { id: 'task-messkonzept', title: 'Messkonzept erstellen', status: TaskStatus.DONE, dueDate: new Date('2026-09-10T12:00:00Z') },
  { id: 'task-netzbetreiber', title: 'Netzbetreiber-Unterlagen senden', status: TaskStatus.IN_PROGRESS, dueDate: new Date('2026-09-22T12:00:00Z') },
  { id: 'task-zaehlerdaten', title: 'Zählerdaten prüfen', status: TaskStatus.OPEN, dueDate: new Date('2026-09-29T12:00:00Z') },
  { id: 'task-elektriker', title: 'Elektriker bestätigen', status: TaskStatus.OPEN, dueDate: new Date('2026-10-03T12:00:00Z') },
  { id: 'task-installation', title: 'Installationstermin planen', status: TaskStatus.OPEN, dueDate: new Date('2026-10-12T12:00:00Z') },
];

async function main() {
  const passwordHash = await bcrypt.hash('MeterFlow2026!', 12);
  await prisma.user.upsert({
    where: { email: 'demo@meterflow.local' },
    update: { firstName: 'Vladyslav', lastName: 'Svitlychnyi', passwordHash, role: 'DEVELOPER' },
    create: { firstName: 'Vladyslav', lastName: 'Svitlychnyi', email: 'demo@meterflow.local', passwordHash, role: 'DEVELOPER' },
  });
  for (const project of projects) await prisma.project.upsert({ where: { id: project.id }, update: project, create: project });
  for (const task of tasks) await prisma.task.upsert({ where: { id: task.id }, update: { ...task, projectId: 'sonnenhof' }, create: { ...task, projectId: 'sonnenhof' } });
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
