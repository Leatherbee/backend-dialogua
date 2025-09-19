import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { Roleplay } from './entities/roleplay.entity';
import {
  CreateRoleplayDto,
  UpdateRoleplayDto,
  ProcessSpeechDto,
  ProcessSpeechResponseDto,
} from './dto';

@Injectable()
export class RoleplayService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Roleplay)
    private readonly roleplayRepository: Repository<Roleplay>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async create(createRoleplayDto: CreateRoleplayDto): Promise<Roleplay> {
    const roleplay = this.roleplayRepository.create(createRoleplayDto);
    return await this.roleplayRepository.save(roleplay);
  }

  async findAll(): Promise<Roleplay[]> {
    return await this.roleplayRepository.find({
      relations: ['turns'],
    });
  }

  async findByLevel(levelId: string): Promise<Roleplay[]> {
    return await this.roleplayRepository.find({
      where: { level_id: levelId },
      relations: ['turns'],
    });
  }

  async findOne(id: number): Promise<Roleplay> {
    const roleplay = await this.roleplayRepository.findOne({
      where: { id },
      relations: ['turns'],
    });

    if (!roleplay) {
      throw new NotFoundException(`Roleplay with ID ${id} not found`);
    }

    return roleplay;
  }

  async update(
    id: number,
    updateRoleplayDto: UpdateRoleplayDto,
  ): Promise<Roleplay> {
    const roleplay = await this.findOne(id);
    Object.assign(roleplay, updateRoleplayDto);
    return await this.roleplayRepository.save(roleplay);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.roleplayRepository.softDelete(id);
  }

  async processSpeech(
    roleplayId: number,
    processSpeechDto: ProcessSpeechDto,
  ): Promise<ProcessSpeechResponseDto> {
    // Find the roleplay
    const roleplay = await this.findOne(roleplayId);

    try {
      // Convert base64 audio data to buffer for OpenAI
      const audioBuffer = Buffer.from(
        processSpeechDto.audioData.split(',')[1],
        'base64',
      );

      // Create a file-like object for OpenAI
      const audioFile = new File([audioBuffer], 'audio.wav', {
        type: 'audio/wav',
      });

      // Convert audio to text using OpenAI Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: processSpeechDto.language || 'en',
      });

      const userMessage = transcription.text;

      // Generate AI response based on roleplay character
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are ${roleplay.character_name}. ${roleplay.character_description}. 
                     Scenario: ${roleplay.scenario}. 
                     Instructions: ${roleplay.instructions}
                     Respond in character and keep the conversation engaging.`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      const aiResponse =
        completion.choices[0]?.message?.content ||
        'I apologize, but I could not generate a response.';

      // Get the current turn order (simplified - could be enhanced)
      const turnOrder = 1; // This could be calculated based on existing turns

      return {
        transcribedText: userMessage,
        aiResponse: aiResponse,
        turnOrder: turnOrder,
        metadata: {
          confidence: 0.95, // This could be extracted from transcription if available
          processingTime: Date.now() / 1000, // Simple timestamp
          language: processSpeechDto.language || 'en',
        },
      };
    } catch (error) {
      throw new Error(`Speech processing failed: ${error.message}`);
    }
  }
}
