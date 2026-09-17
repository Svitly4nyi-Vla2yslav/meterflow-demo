import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { UserRole } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

describe('AuthController authentication', () => {
  let app: INestApplication; let jwt: JwtService;
  const safeUser = { id: 'user-1', firstName: 'Anna', lastName: 'Solar', email: 'anna@example.com', role: UserRole.DEVELOPER, createdAt: new Date(), updatedAt: new Date() };
  const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ ...safeUser, passwordHash: 'hash' }) } };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule, JwtModule.register({ secret: 'test-secret' })], controllers: [AuthController],
      providers: [AuthService, JwtStrategy, JwtAuthGuard, { provide: ConfigService, useValue: { getOrThrow: () => 'test-secret' } }, { provide: PrismaService, useValue: prisma }],
    }).compile();
    app = module.createNestApplication(); await app.listen(0); jwt = module.get(JwtService);
  });
  afterAll(async () => app.close());

  it('returns the authenticated user from /auth/me', async () => {
    const response = await fetch(`${await app.getUrl()}/auth/me`, { headers: { Authorization: `Bearer ${jwt.sign({ sub: safeUser.id, email: safeUser.email })}` } });
    expect(response.status).toBe(200); expect(await response.json()).toMatchObject({ id: safeUser.id, email: safeUser.email });
  });

  it('rejects a protected route without a token', async () => {
    const response = await fetch(`${await app.getUrl()}/auth/me`);
    expect(response.status).toBe(401);
  });
});
