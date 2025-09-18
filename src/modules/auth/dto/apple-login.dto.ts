import { IsNotEmpty, IsString } from 'class-validator';

export class AppleLoginDto {
  @IsString()
  @IsNotEmpty()
  token: string; // Could be id_token (JWT) or authorization code
}
