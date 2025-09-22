import { Injectable } from '@nestjs/common';

export interface TTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number; // 0.25 to 4.0
  format?: 'mp3' | 'opus' | 'aac' | 'flac';
}

@Injectable()
export class TextToSpeechService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly apiUrl = 'https://api.openai.com/v1/audio/speech';

  async generateSpeech(
    text: string,
    options: TTSOptions = {},
  ): Promise<Buffer> {
    try {
      const { voice = 'echo', speed = 1.0, format = 'mp3' } = options;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          input: text,
          voice: voice,
          response_format: format,
          speed: speed,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer);
    } catch (error) {
      console.error('Text-to-speech service error:', error);
      throw new Error('Gagal mengkonversi teks ke audio');
    }
  }

  async generateSpeechWithCustomVoice(
    text: string,
    voice: TTSOptions['voice'] = 'alloy',
  ): Promise<Buffer> {
    return this.generateSpeech(text, { voice });
  }

  async generateSpeechWithSpeed(
    text: string,
    speed: number = 1.0,
  ): Promise<Buffer> {
    return this.generateSpeech(text, { speed });
  }

  async generateSpeechForConversation(
    text: string,
    isUserSpeaking: boolean = false,
  ): Promise<Buffer> {
    // Gunakan voice yang berbeda untuk user dan AI
    const voice = isUserSpeaking ? 'nova' : 'alloy';
    return this.generateSpeech(text, { voice, speed: 1.0 });
  }

  async generateSpeechWithEmotion(
    text: string,
    emotion: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' = 'neutral',
  ): Promise<Buffer> {
    // Pilih voice dan speed berdasarkan emosi
    let voice: TTSOptions['voice'] = 'alloy';
    let speed = 1.0;

    switch (emotion) {
      case 'happy':
      case 'excited':
        voice = 'nova';
        speed = 1.1;
        break;
      case 'sad':
        voice = 'onyx';
        speed = 0.9;
        break;
      case 'calm':
        voice = 'shimmer';
        speed = 0.95;
        break;
      default:
        voice = 'alloy';
        speed = 1.0;
    }

    return this.generateSpeech(text, { voice, speed });
  }

  // Method untuk mendapatkan daftar voice yang tersedia
  getAvailableVoices(): Array<{ name: string; description: string }> {
    return [
      { name: 'alloy', description: 'Suara netral dan seimbang' },
      { name: 'echo', description: 'Suara maskulin dan dalam' },
      { name: 'fable', description: 'Suara feminin dan lembut' },
      { name: 'onyx', description: 'Suara maskulin dan tegas' },
      { name: 'nova', description: 'Suara feminin dan energik' },
      { name: 'shimmer', description: 'Suara feminin dan tenang' },
    ];
  }

  // Method untuk validasi parameter
  validateTTSOptions(options: TTSOptions): boolean {
    if (
      options.voice &&
      !['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'].includes(
        options.voice,
      )
    ) {
      return false;
    }
    if (options.speed && (options.speed < 0.25 || options.speed > 4.0)) {
      return false;
    }
    if (
      options.format &&
      !['mp3', 'opus', 'aac', 'flac'].includes(options.format)
    ) {
      return false;
    }
    return true;
  }

  async generateSpeechStream(
    text: string,
    options: TTSOptions = {},
  ): Promise<ReadableStream> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: options.voice || 'alloy',
          speed: options.speed || 1.0,
          response_format: options.format || 'mp3',
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API Error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body received from TTS API');
      }

      return response.body;
    } catch (error) {
      console.error('TTS streaming error:', error);
      throw new Error('Gagal menggenerate audio stream');
    }
  }
}
