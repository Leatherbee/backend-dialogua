import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiProduces,
} from '@nestjs/swagger';
import { ChatService } from '../services/chat.service';
import { SpeechToTextService } from '../services/speech-to-text.service';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { ChatToSpeechService } from '../services/chat-to-speech.service';
import { SendMessageDto, SendMessageWithHistoryDto } from '../dto/chat.dto';
import {
  GenerateSpeechDto,
  GenerateSpeechWithEmotionDto,
  GenerateSpeechForConversationDto,
  ChatToSpeechDto,
} from '../dto/tts.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Public()
@ApiTags('Conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly chatService: ChatService,
    private readonly speechToTextService: SpeechToTextService,
    private readonly textToSpeechService: TextToSpeechService,
    private readonly chatToSpeechService: ChatToSpeechService,
  ) {}

  @Post('chat')
  @ApiOperation({
    summary: 'Send a chat message',
    description: 'Send a message to the AI chat service and receive a response',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat response received successfully',
    schema: {
      type: 'object',
      properties: {
        response: { type: 'string', description: 'AI response message' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to process chat message',
  })
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    try {
      const response = await this.chatService.sendMessage(
        sendMessageDto.message,
        sendMessageDto.context,
      );
      return { response };
    } catch {
      throw new HttpException(
        'Failed to process chat message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('chat/history')
  @ApiOperation({
    summary: 'Send a chat message with conversation history',
    description:
      'Send a message with previous conversation context to maintain chat continuity',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat response with history context received successfully',
    schema: {
      type: 'object',
      properties: {
        response: {
          type: 'string',
          description: 'AI response message with context',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to process chat message with history',
  })
  async sendMessageWithHistory(
    @Body() sendMessageWithHistoryDto: SendMessageWithHistoryDto,
  ) {
    try {
      const response = await this.chatService.sendMessageWithHistory(
        sendMessageWithHistoryDto.messages,
        sendMessageWithHistoryDto.context,
      );
      return { response };
    } catch {
      throw new HttpException(
        'Failed to process chat message with history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('speech-to-text')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiOperation({
    summary: 'Convert speech to text',
    description:
      'Upload an audio file and convert it to text using speech recognition',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Audio file to transcribe',
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          format: 'binary',
          description: 'Audio file (mp3, wav, etc.)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Audio transcribed successfully',
    schema: {
      type: 'object',
      properties: {
        transcription: {
          type: 'string',
          description: 'Transcribed text from audio',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'No audio file provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to transcribe audio',
  })
  async transcribeAudio(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException(
          'No audio file provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const transcription = await this.speechToTextService.transcribeAudio(
        file.buffer,
        file.originalname,
      );
      return { transcription };
    } catch {
      throw new HttpException(
        'Failed to transcribe audio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('text-to-speech/base64')
  @ApiOperation({
    summary: 'Convert text to speech (Base64)',
    description:
      'Generate audio from text and return as base64 string with customizable voice and format options',
  })
  @ApiResponse({
    status: 200,
    description: 'Audio generated successfully as base64',
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          description: 'Base64 encoded audio data',
          example:
            'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT...',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate speech',
  })
  async generateSpeechBase64(@Body() generateSpeechDto: GenerateSpeechDto) {
    try {
      const audioBuffer = await this.textToSpeechService.generateSpeech(
        generateSpeechDto.text,
        {
          voice: generateSpeechDto.voice as any,
          format: generateSpeechDto.format as any,
        },
      );

      const audioBase64 = audioBuffer.toString('base64');
      return { audio: audioBase64 };
    } catch {
      throw new HttpException(
        'Failed to generate speech',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('text-to-speech')
  @ApiOperation({
    summary: 'Convert text to speech (Binary)',
    description:
      'Generate audio from text and return as binary MP3 file with customizable voice and format options',
  })
  @ApiProduces('audio/mpeg')
  @ApiResponse({
    status: 200,
    description: 'Audio generated successfully as binary',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate speech',
  })
  async generateSpeech(
    @Body() generateSpeechDto: GenerateSpeechDto,
    @Res() res: Response,
  ) {
    try {
      const audioBuffer = await this.textToSpeechService.generateSpeech(
        generateSpeechDto.text,
        {
          voice: generateSpeechDto.voice as any,
          format: generateSpeechDto.format as any,
        },
      );

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length.toString());
      res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"');
      res.send(audioBuffer);
    } catch {
      throw new HttpException(
        'Failed to generate speech',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('text-to-speech/emotion/base64')
  @ApiOperation({
    summary: 'Convert text to speech with emotion (Base64)',
    description:
      'Generate audio from text with emotional tone variations and return as base64',
  })
  @ApiResponse({
    status: 200,
    description: 'Emotional speech generated successfully as base64',
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          description: 'Base64 encoded audio data with emotion',
          example:
            'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT...',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate emotional speech',
  })
  async generateSpeechWithEmotionBase64(
    @Body() generateSpeechWithEmotionDto: GenerateSpeechWithEmotionDto,
  ) {
    try {
      const audioBuffer = await this.textToSpeechService.generateSpeech(
        generateSpeechWithEmotionDto.text,
        {
          voice: 'alloy',
        },
      );

      const audioBase64 = audioBuffer.toString('base64');
      return { audio: audioBase64 };
    } catch {
      throw new HttpException(
        'Failed to generate speech with emotion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('text-to-speech/emotion')
  @ApiOperation({
    summary: 'Convert text to speech with emotion (Binary)',
    description:
      'Generate audio from text with emotional tone variations and return as binary MP3',
  })
  @ApiProduces('audio/mpeg')
  @ApiResponse({
    status: 200,
    description: 'Emotional speech generated successfully as binary',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate emotional speech',
  })
  async generateSpeechWithEmotion(
    @Body() generateSpeechWithEmotionDto: GenerateSpeechWithEmotionDto,
    @Res() res: Response,
  ) {
    try {
      const audioBuffer = await this.textToSpeechService.generateSpeech(
        generateSpeechWithEmotionDto.text,
        {
          voice: 'alloy',
        },
      );

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length.toString());
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="emotion-speech.mp3"',
      );
      res.send(audioBuffer);
    } catch {
      throw new HttpException(
        'Failed to generate speech with emotion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('text-to-speech/conversation/base64')
  @ApiOperation({
    summary: 'Convert text to speech for conversation (Base64)',
    description:
      'Generate audio optimized for conversation context with speaker differentiation and return as base64',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation speech generated successfully as base64',
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          description: 'Base64 encoded conversation audio data',
          example:
            'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT...',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate conversation speech',
  })
  async generateSpeechForConversationBase64(
    @Body() generateSpeechForConversationDto: GenerateSpeechForConversationDto,
  ) {
    try {
      const audioBuffer = await this.textToSpeechService.generateSpeech(
        generateSpeechForConversationDto.text,
        {},
      );

      const audioBase64 = audioBuffer.toString('base64');
      return { audio: audioBase64 };
    } catch {
      throw new HttpException(
        'Failed to generate speech for conversation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('text-to-speech/conversation')
  @ApiOperation({
    summary: 'Convert text to speech for conversation (Binary)',
    description:
      'Generate audio optimized for conversation context with speaker differentiation and return as binary MP3',
  })
  @ApiProduces('audio/mpeg')
  @ApiResponse({
    status: 200,
    description: 'Conversation speech generated successfully as binary',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate conversation speech',
  })
  async generateSpeechForConversation(
    @Body() generateSpeechForConversationDto: GenerateSpeechForConversationDto,
    @Res() res: Response,
  ) {
    try {
      const audioBuffer = await this.textToSpeechService.generateSpeech(
        generateSpeechForConversationDto.text,
        {},
      );

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length.toString());
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="conversation-speech.mp3"',
      );
      res.send(audioBuffer);
    } catch {
      throw new HttpException(
        'Failed to generate speech for conversation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tts/stream')
  @ApiOperation({
    summary: 'Stream text-to-speech audio',
    description:
      'Generate and stream audio from text in real-time for better user experience',
  })
  @ApiProduces('audio/mpeg')
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
  @ApiResponse({
    status: 500,
    description: 'Failed to stream audio',
  })
  async streamTTS(
    @Body() generateSpeechDto: GenerateSpeechDto,
    @Res() res: Response,
  ) {
    try {
      const stream = await this.textToSpeechService.generateSpeechStream(
        generateSpeechDto.text,
        {
          voice: generateSpeechDto.voice as any,
          format: generateSpeechDto.format as any,
        },
      );

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');

      const reader = stream.getReader();

      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (error) {
          console.error('Stream error:', error);
          res.status(500).end();
        }
      };

      await pump();
    } catch {
      throw new HttpException(
        'Failed to stream TTS audio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('chat-to-speech/base64')
  @ApiOperation({
    summary: 'Chat with AI and convert response to speech (Base64)',
    description:
      'Send a message to AI, get response, and convert the AI response to speech returned as base64',
  })
  @ApiResponse({
    status: 200,
    description: 'AI response converted to speech successfully as base64',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Original user message',
        },
        aiResponse: {
          type: 'string',
          description: 'AI response text',
        },
        audio: {
          type: 'string',
          description: 'Base64 encoded audio of AI response',
          example:
            'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT...',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to process chat-to-speech request',
  })
  async chatToSpeechBase64(@Body() chatToSpeechDto: ChatToSpeechDto) {
    try {
      // Use ChatToSpeechService for context management
      const result =
        await this.chatToSpeechService.sendMessageWithContextAndSpeech(
          chatToSpeechDto.conversationId || 'default',
          chatToSpeechDto.message,
          {
            systemMessage: chatToSpeechDto.systemMessage,
            voice: chatToSpeechDto.voice as any,
            format: chatToSpeechDto.format as any,
          },
        );

      const audioBase64 = result.audioBuffer.toString('base64');
      return {
        message: chatToSpeechDto.message,
        aiResponse: result.aiResponse,
        audio: audioBase64,
        conversationId: chatToSpeechDto.conversationId || 'default',
      };
    } catch {
      throw new HttpException(
        'Failed to process chat-to-speech request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('chat-to-speech')
  @ApiOperation({
    summary: 'Chat with AI and convert response to speech (Binary)',
    description:
      'Send a message to AI, get response, and convert the AI response to speech returned as binary MP3',
  })
  @ApiProduces('audio/mpeg')
  @ApiResponse({
    status: 200,
    description: 'AI response converted to speech successfully as binary',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    headers: {
      'X-AI-Response': {
        description: 'The AI response text',
        schema: {
          type: 'string',
        },
      },
      'X-User-Message': {
        description: 'The original user message',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to process chat-to-speech request',
  })
  async chatToSpeech(
    @Body() chatToSpeechDto: ChatToSpeechDto,
    @Res() res: Response,
  ) {
    try {
      // Use ChatToSpeechService for context management
      const result =
        await this.chatToSpeechService.sendMessageWithContextAndSpeech(
          chatToSpeechDto.conversationId || 'default',
          chatToSpeechDto.message,
          {
            systemMessage: chatToSpeechDto.systemMessage,
            voice: chatToSpeechDto.voice as any,
            format: chatToSpeechDto.format as any,
          },
        );

      // Set headers with AI response and user message for frontend reference
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', result.audioBuffer.length.toString());
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="ai-response-speech.mp3"',
      );
      res.setHeader('X-AI-Response', encodeURIComponent(result.aiResponse));
      res.setHeader(
        'X-User-Message',
        encodeURIComponent(chatToSpeechDto.message),
      );
      res.setHeader(
        'X-Conversation-ID',
        encodeURIComponent(chatToSpeechDto.conversationId || 'default'),
      );
      res.send(result.audioBuffer);
    } catch {
      throw new HttpException(
        'Failed to process chat-to-speech request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('conversation/create')
  @ApiOperation({
    summary: 'Create a new conversation',
    description: 'Create a new conversation with optional system message',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation created successfully',
    schema: {
      type: 'object',
      properties: {
        conversationId: { type: 'string', description: 'Conversation ID' },
        systemMessage: { type: 'string', description: 'System message' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
      },
    },
  })
  async createConversation(
    @Body() body: { conversationId: string; systemMessage?: string },
  ) {
    const conversation = this.chatToSpeechService.createConversation(
      body.conversationId,
      body.systemMessage,
    );
    return {
      conversationId: conversation.conversationId,
      systemMessage: conversation.messages.find((m) => m.role === 'system')
        ?.content,
      createdAt: conversation.createdAt,
    };
  }

  @Post('conversation/:id/reset')
  @ApiOperation({
    summary: 'Reset conversation',
    description: 'Reset conversation to initial state',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation reset successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', description: 'Reset success status' },
        conversationId: { type: 'string', description: 'Conversation ID' },
      },
    },
  })
  async resetConversation(@Body() body: { conversationId: string }) {
    const success = this.chatToSpeechService.resetConversation(
      body.conversationId,
    );
    return {
      success,
      conversationId: body.conversationId,
    };
  }
}
