import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    // Get the private key from environment variable and format it correctly
    const privateKey = configService.get<string>('APPLE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      privateKeyString: privateKey, // Use the private key directly
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
      scope: ['email', 'name'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, email } = profile;
      
      // First, try to find user by Apple ID
      let user = await this.authService.findByAppleId(profile.id);
      
      // If user not found by Apple ID but email exists, try to find by email
      if (!user && email) {
        user = await this.authService.findByEmail(email);
        
        // If user exists but doesn't have Apple ID, update it
        if (user && !user.appleId) {
          user = await this.authService.update(user.id, { appleId: profile.id });
        }
      }
      
      // If user still not found, create a new one
      if (!user) {
        const base = email ? email.split('@')[0] : 'user';

        user = await this.authService.create({
          email,
          first_name: name ? (name.givenName || base) : base,
          last_name: name ? (name.familyName || '') : '',
          password: Math.random().toString(36), // Random password as it's required
          appleId: profile.id,
        });
      }
      
      // Generate JWT token
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      
      return done(null, {
        access_token,
        user: {
          id: user.id,
          first_name: user.first_name ?? null,
          last_name: user.last_name ?? null,
          email: user.email,
        },
      });
    } catch (err) {
      return done(err);
    }
  }
}
