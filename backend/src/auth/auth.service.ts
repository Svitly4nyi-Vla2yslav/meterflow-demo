import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email }, select: { id: true } })) throw new ConflictException('Für diese E-Mail-Adresse existiert bereits ein Konto.');
    try {
      const user = await this.prisma.user.create({ data: { firstName: dto.firstName.trim(), lastName: dto.lastName.trim(), email, passwordHash: await bcrypt.hash(dto.password, 12) } });
      return this.createSession(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('Für diese E-Mail-Adresse existiert bereits ein Konto.');
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('E-Mail-Adresse oder Passwort ist ungültig.');
    return this.createSession(user);
  }

  async findSafeUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException('Benutzerkonto wurde nicht gefunden.');
    return this.toSafeUser(user);
  }

  private createSession(user: User) {
    return { accessToken: this.jwt.sign({ sub: user.id, email: user.email }), user: this.toSafeUser(user) };
  }

  private toSafeUser({ passwordHash: _passwordHash, ...user }: User) { return user; }
}
