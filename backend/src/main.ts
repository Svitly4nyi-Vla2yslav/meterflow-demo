import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

/**
 * Створює локальний NestJS-застосунок зі спільною конфігурацією та починає слухати
 * `PORT` або 3000. Promise навмисно запускається через `void` у модульній точці входу.
 */
async function bootstrap() {
  const app = configureApp(await NestFactory.create(AppModule));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
