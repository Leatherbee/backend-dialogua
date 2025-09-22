import { Module } from '@nestjs/common';
import { ConversationsController } from './controllers/conversations.controller';
import { ChatService } from './services/chat.service';
import { SpeechToTextService } from './services/speech-to-text.service';
import { TextToSpeechService } from './services/text-to-speech.service';
import { ChatToSpeechService } from './services/chat-to-speech.service';

@Module({
  controllers: [ConversationsController],
  providers: [
    ChatService,
    SpeechToTextService,
    TextToSpeechService,
    ChatToSpeechService,
  ],
  exports: [
    ChatService,
    SpeechToTextService,
    TextToSpeechService,
    ChatToSpeechService,
  ],
})
export class ConversationsModule {}
