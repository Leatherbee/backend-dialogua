import { Injectable } from '@nestjs/common';
import { BaseConversationService } from './base-conversation.service';
import { GenericAIService } from './generic-ai.service';
import { LocalBuddyConversationService } from './local-buddy-conversation.service';
import { ClassroomConversationService } from './classroom-conversation.service';

export type ConversationScenario = 'local-buddy' | 'classroom';

@Injectable()
export class ConversationServiceFactory {
  constructor(
    private readonly genericAIService: GenericAIService,
    private readonly localBuddyService: LocalBuddyConversationService,
    private readonly classroomService: ClassroomConversationService,
  ) {}

  getService(scenario: ConversationScenario): BaseConversationService {
    switch (scenario) {
      case 'local-buddy':
        return this.localBuddyService;
      case 'classroom':
        return this.classroomService;
      default:
        return this.localBuddyService;
    }
  }

  getAvailableScenarios(): ConversationScenario[] {
    return ['local-buddy', 'classroom'];
  }
}
