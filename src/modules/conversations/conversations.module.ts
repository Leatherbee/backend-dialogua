import { Module } from '@nestjs/common';
import { OpenAIService } from './services/openai.service';
import { LocalBuddyConversationService } from './services/role-play/local-buddy-conversation.service';
import { ClassroomConversationService } from './services/role-play/classroom-conversation.service';
import { ConversationServiceFactory } from './services/conversation-service.factory';
import { ConversationsController } from './controllers/conversations.controller';
import { ConversationsAppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [ConversationsController],
  providers: [
    ConversationsAppService,
    OpenAIService,
    LocalBuddyConversationService,
    ClassroomConversationService,
    ConversationServiceFactory,
  ],
  exports: [
    ConversationsAppService,
    OpenAIService,
    LocalBuddyConversationService,
    ClassroomConversationService,
    ConversationServiceFactory,
  ],
})
export class ConversationsModule {}
