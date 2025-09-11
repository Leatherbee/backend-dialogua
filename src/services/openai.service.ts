import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AIResponse } from '../interfaces/conversation.interface';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateJson(
    userInput: string,
    systemPrompt: string,
    model = 'gpt-4.1-mini',
    maxTokens = 400,
    temperature = 0.4,
  ): Promise<AIResponse> {
    const resp = await this.client.chat.completions.create({
      model,
      response_format: { type: 'json_object' }, // JSON mode
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
    });

    let content = resp.choices[0]?.message?.content ?? '';

    content = stripCodeFences(content);

    // Parse JSON
    try {
      const parsedResponse = JSON.parse(content) as AIResponse;
      return parsedResponse;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error(`LLM returned non-JSON: ${content}`);
    }
  }
}

function stripCodeFences(s: string) {
  return s
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}
