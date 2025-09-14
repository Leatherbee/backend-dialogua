import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Readable } from 'stream';

@Injectable()
export class TextToSpeechService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateSpeech(
    text: string,
    model: string = 'tts-1',
    voice: string = 'alloy',
    response_format: string = 'mp3',
    speed: number = 1.0,
  ): Promise<Buffer> {
    try {
      const response = await this.client.audio.speech.create({
        model,
        voice: voice as any,
        input: text,
        response_format: response_format as any,
        speed,
      });

      // Convert the response to a buffer
      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  async generateSpeechStream(
    text: string,
    model: string = 'tts-1',
    voice: string = 'alloy',
    response_format: string = 'mp3',
    speed: number = 1.0,
  ): Promise<Readable> {
    try {
      const response = await this.client.audio.speech.create({
        model,
        voice: voice as any,
        input: text,
        response_format: response_format as any,
        speed,
      });
      const webStream = response.body as unknown as ReadableStream<Uint8Array>;
      // Node 18+ provides Readable.fromWeb
      const nodeStream = (Readable as any).fromWeb
        ? (Readable as any).fromWeb(webStream)
        : Readable.from(webStream as any);
      return nodeStream as Readable;
    } catch (error) {
      console.error('Error generating speech stream:', error);
      throw new Error(`Failed to generate speech stream: ${error.message}`);
    }
  }
}
