import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './auth.types';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  /** Отримує сервіс, якому контролер делегує реєстрацію та вхід. */
  constructor(private readonly auth: AuthService) {}

  /** Приймає валідований RegisterDto і повертає результат реєстрації сервісу. */
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

  /** Приймає валідований LoginDto і повертає створену сервісом авторизаційну відповідь. */
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  /** Повертає користувача з JWT-контексту; JwtAuthGuard відхиляє неавторизований запит. */
  @UseGuards(JwtAuthGuard) @Get('me') me(@CurrentUser() user: AuthenticatedUser) { return user; }
}
