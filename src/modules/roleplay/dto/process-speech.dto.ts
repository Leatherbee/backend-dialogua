import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class ProcessSpeechDto {
  @ApiProperty({
    description: 'Base64 encoded audio data or audio file buffer',
    example: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10...',
  })
  @IsNotEmpty()
  @IsString()
  audioData: string;

  @ApiProperty({
    description: 'ID of the roleplay session',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  roleplayId: number;

  @ApiProperty({
    description: 'Language for speech recognition (optional)',
    example: 'en-US',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;
}

export class ProcessSpeechResponseDto {
  @ApiProperty({
    description: 'Transcribed text from the audio',
    example: 'Hello, how are you today?',
  })
  transcribedText: string;

  @ApiProperty({
    description: 'AI response to the transcribed speech',
    example: 'I am doing well, thank you for asking! How can I help you today?',
  })
  aiResponse: string;

  @ApiProperty({
    description: 'Turn order number in the roleplay',
    example: 5,
  })
  turnOrder: number;

  @ApiProperty({
    description: 'Processing metadata',
    example: {
      confidence: 0.95,
      processingTime: 1.2,
      language: 'en-US',
    },
  })
  metadata: {
    confidence: number;
    processingTime: number;
    language: string;
  };
}
