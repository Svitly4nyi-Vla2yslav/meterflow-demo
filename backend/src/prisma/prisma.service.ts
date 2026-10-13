import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Створює PostgreSQL-адаптер із обов'язкового DATABASE_URL і передає його PrismaClient.
   * Якщо змінної немає, ConfigService зупиняє запуск до спроби підключення до БД.
   */
  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
    });
    super({ adapter });
  }

  /** Відкриває з'єднання Prisma під час ініціалізації NestJS-модуля. */
  async onModuleInit() { await this.$connect(); }

  /** Коректно закриває з'єднання Prisma під час завершення роботи модуля. */
  async onModuleDestroy() { await this.$disconnect(); }
}
