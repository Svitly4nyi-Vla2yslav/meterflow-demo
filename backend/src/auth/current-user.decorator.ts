import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from './auth.types';

/**
 * Дістає автентифікованого користувача з поточного HTTP-запиту для параметра контролера.
 *
 * @param _data — декоратор не використовує додаткові параметри.
 * @param context — NestJS ExecutionContext, з якого береться request.user.
 * @returns AuthenticatedUser, попередньо записаний JWT strategy/guard.
 * @sideEffects Не змінює запит і не виконує повторну перевірку токена.
 */
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthenticatedUser => context.switchToHttp().getRequest<{ user: AuthenticatedUser }>().user);
