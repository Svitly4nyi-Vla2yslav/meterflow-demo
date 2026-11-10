import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Реалізує реєстрацію, вхід і безпечне читання профілю через Prisma та JWT.
 * Пароль ніколи не повертається клієнту: всі відповіді проходять через toSafeUser.
 */
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  /**
   * Нормалізує email, перевіряє дубль, хешує пароль bcrypt із cost 12 і створює сесію.
   *
   * @throws ConflictException для попередньо знайденого або конкурентно створеного email.
   */
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

  /** Перевіряє email і пароль та повертає JWT із безпечним профілем. */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('E-Mail-Adresse oder Passwort ist ungültig.');
    return this.createSession(user);
  }

  /** Завантажує користувача за id і вилучає passwordHash перед поверненням. */
  async findSafeUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException('Benutzerkonto wurde nicht gefunden.');
    return this.toSafeUser(user);
  }

  /** Підписує JWT із sub/email та додає очищений профіль. */
  private createSession(user: User) {
    return { accessToken: this.jwt.sign({ sub: user.id, email: user.email }), user: this.toSafeUser(user) };
  }

  /** Відкидає passwordHash через деструктуризацію без мутації об’єкта Prisma. */
  private toSafeUser({ passwordHash: _passwordHash, ...user }: User) { return user; }
}
