import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class GenerateSpeechDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsIn(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'])
  voice?: string;

  @IsOptional()
  @IsIn(['mp3', 'opus', 'aac', 'flac'])
  format?: string;
}

export class GenerateSpeechWithEmotionDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsIn(['neutral', 'happy', 'sad', 'excited', 'calm'])
  emotion?: string;
}

export class GenerateSpeechForConversationDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  isUserSpeaking?: boolean;
}
