import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../users/user.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { AppleTokenService } from './apple-token.service';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly appleTokenService: AppleTokenService,
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

  async logout(refreshToken: string): Promise<{ message: string }> {
    const token =
      await this.refreshTokenRepository.findRefreshToken(refreshToken);

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.refreshTokenRepository.deleteRefreshToken(refreshToken);

    return { message: 'Successfully logged out' };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findByAppleId(appleId: string): Promise<User | null> {
    return this.userService.findByAppleId(appleId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // If password is not provided, generate a random one
    if (!createUserDto.password) {
      createUserDto.password = uuidv4();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with hashed password
    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<User | null> {
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userService.update(id, updateUserDto);
  }

  async validateOrCreateUser(profile: {
    email: string;
    firstName: string;
    lastName: string;
    appleId: string;
  }): Promise<AuthResponse> {
    let user = await this.userService.findByEmail(profile.email);

    if (!user) {
      // Create a new user with Apple authentication
      const tempPassword = uuidv4();

      user = await this.userService.create({
        email: profile.email,
        first_name: profile.firstName || profile.email.split('@')[0],
        last_name: profile.lastName || '',
        password: tempPassword, // This will be hashed in the user service
        appleId: profile.appleId,
      });
    } else if (!user.appleId) {
      // Update existing user with Apple ID if not already set
      user = await this.userService.update(user.id, {
        appleId: profile.appleId,
      });
    }

    // Generate JWT token
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

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
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        email: user.email,
      },
    };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | null> {
    return this.userService.findOne(payload.sub);
  }

  // Login with Apple token similar to the Go example
  async loginWithApple(token: string): Promise<AuthResponse> {
    // 1) Verify Apple token (id_token preferred)
    const verified = await this.appleTokenService.verify(token);

    // 2) Try find by appleId
    let user = await this.userService.findByAppleId(verified.appleUserId);
    if (!user && verified.email) {
      // 3) Try find by email to link appleId
      user = await this.userService.findByEmail(verified.email);
      if (user && !user.appleId) {
        user = await this.userService.update(user.id, {
          appleId: verified.appleUserId,
        });
      }
    }

    // 4) If still not found, create a new user
    if (!user) {
      const email = verified.email ?? undefined;
      const base = email ? email.split('@')[0] : 'user';
      const tempPassword = uuidv4();

      user = await this.userService.create({
        email:
          email ??
          `${base}_${Math.random().toString(36).substring(2, 6)}@example.com`,
        first_name: base,
        last_name: '',
        password: tempPassword,
        appleId: verified.appleUserId,
      } as CreateUserDto);
    }

    // 5) Issue JWT
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

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
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        email: user.email,
      },
    };
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
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        email: user.email,
      },
    };
  }
}
