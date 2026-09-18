import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://meterflow-demo.netlify.app',
]);

const netlifyDeployOrigin = /^https:\/\/[a-z0-9][a-z0-9-]*--meterflow-demo\.netlify\.app$/i;

export function isAllowedOrigin(origin: string | undefined) {
  return !origin || allowedOrigins.has(origin) || netlifyDeployOrigin.test(origin);
}

const corsOrigin: CustomOrigin = (origin, callback) => callback(null, isAllowedOrigin(origin));

export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: corsOrigin,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  return app;
}
