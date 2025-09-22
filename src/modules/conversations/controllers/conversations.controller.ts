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
import { ChatService } from '../services/chat.service';
import { SpeechToTextService } from '../services/speech-to-text.service';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { SendMessageDto, SendMessageWithHistoryDto } from '../dto/chat.dto';
import {
  GenerateSpeechDto,
  GenerateSpeechWithEmotionDto,
  GenerateSpeechForConversationDto,
} from '../dto/tts.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly chatService: ChatService,
    private readonly speechToTextService: SpeechToTextService,
    private readonly textToSpeechService: TextToSpeechService,
  ) {}

  @Post('chat')
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
