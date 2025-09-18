import type { UUID } from 'crypto';

export interface JwtPayload {
  email: string;
  sub: UUID;
}
