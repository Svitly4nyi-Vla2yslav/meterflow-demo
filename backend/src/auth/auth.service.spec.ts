import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const findUnique = jest.fn(); const create = jest.fn(); const sign = jest.fn().mockReturnValue('signed-token');
  const prisma = { user: { findUnique, create } } as unknown as PrismaService;
  const service = new AuthService(prisma, { sign } as unknown as JwtService);
  const user = { id: 'user-1', firstName: 'Anna', lastName: 'Solar', email: 'anna@example.com', passwordHash: '', role: UserRole.DEVELOPER, createdAt: new Date(), updatedAt: new Date() };

  beforeEach(() => jest.clearAllMocks());

  it('registers a user and never returns the password hash', async () => {
    findUnique.mockResolvedValue(null); create.mockImplementation(({ data }) => ({ ...user, ...data }));
    const result = await service.register({ firstName: 'Anna', lastName: 'Solar', email: 'ANNA@example.com', password: 'securePass1' });
    expect(result.accessToken).toBe('signed-token'); expect(result.user.email).toBe('anna@example.com'); expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate email registration', async () => {
    findUnique.mockResolvedValue({ id: 'user-1' });
    await expect(service.register({ firstName: 'Anna', lastName: 'Solar', email: 'anna@example.com', password: 'securePass1' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with a valid password', async () => {
    findUnique.mockResolvedValue({ ...user, passwordHash: await bcrypt.hash('securePass1', 4) });
    const result = await service.login({ email: 'anna@example.com', password: 'securePass1' });
    expect(result.accessToken).toBe('signed-token'); expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects an invalid password', async () => {
    findUnique.mockResolvedValue({ ...user, passwordHash: await bcrypt.hash('securePass1', 4) });
    await expect(service.login({ email: 'anna@example.com', password: 'wrongPass1' })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
