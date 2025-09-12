import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConversationsAppService } from '../../../app.service';
import { ChatService } from '../services/ai/chat.service';
import type { ChatScenario } from '../services/ai/chat.service';
import type { AIResponse } from '../interfaces/conversation.interface';

@Controller()
export class ConversationsController {
  constructor(
    private readonly appService: ConversationsAppService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('conversation')
  async processConversation(
    @Body('message') message: string,
    @Body('action') action?: string,
    @Body('scenario') scenario: ChatScenario = 'local-buddy',
  ): Promise<any> {
    // Initialize conversation if needed
    if (action === 'reset' || !this.chatService.getCurrentStep()) {
      this.chatService.initializeConversation(scenario);
      return {
        message: `Conversation reset. Let's start over with ${scenario} scenario!`,
        step: this.chatService.getCurrentStep(),
        scenario: scenario,
      };
    }

    if (!message) {
      // If no message, return welcome message with current step
      const currentStep = this.chatService.getCurrentStep();
      return {
        message: `Welcome to the ${scenario} conversation practice!`,
        step: currentStep,
        scenario: scenario,
        instruction: 'Please send a message to start the conversation.',
      };
    }

    try {
      const aiResponse: AIResponse =
        await this.chatService.processUserInput(message);

      const response = {
        user_message: message,
        ai_response: aiResponse.ai_response,
        meta: aiResponse.meta,
        current_step: this.chatService.getCurrentStep(),
        is_complete: this.chatService.isConversationComplete(),
        scenario: scenario,
        progress: this.chatService.getConversationProgress(),
      };

      // Advance to next step if conversation is not complete
      if (!this.chatService.isConversationComplete()) {
        this.chatService.advanceToNextStep();
      }

      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('scenarios')
  getAvailableScenarios(): any {
    return {
      available_scenarios: this.chatService.getAvailableScenarios(),
    };
  }
}
