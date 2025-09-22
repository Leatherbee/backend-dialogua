import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @IsString()
  role: string;

  @IsString()
  content: string;
}

export class SendMessageDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  context?: string;
}

export class SendMessageWithHistoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @IsOptional()
  @IsString()
  context?: string;
}
