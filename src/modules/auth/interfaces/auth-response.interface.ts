export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
  };
}
