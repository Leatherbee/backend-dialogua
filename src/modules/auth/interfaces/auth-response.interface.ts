export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}
