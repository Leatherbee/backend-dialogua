import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { buildBuddySystemPrompt } from 'src/utils/buddy-system-prompt';

@Injectable()
export class LocalBuddyRPController {
  private client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateText(
    userInput: string,
    stepContext: {
      step_id: string;
      step_goal: string;
      target_vocab: string[];
      hints: string[];
      recent_dialog?: string;
    },
  ): Promise<string> {
    try {
      const systemPrompt = buildBuddySystemPrompt(stepContext);

      const response = await this.client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput },
        ],
        max_tokens: 500,
        temperature: 0.4,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating text with OpenAI:', error);
      throw new Error('Failed to generate text with OpenAI');
    }
  }
}
