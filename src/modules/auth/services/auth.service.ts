import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../users/user.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../../users/entities/user.entity';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const token =
      await this.refreshTokenRepository.findRefreshToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Expired refresh token');
    }

    return this.generateAuthResponse(token.user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | null> {
    return this.userService.findOne(payload.sub);
  }

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshTokenEntity =
      await this.refreshTokenRepository.createRefreshToken(
        user,
        365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
      );

    return {
      access_token: accessToken,
      refresh_token: refreshTokenEntity.token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  }
}
