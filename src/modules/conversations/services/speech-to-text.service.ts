import { Injectable } from '@nestjs/common';

@Injectable()
export class SpeechToTextService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly apiUrl = 'https://api.openai.com/v1/audio/transcriptions';

  async transcribeAudio(
    audioBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    try {
      const formData = new FormData();
      const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
        type: 'audio/mpeg',
      });
      const audioFile = new File([audioBlob], filename, {
        type: 'audio/mpeg',
      });

      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      formData.append('language', 'id'); // Indonesian language

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Speech-to-text service error:', error);
      throw new Error('Gagal mengkonversi audio ke teks');
    }
  }

  async transcribeAudioWithLanguage(
    audioBuffer: Buffer,
    filename: string,
    language: string = 'id',
  ): Promise<string> {
    try {
      const formData = new FormData();
      const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
        type: 'audio/mpeg',
      });
      const audioFile = new File([audioBlob], filename, {
        type: 'audio/mpeg',
      });

      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      formData.append('language', language);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Speech-to-text service error:', error);
      throw new Error('Gagal mengkonversi audio ke teks');
    }
  }
}
