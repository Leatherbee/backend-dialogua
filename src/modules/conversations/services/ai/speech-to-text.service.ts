import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class SpeechToTextService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    try {
      // Convert Buffer to Uint8Array for OpenAI
      const uint8Array = new Uint8Array(audioBuffer);
      const file = new File([uint8Array], fileName, { type: 'audio/mpeg' });

      const transcription = await this.client.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        response_format: 'text',
      });

      return transcription as string;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  async transcribeAudioWithDetails(
    audioBuffer: Buffer,
    fileName: string,
  ): Promise<any> {
    try {
      // Convert Buffer to Uint8Array for OpenAI
      const uint8Array = new Uint8Array(audioBuffer);
      const file = new File([uint8Array], fileName, { type: 'audio/mpeg' });

      const transcription = await this.client.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['word', 'segment'],
      });

      return transcription;
    } catch (error) {
      console.error('Error transcribing audio with details:', error);
      throw new Error(
        `Failed to transcribe audio with details: ${error.message}`,
      );
    }
  }
}
