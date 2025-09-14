import { Injectable } from '@nestjs/common';
import { ChatService } from './ai/chat.service';
import type { ChatScenario } from './ai/chat.service';

export type ConversationScenario = ChatScenario;

@Injectable()
export class ConversationServiceFactory {
  constructor(private readonly chatService: ChatService) {}

  getService(
    scenario: ConversationScenario,
    sessionId: string = 'default',
  ): ChatService {
    // Initialize the chat service with the specified scenario for this session
    this.chatService.initializeConversation(sessionId, scenario);
    return this.chatService;
  }

  getAvailableScenarios(): ConversationScenario[] {
    return this.chatService.getAvailableScenarios();
  }
}
