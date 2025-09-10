import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { GenericAIService } from './services/generic-ai.service';
import { LocalBuddyConversationService } from './services/local-buddy-conversation.service';
import { ClassroomConversationService } from './services/classroom-conversation.service';
import { ConversationServiceFactory } from './services/conversation-service.factory';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    GenericAIService,
    LocalBuddyConversationService,
    ClassroomConversationService,
    ConversationServiceFactory,
  ],
})
export class AppModule {}
