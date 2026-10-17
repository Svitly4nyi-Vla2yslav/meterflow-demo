import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService } from './search.service';

/**
 * Приймає захищені JWT пошукові запити та делегує фактичний пошук SearchService.
 */
@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  /** Отримує сервіс пошуку через контейнер залежностей NestJS. */
  constructor(private readonly searchService: SearchService) {}
  /** Передає параметр q до сервісу; якщо його немає, використовує порожній рядок. */
  @Get() search(@Query('q') query = '') { return this.searchService.search(query); }
}
