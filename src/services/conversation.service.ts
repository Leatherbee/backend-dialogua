import { Injectable } from '@nestjs/common';
import { LocalBuddyRPController } from '../controllers/local-buddy-rp.controller';

export interface ConversationStep {
  step_id: string;
  step_goal: string;
  target_vocab: string[];
  hints: string[];
  recent_dialog?: string;
}

@Injectable()
export class ConversationService {
  private currentStepIndex = 0;
  private conversationHistory: string[] = [];

  private readonly conversationSteps: ConversationStep[] = [
    {
      step_id: 'step1',
      step_goal: 'Menyapa di bandara',
      target_vocab: ['Halo', 'Selamat pagi', 'Selamat siang', 'Selamat malam'],
      hints: [
        "Mulai dengan salam sederhana seperti 'Halo' atau 'Selamat siang'",
      ],
      recent_dialog: '',
    },
    {
      step_id: 'step2',
      step_goal: 'Tukar nama dengan sopan',
      target_vocab: ['Nama saya...', 'Siapa nama kamu?'],
      hints: ["Sebutkan nama kamu dengan 'Nama saya ...'"],
      recent_dialog: '',
    },
    {
      step_id: 'step3',
      step_goal: 'Menyebutkan asal negara',
      target_vocab: ['Saya dari...', 'Dari mana asal kamu?'],
      hints: ["Jawab dengan asal negara, misalnya 'Saya dari Jepang'"],
      recent_dialog: '',
    },
    {
      step_id: 'step4',
      step_goal: 'Membicarakan tujuan selanjutnya (kampus/asrama)',
      target_vocab: ['Kamu mau ke asrama?', 'Kita pergi ke kampus'],
      hints: ['Kaitkan percakapan dengan kampus atau asrama'],
      recent_dialog: '',
    },
    {
      step_id: 'step5',
      step_goal: 'Mengucapkan terima kasih sebelum mengakhiri percakapan',
      target_vocab: ['Terima kasih'],
      hints: ["Tutup percakapan dengan sopan, misalnya 'Terima kasih'"],
      recent_dialog: '',
    },
  ];

  constructor(private readonly aiService: LocalBuddyRPController) {}

  getCurrentStep(): ConversationStep {
    return this.conversationSteps[this.currentStepIndex];
  }

  getNextStep(): ConversationStep | null {
    if (this.currentStepIndex < this.conversationSteps.length - 1) {
      return this.conversationSteps[this.currentStepIndex + 1];
    }
    return null;
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
    this.conversationSteps.forEach((step) => {
      step.recent_dialog = '';
    });
  }

  async processUserInput(userInput: string): Promise<string> {
    const currentStep = this.getCurrentStep();

    const aiResponse = await this.aiService.generateText(
      userInput,
      currentStep,
    );

    this.updateRecentDialog(currentStep.step_id, userInput, aiResponse);

    this.conversationHistory.push(`user: ${userInput}`);
    this.conversationHistory.push(`assistant: ${aiResponse}`);

    return aiResponse;
  }

  isConversationComplete(): boolean {
    return this.currentStepIndex >= this.conversationSteps.length - 1;
  }
}
