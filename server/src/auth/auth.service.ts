import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { hashData } from 'src/common/utils/hash.util';
import EmailUtil from 'src/common/utils/email.util';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async signIn(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);
    if (!user) throw new UnauthorizedException();
    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!passwordMatches) throw new UnauthorizedException();
    if (!user.isActive) {
      throw new BadRequestException(
        'Your account is locked. Please contact support for assistance.',
      );
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      account: user,
      ...tokens,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    // Check if user exists
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    // const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create(createUserDto);

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return {
      account: newUser,
      ...tokens,
    };
  }

  async logout(userId: string) {
    return await this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    const accessTokenExpiresAt =
      this.calculateExpirationDate(accessTokenExpiresIn);
    const refreshTokenExpiresAt = this.calculateExpirationDate(
      refreshTokenExpiresIn,
    );
    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const seconds = this.parseTimeToSeconds(expiresIn);
    return new Date(now.getTime() + seconds * 1000);
  }

  private parseTimeToSeconds(timeString: string): number {
    // Xử lý các format như: '15m', '1h', '7d', '30s'
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Nếu là số thuần túy, coi như đã là giây
      return parseInt(timeString, 10);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return parseInt(timeString, 10);
    }
  }

  async loginWithGoogle(user: any) {
    let userExists = await this.usersService.findByEmail(user.email);
    if (!userExists) {
      userExists = await this.usersService.create({
        email: user.email,
        password: 'Abcd123!',
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.picture,
      });
    }
    const tokens = await this.getTokens(userExists);
    await this.updateRefreshToken(userExists.id, tokens.refreshToken);
    return {
      account: userExists,
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPassword = this.generatePassword();
    const hashPassword = await hashData(newPassword);
    user.password = hashPassword;
    await this.usersService.update(user.id, user);

    await EmailUtil.sendMail(email, 'Password reset request', '', newPassword);
    return 'Password reset successfully';
  }

  private generatePassword() {
    const length = 10;

    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    const allChars = lowerCase + upperCase + numbers + specialChars;

    let password = [
      lowerCase[Math.floor(Math.random() * lowerCase.length)],
      upperCase[Math.floor(Math.random() * upperCase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    for (let i = password.length; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    password = password.sort(() => 0.5 - Math.random());

    return password.join('');
  }
}
