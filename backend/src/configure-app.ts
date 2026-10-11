import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://meterflow-demo.netlify.app',
]);

const netlifyDeployOrigin = /^https:\/\/[a-z0-9][a-z0-9-]*--meterflow-demo\.netlify\.app$/i;

/**
 * Дозволяє запити без Origin, локальний/production домени та Netlify deploy-preview цього сайту.
 * Будь-який інший origin повертає `false` без побічних ефектів.
 */
export function isAllowedOrigin(origin: string | undefined) {
  return !origin || allowedOrigins.has(origin) || netlifyDeployOrigin.test(origin);
}

// Передає результат allowlist-перевірки у callback CORS без створення прикладної помилки.
const corsOrigin: CustomOrigin = (origin, callback) => callback(null, isAllowedOrigin(origin));

/**
 * Налаштовує спільний `/api` prefix, CORS allowlist і глобальну DTO-валідацію NestJS.
 * Невідомі поля забороняються, значення трансформуються, а налаштований застосунок повертається викликачеві.
 */
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: corsOrigin,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  return app;
}
