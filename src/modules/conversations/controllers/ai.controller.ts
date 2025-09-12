import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechToTextService } from '../services/ai/speech-to-text.service';
import { TextToSpeechService } from '../services/ai/text-to-speech.service';
import { ChatService } from '../services/ai/chat.service';
import type { Response } from 'express';
import type { Multer } from 'multer';
import type { AIResponse } from '../interfaces/conversation.interface';
import type { ChatScenario } from '../services/ai/chat.service';

@Controller('ai')
export class AIController {
  constructor(
    private readonly speechToTextService: SpeechToTextService,
    private readonly textToSpeechService: TextToSpeechService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  getAIHello(): string {
    return 'AI Services are running!';
  }

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  async transcribeAudio(
    @UploadedFile() file: Multer.File,
    @Body('details') details?: boolean,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    try {
      if (details) {
        const result =
          await this.speechToTextService.transcribeAudioWithDetails(
            file.buffer,
            file.originalname,
          );
        return { success: true, data: result };
      } else {
        const transcription = await this.speechToTextService.transcribeAudio(
          file.buffer,
          file.originalname,
        );
        return { success: true, transcription };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('tts')
  async textToSpeech(
    @Body('text') text: string,
    @Body('model') model?: string,
    @Body('voice') voice?: string,
    @Body('format') format?: string,
    @Body('speed') speed?: number,
    @Res() res?: Response,
  ): Promise<any> {
    if (!text) {
      throw new BadRequestException('No text provided');
    }

    try {
      const audioBuffer = await this.textToSpeechService.generateSpeech(
        text,
        model,
        voice,
        format,
        speed,
      );

      // If response object is provided, send the audio file directly
      if (res) {
        res.set({
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'attachment; filename="speech.mp3"',
        });
        return res.send(audioBuffer);
      }

      // Otherwise, return base64 encoded audio
      return {
        success: true,
        audio: audioBuffer.toString('base64'),
        format: format || 'mp3',
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('chat')
  async chat(
    @Body('message') message: string,
    @Body('scenario') scenario: ChatScenario = 'local-buddy',
    @Body('action') action?: string,
  ): Promise<any> {
    // Initialize conversation if needed
    if (action === 'reset' || !this.chatService.getCurrentStep()) {
      this.chatService.initializeConversation(scenario);
      return {
        message: `Conversation reset. Let's start over with ${scenario} scenario!`,
        step: this.chatService.getCurrentStep(),
        scenario: scenario,
      };
    }

    if (!message) {
      // If no message, return welcome message with current step
      const currentStep = this.chatService.getCurrentStep();
      return {
        message: `Welcome to the ${scenario} conversation practice!`,
        step: currentStep,
        scenario: scenario,
        instruction: 'Please send a message to start the conversation.',
      };
    }

    try {
      const aiResponse: AIResponse =
        await this.chatService.processUserInput(message);

      const response = {
        user_message: message,
        ai_response: aiResponse.ai_response,
        meta: aiResponse.meta,
        current_step: this.chatService.getCurrentStep(),
        is_complete: this.chatService.isConversationComplete(),
        scenario: scenario,
        progress: this.chatService.getConversationProgress(),
      };

      // Advance to next step if conversation is not complete
      if (!this.chatService.isConversationComplete()) {
        this.chatService.advanceToNextStep();
      }

      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('scenarios')
  getAvailableScenarios(): any {
    return {
      available_scenarios: this.chatService.getAvailableScenarios(),
    };
  }

  @Get('voices')
  getAvailableVoices(): any {
    return {
      success: true,
      voices: [
        { name: 'alloy', gender: 'neutral', description: 'Neutral and clear' },
        { name: 'echo', gender: 'male', description: 'Confident and mature' },
        { name: 'fable', gender: 'male', description: 'Warm and friendly' },
        { name: 'onyx', gender: 'male', description: 'Deep and smooth' },
        { name: 'nova', gender: 'female', description: 'Clear and expressive' },
        { name: 'shimmer', gender: 'female', description: 'Soft and calm' },
      ],
    };
  }

  @Get('models')
  getAvailableModels(): any {
    return {
      success: true,
      models: [
        {
          name: 'tts-1',
          description: 'Optimized for real-time text-to-speech',
        },
        { name: 'tts-1-hd', description: 'Optimized for quality' },
        { name: 'whisper-1', description: 'Speech recognition model' },
      ],
    };
  }
}
