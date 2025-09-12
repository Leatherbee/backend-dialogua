import { Module } from '@nestjs/common';
import { ConversationsController } from './controllers/conversations.controller';
import { AIController } from './controllers/ai.controller';
import { ConversationsAppService } from '../../app.service';
import { SpeechToTextService } from './services/ai/speech-to-text.service';
import { TextToSpeechService } from './services/ai/text-to-speech.service';
import { ChatService } from './services/ai/chat.service';

@Module({
  imports: [],
  controllers: [ConversationsController, AIController],
  providers: [
    ConversationsAppService,
    SpeechToTextService,
    TextToSpeechService,
    ChatService,
  ],
  exports: [
    ConversationsAppService,
    SpeechToTextService,
    TextToSpeechService,
    ChatService,
  ],
})
export class ConversationsModule {}
