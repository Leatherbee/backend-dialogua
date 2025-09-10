import { Injectable } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import {
  ConversationStep,
  ScenarioContext,
  SystemPromptBuilder,
} from '../interfaces/conversation.interface';

@Injectable()
export class BaseConversationService {
  protected currentStepIndex = 0;
  protected conversationHistory: string[] = [];
  protected conversationSteps: ConversationStep[] = [];
  protected scenarioContext: ScenarioContext | null = null;
  protected promptBuilder: SystemPromptBuilder | null = null;

  constructor(protected readonly aiService: OpenAIService) {}

  initializeConversation(
    steps: ConversationStep[],
    scenarioContext: ScenarioContext,
    promptBuilder: SystemPromptBuilder,
  ): void {
    this.conversationSteps = steps;
    this.scenarioContext = scenarioContext;
    this.promptBuilder = promptBuilder;
    this.currentStepIndex = 0;
    this.conversationHistory = [];

    // Reset recent_dialog for all steps
    this.conversationSteps.forEach((step) => {
      step.recent_dialog = '';
    });
  }

  getCurrentStep(): ConversationStep | null {
    if (this.conversationSteps.length === 0) return null;
    return this.conversationSteps[this.currentStepIndex];
  }

  getNextStep(): ConversationStep | null {
    if (
      this.conversationSteps.length === 0 ||
      this.currentStepIndex >= this.conversationSteps.length - 1
    ) {
      return null;
    }
    return this.conversationSteps[this.currentStepIndex + 1];
  }

  updateRecentDialog(
    stepId: string,
    userMessage: string,
    aiResponse: string,
  ): void {
    const step = this.conversationSteps.find((s) => s.step_id === stepId);
    if (step) {
      step.recent_dialog = `${step.recent_dialog || ''}
user: ${userMessage}
assistant: ${aiResponse}`;
    }
  }

  advanceToNextStep(): boolean {
    if (this.currentStepIndex < this.conversationSteps.length - 1) {
      this.currentStepIndex++;
      return true;
    }
    return false;
  }

  resetConversation(): void {
    this.currentStepIndex = 0;
    this.conversationHistory = [];
    // Reset recent_dialog for all steps
    this.conversationSteps.forEach((step) => {
      step.recent_dialog = '';
    });
  }

  async processUserInput(userInput: string): Promise<string> {
    if (!this.scenarioContext || !this.promptBuilder) {
      throw new Error(
        'Conversation not initialized. Call initializeConversation first.',
      );
    }

    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      throw new Error('No conversation steps defined.');
    }

    // Build the system prompt using the provided prompt builder
    const systemPrompt = this.promptBuilder.buildPrompt(
      currentStep,
      this.scenarioContext,
    );

    // Generate AI response
    const aiResponse = await this.aiService.generateText(
      userInput,
      systemPrompt,
    );

    this.updateRecentDialog(currentStep.step_id, userInput, aiResponse);

    this.conversationHistory.push(`user: ${userInput}`);
    this.conversationHistory.push(`assistant: ${aiResponse}`);

    return aiResponse;
  }

  isConversationComplete(): boolean {
    return (
      this.conversationSteps.length > 0 &&
      this.currentStepIndex >= this.conversationSteps.length - 1
    );
  }

  getConversationProgress(): {
    currentStep: number;
    totalSteps: number;
    percentage: number;
  } {
    if (this.conversationSteps.length === 0) {
      return { currentStep: 0, totalSteps: 0, percentage: 0 };
    }

    const currentStep = this.currentStepIndex + 1;
    const totalSteps = this.conversationSteps.length;
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return { currentStep, totalSteps, percentage };
  }
}
