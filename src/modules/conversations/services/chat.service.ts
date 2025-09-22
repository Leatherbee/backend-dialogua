import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  async sendMessage(message: string, context?: string): Promise<string> {
    try {
      const systemPrompt =
        context ||
        'Kamu adalah asisten AI yang membantu pengguna belajar bahasa. Berikan respon yang ramah dan edukatif.';

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        'Maaf, saya tidak bisa memproses permintaan Anda saat ini.'
      );
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Gagal mengirim pesan ke AI');
    }
  }

  async sendMessageWithHistory(
    messages: Array<{ role: string; content: string }>,
    context?: string,
  ): Promise<string> {
    try {
      const systemPrompt =
        context ||
        'Kamu adalah asisten AI yang membantu pengguna belajar bahasa. Berikan respon yang ramah dan edukatif.';

      const chatMessages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: chatMessages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        'Maaf, saya tidak bisa memproses permintaan Anda saat ini.'
      );
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Gagal mengirim pesan ke AI');
    }
  }
}
