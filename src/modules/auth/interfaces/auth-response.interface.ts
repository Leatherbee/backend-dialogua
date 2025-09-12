export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}
