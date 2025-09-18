import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

export type VerifiedAppleUser = {
  appleUserId: string;
  email?: string | null;
};

@Injectable()
export class AppleTokenService {
  private readonly appleKeysURL = new URL('https://appleid.apple.com/auth/keys');

  constructor(private readonly configService: ConfigService) {}

  // Verify an Apple id_token (JWT) using Apple's JWKs and validate audience
  async verifyIdToken(idToken: string): Promise<VerifiedAppleUser> {
    const clientId = this.configService.get<string>('APPLE_CLIENT_ID');
    if (!clientId) {
      throw new Error('Missing APPLE_CLIENT_ID');
    }

    const JWKS = createRemoteJWKSet(this.appleKeysURL);
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: 'https://appleid.apple.com',
      audience: clientId,
    });

    return this.mapPayload(payload);
  }

  // Main entry: if token looks like a JWT (id_token), verify via JWKS
  // Otherwise, (authorization code) you could implement code-exchange here if needed.
  async verify(token: string): Promise<VerifiedAppleUser> {
    if (token.split('.').length === 3) {
      return this.verifyIdToken(token);
    }
    throw new Error('Unsupported Apple token format. Expecting id_token JWT.');
  }

  private mapPayload(payload: JWTPayload): VerifiedAppleUser {
    const sub = payload.sub as string;
    const email = (payload as any).email as string | undefined;
    return { appleUserId: sub, email: email ?? null };
  }
}
