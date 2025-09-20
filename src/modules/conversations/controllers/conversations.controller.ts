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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechToTextService } from '../services/ai/speech-to-text.service';
import { TextToSpeechService } from '../services/ai/text-to-speech.service';
import { ChatService } from '../services/ai/chat.service';
import type { Response } from 'express';
import type { AIResponse } from '../interfaces/conversation.interface';
import type { ChatScenario } from '../services/ai/chat.service';

@ApiTags('AI Conversation Services')
@Controller('api/v1')
export class ConversationsController {
  constructor(
    private readonly speechToTextService: SpeechToTextService,
    private readonly textToSpeechService: TextToSpeechService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Check AI services status',
    description:
      'Returns a simple message to verify that AI services are running',
  })
  @ApiResponse({
    status: 200,
    description: 'AI services are operational',
    schema: {
      type: 'string',
      example: 'AI Services are running!',
    },
  })
  getAIHello(): string {
    return 'AI Services are running!';
  }

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiOperation({
    summary: 'Transcribe audio to text',
    description:
      'Converts uploaded audio file to text using speech-to-text AI service',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Audio file and optional details flag',
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          format: 'binary',
          description:
            'Audio file to transcribe (supported formats: mp3, wav, m4a, etc.)',
        },
        details: {
          type: 'boolean',
          description: 'Include detailed transcription metadata',
          default: false,
        },
      },
      required: ['audio'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Audio successfully transcribed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        transcription: { type: 'string', example: 'Hello, how are you today?' },
        details: {
          type: 'object',
          description: 'Additional transcription metadata (when details=true)',
          properties: {
            language: { type: 'string', example: 'en' },
            duration: { type: 'number', example: 3.5 },
            confidence: { type: 'number', example: 0.95 },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No audio file provided or invalid file format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'No audio file provided' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Transcription service error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Transcription failed' },
      },
    },
  })
  async transcribeAudio(
    @UploadedFile() file: Express.Multer.File,
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
        return { success: true, ...result };
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
  @ApiOperation({
    summary: 'Convert text to speech',
    description: 'Generates audio from text using text-to-speech AI service',
  })
  @ApiBody({
    description: 'Text-to-speech configuration',
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text to convert to speech',
          example: 'Hello, how are you?',
        },
        model: {
          type: 'string',
          description: 'TTS model to use',
          enum: ['tts-1', 'tts-1-hd'],
          default: 'tts-1',
          example: 'tts-1',
        },
        voice: {
          type: 'string',
          description: 'Voice to use for speech generation',
          enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
          default: 'alloy',
          example: 'alloy',
        },
        format: {
          type: 'string',
          description: 'Audio format',
          enum: ['mp3', 'wav', 'aac', 'flac', 'ogg'],
          default: 'mp3',
          example: 'mp3',
        },
        speed: {
          type: 'number',
          description: 'Speech speed (0.25 to 4.0)',
          minimum: 0.25,
          maximum: 4.0,
          default: 1.0,
          example: 1.0,
        },
      },
      required: ['text'],
    },
    examples: {
      basic: {
        summary: 'Basic text-to-speech',
        value: {
          text: 'Hello, welcome to our language learning platform!',
        },
      },
      advanced: {
        summary: 'Advanced configuration',
        value: {
          text: 'Selamat datang di platform pembelajaran bahasa Indonesia',
          model: 'tts-1-hd',
          voice: 'nova',
          format: 'wav',
          speed: 0.9,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Audio successfully generated',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'audio/wav': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            audio: { type: 'string', description: 'Base64 encoded audio data' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Missing or invalid text parameter',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'No text provided' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Text-to-speech service error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'TTS generation failed' },
      },
    },
  })
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
        model || 'tts-1',
        voice || 'alloy',
        format || 'mp3',
        speed || 1.0,
      );

      if (res) {
        const mimeByFormat: Record<string, string> = {
          mp3: 'audio/mpeg',
          wav: 'audio/wav',
          aac: 'audio/aac',
          flac: 'audio/flac',
          ogg: 'audio/ogg',
        };
        const contentType = mimeByFormat[format || 'mp3'] || 'audio/mpeg';
        res.setHeader('Content-Type', contentType);
        res.send(audioBuffer);
      } else {
        return { success: true, audio: audioBuffer.toString('base64') };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('chat')
  @ApiOperation({
    summary: 'Chat with AI assistant',
    description:
      'Engage in conversation with AI assistant using different scenarios for language learning',
  })
  @ApiBody({
    description: 'Chat message and configuration',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'User message to send to AI',
          example: 'Halo, apa kabar?',
        },
        scenario: {
          type: 'string',
          description: 'Conversation scenario',
          enum: ['local-buddy', 'officer', 'classroom', 'hotel-receptionist'],
          default: 'local-buddy',
          example: 'local-buddy',
        },
        sessionId: {
          type: 'string',
          description: 'Session identifier for conversation continuity',
          default: 'default',
          example: 'user-session-123',
        },
        action: {
          type: 'string',
          description: 'Special action to perform',
          enum: ['reset'],
          example: 'reset',
        },
      },
      required: ['message'],
    },
    examples: {
      greeting: {
        summary: 'Start conversation',
        value: {
          message: 'Halo, saya baru tiba di Indonesia',
          scenario: 'local-buddy',
          sessionId: 'user-123',
        },
      },
      reset: {
        summary: 'Reset conversation',
        value: {
          action: 'reset',
          scenario: 'local-buddy',
          sessionId: 'user-123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'AI response generated successfully',
    schema: {
      type: 'object',
      properties: {
        user_message: { type: 'string', example: 'Halo, apa kabar?' },
        ai_response: {
          type: 'string',
          example: 'Halo! Kabar baik, terima kasih. Bagaimana dengan Anda?',
        },
        meta: {
          type: 'object',
          properties: {
            expected_vocab_matched: {
              type: 'array',
              items: { type: 'string' },
              example: ['halo', 'kabar'],
            },
            hints_used: { type: 'boolean', example: false },
            expressions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sentence: { type: 'number', example: 1 },
                  label: {
                    type: 'string',
                    enum: [
                      'smile',
                      'warm',
                      'neutral',
                      'thinking',
                      'confused',
                      'surprised',
                      'encouraging',
                      'apologetic',
                    ],
                    example: 'warm',
                  },
                },
              },
            },
          },
        },
        scenario: { type: 'string', example: 'local-buddy' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Invalid scenario' },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get initial AI message',
    description:
      'Retrieves the initial greeting message from AI for a specific scenario',
  })
  @ApiBody({
    description: 'Initial message configuration',
    schema: {
      type: 'object',
      properties: {
        scenario: {
          type: 'string',
          description: 'Conversation scenario',
          enum: ['local-buddy', 'officer', 'classroom', 'hotel-receptionist'],
          default: 'local-buddy',
          example: 'local-buddy',
        },
        sessionId: {
          type: 'string',
          description: 'Session identifier',
          default: 'default',
          example: 'user-session-123',
        },
      },
    },
    examples: {
      localBuddy: {
        summary: 'Local buddy scenario',
        value: {
          scenario: 'local-buddy',
          sessionId: 'user-123',
        },
      },
      classroom: {
        summary: 'Classroom scenario',
        value: {
          scenario: 'classroom',
          sessionId: 'user-123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Initial AI message generated successfully',
    schema: {
      type: 'object',
      properties: {
        ai_response: {
          type: 'string',
          example: 'Halo! Senang bertemu denganmu di bandara.',
        },
        meta: {
          type: 'object',
          properties: {
            expected_vocab_matched: {
              type: 'array',
              items: { type: 'string' },
              example: ['halo'],
            },
            hints_used: { type: 'boolean', example: false },
            expressions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sentence: { type: 'number', example: 1 },
                  label: { type: 'string', example: 'warm' },
                },
              },
            },
          },
        },
        scenario: { type: 'string', example: 'local-buddy' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid scenario or session parameters',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Invalid scenario' },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get available conversation scenarios',
    description:
      'Returns a list of all available conversation scenarios for language learning',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available scenarios',
    schema: {
      type: 'object',
      properties: {
        available_scenarios: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['local-buddy', 'officer', 'classroom', 'hotel-receptionist'],
          },
          example: [
            'local-buddy',
            'officer',
            'classroom',
            'hotel-receptionist',
          ],
        },
      },
    },
  })
  getAvailableScenarios(): any {
    return {
      available_scenarios: this.chatService.getAvailableScenarios(),
    };
  }

  @Get('voices')
  @ApiOperation({
    summary: 'Get available TTS voices',
    description:
      'Returns a list of all available text-to-speech voices with their characteristics',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available voices',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        voices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'alloy' },
              gender: { type: 'string', example: 'neutral' },
              description: { type: 'string', example: 'Neutral and clear' },
            },
          },
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get available AI models',
    description:
      'Returns a list of all available AI models for speech and text processing',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available models',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        models: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'tts-1' },
              description: {
                type: 'string',
                example: 'Optimized for real-time text-to-speech',
              },
            },
          },
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Stream text-to-speech audio',
    description: 'Generates and streams audio from text in real-time',
  })
  @ApiBody({
    description: 'Text message for streaming TTS',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Text to convert to speech',
          example: 'Selamat datang di platform pembelajaran bahasa Indonesia',
        },
      },
      required: ['message'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Audio stream started successfully',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No message provided',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'No message provided' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async textToSpeechStream(
    @Body('message') message: string,
    @Res() res: Response,
  ) {
    if (!message) {
      throw new BadRequestException('No message provided');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Transfer-Encoding', 'chunked');

    try {
      const audioStream = await this.textToSpeechService.generateSpeechStream(
        message,
        'tts-1',
        'echo',
        'mp3',
        1.0,
      );

      audioStream.on('data', (chunk) => {
        res.write(chunk);
      });

      audioStream.on('end', () => {
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
  @ApiOperation({
    summary: 'Chat with streaming TTS response',
    description:
      'Sends a message to AI and streams the response as audio in real-time',
  })
  @ApiBody({
    description: 'Chat message with streaming TTS configuration',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'User message to send to AI',
          example: 'Bagaimana cara ke stasiun kereta?',
        },
        scenario: {
          type: 'string',
          description: 'Conversation scenario',
          enum: ['local-buddy', 'officer', 'classroom', 'hotel-receptionist'],
          default: 'local-buddy',
          example: 'local-buddy',
        },
        sessionId: {
          type: 'string',
          description: 'Session identifier',
          default: 'default',
          example: 'user-session-123',
        },
        model: {
          type: 'string',
          description: 'TTS model to use',
          default: 'gpt-4o-mini-tts',
          example: 'gpt-4o-mini-tts',
        },
        voice: {
          type: 'string',
          description: 'Voice for TTS',
          enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
          default: 'echo',
          example: 'echo',
        },
        format: {
          type: 'string',
          description: 'Audio format',
          enum: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'webm'],
          default: 'mp3',
          example: 'mp3',
        },
        speed: {
          type: 'number',
          description: 'Speech speed',
          minimum: 0.25,
          maximum: 4.0,
          default: 1.0,
          example: 1.0,
        },
      },
      required: ['message'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Audio stream with AI response started successfully',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'audio/wav': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    headers: {
      'X-Scenario': {
        description: 'The conversation scenario used',
        schema: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No message provided',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'No message provided' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
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

          audioStream.on('data', (chunk) => {
            if (!res.destroyed) {
              res.write(chunk);
            }
          });

          audioStream.on('end', () => {
            if (!res.destroyed) {
              res.end();
            }
          });

          audioStream.on('error', (err) => {
            console.error('Audio stream error:', err);
            if (!res.headersSent && !res.destroyed) {
              res.status(500).send('Audio stream failed');
            } else if (!res.destroyed) {
              res.end();
            }
          });

          res.on('close', () => {
            console.warn('Client disconnected before stream finished');
            if (audioStream.destroy) {
              audioStream.destroy();
            }
          });
        })
        .catch((error) => {
          console.error('AI processing error:', error);
          if (!res.headersSent && !res.destroyed) {
            res.status(500).send('Error processing AI response');
          } else if (!res.destroyed) {
            res.end();
          }
        });
    } catch (error) {
      console.error('Chat stream error:', error);
      if (!res.headersSent && !res.destroyed) {
        res.status(500).send('Error initiating chat stream');
      }
    }
  }

  @Post('chat/audio')
  @ApiOperation({
    summary: 'Chat with audio response',
    description:
      'Sends a message to AI and returns the response as downloadable audio',
  })
  @ApiBody({
    description: 'Chat message with audio response configuration',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'User message to send to AI',
          example: 'Terima kasih atas bantuannya',
        },
        scenario: {
          type: 'string',
          description: 'Conversation scenario',
          enum: ['local-buddy', 'officer', 'classroom', 'hotel-receptionist'],
          default: 'local-buddy',
          example: 'local-buddy',
        },
        sessionId: {
          type: 'string',
          description: 'Session identifier',
          default: 'default',
          example: 'user-session-123',
        },
        model: {
          type: 'string',
          description: 'TTS model to use',
          default: 'gpt-4o-mini-tts',
          example: 'gpt-4o-mini-tts',
        },
        voice: {
          type: 'string',
          description: 'Voice for TTS',
          enum: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
          default: 'sage',
          example: 'sage',
        },
        format: {
          type: 'string',
          description: 'Audio format',
          enum: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'webm'],
          default: 'mp3',
          example: 'mp3',
        },
        speed: {
          type: 'number',
          description: 'Speech speed',
          minimum: 0.25,
          maximum: 4.0,
          default: 1.0,
          example: 1.0,
        },
      },
      required: ['message'],
    },
    examples: {
      basic: {
        summary: 'Basic chat with audio',
        value: {
          message: 'Selamat pagi, bagaimana kabar Anda?',
          scenario: 'local-buddy',
        },
      },
      customVoice: {
        summary: 'Chat with custom voice settings',
        value: {
          message: 'Bisakah Anda membantu saya?',
          scenario: 'hotel-receptionist',
          voice: 'nova',
          format: 'wav',
          speed: 0.9,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Audio response generated successfully',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'audio/wav': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    headers: {
      'Content-Disposition': {
        description: 'Attachment filename for the audio file',
        schema: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No message provided',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'No message provided' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error processing chat or generating audio',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Error processing AI response' },
      },
    },
  })
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
