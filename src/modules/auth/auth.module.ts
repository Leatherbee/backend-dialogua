import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AppleAuthController } from './controllers/apple-auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AppleStrategy } from './strategies/apple.strategy';
import { AppleTokenService } from './services/apple-token.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secretKey',
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, ProfileController, AppleAuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    LocalStrategy, 
    AppleStrategy,
    AppleTokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
