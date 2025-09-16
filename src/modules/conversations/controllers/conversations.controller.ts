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
import { Readable } from 'stream';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

@Controller('api/v1')
export class ConversationsController {
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
    @Body('sessionId') sessionId: string = 'default',
    @Body('action') action?: string,
  ): Promise<any> {
    // Initialize conversation if needed
    if (action === 'reset') {
      this.chatService.initializeConversation(sessionId, scenario);
      this.chatService.resetConversation(sessionId);
      return {
        message: `Conversation reset. Let's start over with ${scenario} scenario!`,
        scenario: scenario,
      };
    }

    if (!message) {
      return {
        message: `Welcome to the ${scenario} conversation practice!`,
        scenario: scenario,
        instruction: 'Please send a message to start the conversation.',
      };
    }

    try {
      // Ensure session is initialized
      this.chatService.ensureSession(sessionId, scenario);

      const aiResponse: AIResponse = await this.chatService.processUserInput(
        sessionId,
        message,
      );

      const response = {
        user_message: message,
        ai_response: aiResponse.ai_response,
        meta: aiResponse.meta,
        scenario: scenario,
      };

      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('chat/initial')
  async getInitialMessage(
    @Body('scenario') scenario: ChatScenario = 'local-buddy',
    @Body('sessionId') sessionId: string = 'default',
  ): Promise<any> {
    try {
      // Ensure session is initialized for this scenario
      this.chatService.ensureSession(sessionId, scenario);

      const aiResponse: AIResponse =
        await this.chatService.generateInitialMessage(sessionId);

      const response = {
        ai_response: aiResponse.ai_response,
        meta: aiResponse.meta,
        scenario: scenario,
      };

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

  @Post('tts/stream')
  async textToSpeechStream(
    @Body('message') message: string,
    @Res() res: Response,
  ) {
    if (!message) {
      throw new BadRequestException('No message provided');
    }

    const mimeByFormat: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      aac: 'audio/aac',
      flac: 'audio/flac',
      ogg: 'audio/ogg',
      webm: 'audio/webm',
    };

    const format = 'wav';
    const contentType = mimeByFormat[format] || 'audio/wav';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Disposition', `inline; filename="speech.${format}"`);

    res.flushHeaders();

    try {
      const aiResponse = await this.chatService.processUserInput(
        'default',
        message,
      );
      console.log('AI text response:', aiResponse.ai_response);

      let audioStream = await this.textToSpeechService.generateSpeechStream(
        aiResponse.ai_response,
        'gpt-4o-mini-tts',
        'echo',
        format,
        1.0,
      );

      if (!(audioStream instanceof Readable)) {
        console.warn(
          'generateSpeechStream did not return a stream, wrapping buffer instead.',
        );
        audioStream = Readable.from(audioStream);
      }

      audioStream.on('data', (chunk) => {
        console.log(`Sending chunk: ${chunk.length} bytes`);
      });

      audioStream.on('end', () => {
        console.log('Streaming complete.');
        res.end();
      });

      audioStream.on('error', (err) => {
        console.error('Audio stream error:', err);
        if (!res.headersSent) {
          res.status(500).send('Audio stream failed');
        } else {
          res.end();
        }
      });

      audioStream.pipe(res);

      res.on('close', () => {
        console.warn('Client disconnected before stream finished');
        if (audioStream.destroy) {
          audioStream.destroy();
        }
      });
    } catch (err) {
      console.error('AI processing error:', err);
      if (!res.headersSent) {
        res.status(500).send('Error generating speech');
      } else {
        res.end();
      }
    }
  }

  @Post('chat/stream')
  async chatWithTtsStream(
    @Body('message') message: string,
    @Body('scenario') scenario: ChatScenario = 'local-buddy',
    @Body('sessionId') sessionId = 'default',
    @Body('model') model = 'gpt-4o-mini-tts',
    @Body('voice') voice = 'echo',
    @Body('format') format = 'mp3',
    @Body('speed') speed = 1.0,
    @Res() res: Response,
  ): Promise<void> {
    if (!message) {
      throw new BadRequestException('No message provided');
    }

    this.chatService.ensureSession(sessionId, scenario);

    const mimeByFormat: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      aac: 'audio/aac',
      flac: 'audio/flac',
      ogg: 'audio/ogg',
      webm: 'audio/webm',
    };

    res.setHeader('Content-Type', mimeByFormat[format] || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Content-Disposition', `inline; filename="speech.${format}"`);
    res.setHeader('X-Scenario', scenario);

    res.flushHeaders();

    try {
      const aiPromise = this.chatService.processUserInput(sessionId, message);

      aiPromise
        .then(async (aiResponse: AIResponse) => {
          console.log('AI response ready:', aiResponse.ai_response);

          const audioStream =
            await this.textToSpeechService.generateSpeechStream(
              aiResponse.ai_response,
              model,
              voice,
              format,
              speed,
            );

          audioStream.on('error', (err) => {
            console.error('Audio stream error:', err);
            if (!res.headersSent) {
              res
                .status(500)
                .json({ success: false, error: 'Audio stream failed' });
            } else {
              res.end();
            }
          });

          await pump(audioStream, res);
        })
        .catch((err) => {
          console.error('Error processing chat:', err);
          if (!res.headersSent) {
            res
              .status(500)
              .json({ success: false, error: 'Chat processing failed' });
          } else {
            res.end();
          }
        });
    } catch (err) {
      console.error('Fatal chat/stream error:', err);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ success: false, error: 'Unexpected server error' });
      } else {
        res.end();
      }
    }
  }

  @Post('chat/audio')
  async chatWithTtsAudio(
    @Body('message') message: string,
    @Body('scenario') scenario: ChatScenario = 'local-buddy',
    @Body('sessionId') sessionId: string = 'default',
    @Body('model') model: string = 'gpt-4o-mini-tts',
    @Body('voice') voice: string = 'sage',
    @Body('format') format: string = 'mp3',
    @Body('speed') speed: number = 1.0,
    @Res() res: Response,
  ): Promise<void> {
    if (!message) {
      throw new BadRequestException('No message provided');
    }

    this.chatService.ensureSession(sessionId, scenario);

    try {
      const aiResponse: AIResponse = await this.chatService.processUserInput(
        sessionId,
        message,
      );

      const audioBuffer = await this.textToSpeechService.generateSpeech(
        aiResponse.ai_response,
        model,
        voice,
        format,
        speed,
      );

      const mimeByFormat: Record<string, string> = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        aac: 'audio/aac',
        flac: 'audio/flac',
        ogg: 'audio/ogg',
        webm: 'audio/webm',
      };
      const contentType = mimeByFormat[format] || 'audio/mpeg';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="speech.${format}"`,
      );
      res.send(audioBuffer);
    } catch (error) {
      console.error('chat/audio error:', error);
      res
        .status(500)
        .json({ success: false, error: (error as Error).message || 'Error' });
    }
  }
}
