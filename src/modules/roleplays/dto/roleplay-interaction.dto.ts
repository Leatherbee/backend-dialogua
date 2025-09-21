import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class RoleplayMessageDto {
  @ApiProperty({
    description: 'User ID who is participating in the roleplay',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Message from the user',
    example: 'Halo, apa kabar?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Session ID for tracking conversation',
    example: 'session-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class RoleplayResponseDto {
  @ApiProperty({
    description: 'Response message (user input or feedback)',
    example: 'Selamat pagi, Bu.',
  })
  message: string;

  @ApiProperty({
    description: 'Turn order in the conversation',
    example: 2,
  })
  turnOrder: number;

  @ApiProperty({
    description: 'Speaker type',
    example: 'user',
  })
  speaker: string;

  @ApiProperty({
    description: 'Whether the user message matched the expected template',
    example: true,
  })
  isMatched: boolean;

  @ApiProperty({
    description: 'Video URL if available',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  videoUrl?: string;

  @ApiProperty({
    description: 'Session ID for tracking conversation',
    example: 'session-123',
    required: false,
  })
  sessionId?: string;

  @ApiProperty({
    description: 'Conversation metadata',
    required: false,
  })
  metadata?: {
    expectedVocabMatched?: string[];
    hintsUsed?: boolean;
    expressions?: Array<{
      sentence: number;
      label: string;
    }>;
    feedback?: string;
  };
}
