import { UUID } from 'crypto';

export interface AuthResponse {
  access_token: string;
  user: {
    id: UUID;
    name: string;
    username: string;
    email: string;
  };
}
