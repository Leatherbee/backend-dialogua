export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}
