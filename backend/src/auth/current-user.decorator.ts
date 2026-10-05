import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from './auth.types';

// Декоратор не приймає власних даних: він дістає AuthenticatedUser з HTTP-запиту,
// куди користувача попередньо записує JWT guard/strategy, і повертає його параметру контролера.
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthenticatedUser => context.switchToHttp().getRequest<{ user: AuthenticatedUser }>().user);
