import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './services/app.service';
import { ConversationServiceFactory } from './services/conversation-service.factory';
import type { ConversationScenario } from './services/conversation-service.factory';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly conversationServiceFactory: ConversationServiceFactory,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('conversation')
  async processConversation(
    @Body('message') message: string,
    @Body('action') action?: string,
    @Body('scenario') scenario: ConversationScenario = 'local-buddy',
  ): Promise<any> {
    // Get the appropriate conversation service based on scenario
    const conversationService =
      this.conversationServiceFactory.getService(scenario);

    if (action === 'reset') {
      conversationService.resetConversation();
      return {
        message: `Conversation reset. Let's start over with ${scenario} scenario!`,
        step: conversationService.getCurrentStep(),
        scenario: scenario,
      };
    }

    if (!message) {
      return {
        message: `Welcome to the ${scenario} conversation practice!`,
        step: conversationService.getCurrentStep(),
        scenario: scenario,
        instruction: 'Please send a message to start the conversation.',
      };
    }

    const aiResponse = await conversationService.processUserInput(message);

    const response = {
      user_message: message,
      ai_response: aiResponse,
      current_step: conversationService.getCurrentStep(),
      is_complete: conversationService.isConversationComplete(),
      scenario: scenario,
      progress: conversationService.getConversationProgress(),
    };

    // Advance to next step (in a real implementation, this might be based on content analysis)
    if (!conversationService.isConversationComplete()) {
      // For demo purposes, we'll advance after each message
      // In a real implementation, you might want to analyze the content to determine when to advance
      conversationService.advanceToNextStep();
    }

    return response;
  }

  @Get('scenarios')
  getAvailableScenarios(): any {
    return {
      available_scenarios:
        this.conversationServiceFactory.getAvailableScenarios(),
    };
  }
}
