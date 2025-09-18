import { Module } from '@nestjs/common';
import { ConversationsController } from './controllers/conversations.controller';
import { SpeechToTextService } from './services/ai/speech-to-text.service';
import { TextToSpeechService } from './services/ai/text-to-speech.service';
import { ChatService } from './services/ai/chat.service';

@Module({
  imports: [],
  controllers: [ConversationsController],
  providers: [SpeechToTextService, TextToSpeechService, ChatService],
  exports: [SpeechToTextService, TextToSpeechService, ChatService],
})
export class ConversationsModule {}
