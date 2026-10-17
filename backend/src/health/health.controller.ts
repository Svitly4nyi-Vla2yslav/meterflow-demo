import { Controller, Get } from '@nestjs/common';

/**
 * Надає легкий публічний маршрут для перевірки доступності backend без звернення до сховищ даних.
 */
@Controller('health')
export class HealthController {
  /** Повертає стабільний статус ok для HTTP GET /health. */
  @Get()
  check() { return { status: 'ok' }; }
}
