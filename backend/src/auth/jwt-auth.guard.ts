import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Підключає стандартну Passport-стратегію jwt як NestJS guard.
 * Guard перевіряє Bearer-токен до виклику контролера й передає валідованого користувача в request.user;
 * власної логіки або додаткових побічних ефектів клас не додає.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
