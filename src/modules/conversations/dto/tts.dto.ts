import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateSpeechDto {
  @ApiProperty({
    description: 'Text to convert to speech',
    example: 'Hello, this is a test message for text-to-speech conversion.',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Voice to use for speech generation',
    enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    example: 'alloy',
    required: false,
  })
  @IsOptional()
  @IsIn(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'])
  voice?: string;

  @ApiProperty({
    description: 'Audio format for the generated speech',
    enum: ['mp3', 'opus', 'aac', 'flac'],
    example: 'mp3',
    required: false,
  })
  @IsOptional()
  @IsIn(['mp3', 'opus', 'aac', 'flac'])
  format?: string;
}

export class GenerateSpeechWithEmotionDto {
  @ApiProperty({
    description: 'Text to convert to speech with emotion',
    example: 'I am so excited about this new feature!',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Emotional tone for the speech',
    enum: ['neutral', 'happy', 'sad', 'excited', 'calm'],
    example: 'excited',
    required: false,
  })
  @IsOptional()
  @IsIn(['neutral', 'happy', 'sad', 'excited', 'calm'])
  emotion?: string;
}

export class GenerateSpeechForConversationDto {
  @ApiProperty({
    description: 'Text to convert to speech for conversation',
    example: 'Thank you for your question. Let me help you with that.',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Whether the speaker is the user or the assistant',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isUserSpeaking?: boolean;
}

export class ChatToSpeechDto {
  @ApiProperty({
    description: 'User message to send to AI and convert response to speech',
    example: 'Hello, can you help me learn English?',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Conversation ID to maintain context across multiple messages',
    example: 'conv_12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiProperty({
    description:
      'System message to set AI behavior (only used when starting new conversation)',
    example:
      'Kamu adalah AI tutor yang ramah dan membantu belajar bahasa Indonesia.',
    required: false,
  })
  @IsOptional()
  @IsString()
  systemMessage?: string;

  @ApiProperty({
    description:
      'Optional context for the AI conversation (deprecated, use conversationId instead)',
    example: 'You are an English language tutor helping a beginner student.',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiProperty({
    description: 'Voice to use for speech generation',
    enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    example: 'alloy',
    required: false,
  })
  @IsOptional()
  @IsIn(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'])
  voice?: string;

  @ApiProperty({
    description: 'Audio format for the generated speech',
    enum: ['mp3', 'opus', 'aac', 'flac'],
    example: 'mp3',
    required: false,
  })
  @IsOptional()
  @IsIn(['mp3', 'opus', 'aac', 'flac'])
  format?: string;
}
