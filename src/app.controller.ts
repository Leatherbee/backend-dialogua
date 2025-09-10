import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './services/app.service';
import { ConversationServiceFactory } from './services/conversation-service.factory';
import type { ConversationScenario } from './services/conversation-service.factory';
// import { LocalBuddyRPController } from './controllers/local-buddy-rp.controller';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly conversationServiceFactory: ConversationServiceFactory,
    // private readonly openAIService: LocalBuddyRPController,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post('generate')
  // async generateText(@Body('prompt') prompt: string): Promise<any> {
  //   const stepContext = {
  //     step_id: '123',
  //     step_goal: '',
  //     target_vocab: [],
  //     hints: [],
  //   };

  //   return this.openAIService.generateText(prompt, stepContext);
  // }

  @Post('conversation')
  async processConversation(
    @Body('message') message: string,
    @Body('action') action?: string,
    @Body('scenario') scenario: ConversationScenario = 'local-buddy',
  ): Promise<any> {
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

    if (!conversationService.isConversationComplete()) {
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
