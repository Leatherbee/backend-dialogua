import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    description: 'Role of the message sender',
    example: 'user',
    enum: ['user', 'assistant', 'system'],
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how are you?',
  })
  @IsString()
  content: string;
}

export class SendMessageDto {
  @ApiProperty({
    description: 'Message to send to the AI',
    example: 'What is the weather like today?',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Optional context for the conversation',
    example: 'We are discussing weather patterns',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}

export class SendMessageWithHistoryDto {
  @ApiProperty({
    description: 'Array of previous messages in the conversation',
    type: [ChatMessageDto],
    example: [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there! How can I help you?' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @ApiProperty({
    description: 'Optional context for the conversation',
    example: 'Continuing our previous discussion',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}
