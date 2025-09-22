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
import { SendMessageDto, SendMessageWithHistoryDto } from '../dto/chat.dto';
import {
  GenerateSpeechDto,
  GenerateSpeechWithEmotionDto,
  GenerateSpeechForConversationDto,
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

  @Post('text-to-speech')
  @ApiOperation({
    summary: 'Convert text to speech',
    description:
      'Generate audio from text with customizable voice and format options',
  })
  @ApiProduces('audio/mpeg')
  @ApiResponse({
    status: 200,
    description: 'Audio generated successfully',
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
  async generateSpeech(@Body() generateSpeechDto: GenerateSpeechDto) {
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

  @Post('text-to-speech/emotion')
  @ApiOperation({
    summary: 'Convert text to speech with emotion',
    description: 'Generate audio from text with emotional tone variations',
  })
  @ApiProduces('audio/mpeg')
  @ApiResponse({
    status: 200,
    description: 'Emotional speech generated successfully',
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

  @Post('text-to-speech/conversation')
  @ApiOperation({
    summary: 'Convert text to speech for conversation',
    description:
      'Generate audio optimized for conversation context with speaker differentiation',
  })
  @ApiProduces('audio/mpeg')
  @ApiResponse({
    status: 200,
    description: 'Conversation speech generated successfully',
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
}
