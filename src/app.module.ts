import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { OpenAIService } from './services/openai.service';
import { LocalBuddyConversationService } from './services/role-play/local-buddy-conversation.service';
import { ClassroomConversationService } from './services/role-play/classroom-conversation.service';
import { ConversationServiceFactory } from './services/conversation-service.factory';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    OpenAIService,
    LocalBuddyConversationService,
    ClassroomConversationService,
    ConversationServiceFactory,
  ],
})
export class AppModule {}
