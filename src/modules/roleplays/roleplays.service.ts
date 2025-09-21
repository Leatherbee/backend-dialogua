import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleplayDto } from './dto/create-roleplay.dto';
import { UpdateRoleplayDto } from './dto/update-roleplay.dto';
import {
  RoleplayMessageDto,
  RoleplayResponseDto,
} from './dto/roleplay-interaction.dto';
import { Roleplay } from './entities/roleplay.entity';
import { RoleplayTurn } from './entities/roleplay-turn.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoleplaysService {
  constructor(
    @InjectRepository(Roleplay)
    private roleplayRepository: Repository<Roleplay>,
    @InjectRepository(RoleplayTurn)
    private roleplayTurnRepository: Repository<RoleplayTurn>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(_createRoleplayDto: CreateRoleplayDto) {
    return 'This action adds a new roleplay';
  }

  findAll() {
    return this.roleplayRepository.find({
      relations: ['level', 'turns'],
    });
  }

  findOne(id: string) {
    return this.roleplayRepository.findOne({
      where: { id },
      relations: ['level', 'turns'],
    });
  }

  update(id: string, _updateRoleplayDto: UpdateRoleplayDto) {
    return `This action updates a #${id} roleplay`;
  }

  remove(id: string) {
    return `This action removes a #${id} roleplay`;
  }

  async getNpcTurns(roleplayId: string, options?: { turnOrder?: number }) {
    const roleplay = await this.roleplayRepository.findOne({
      where: { id: roleplayId },
      relations: ['turns'],
    });

    if (!roleplay) {
      throw new NotFoundException('Roleplay not found');
    }

    // Filter untuk mendapatkan hanya NPC turns
    let npcTurns = roleplay.turns.filter((turn) => turn.speaker === 'npc');

    // Filter berdasarkan turnOrder jika disediakan
    if (options?.turnOrder !== undefined) {
      npcTurns = npcTurns.filter((turn) => turn.turnOrder <= options.turnOrder);
    }

    // Sort berdasarkan turnOrder
    npcTurns.sort((a, b) => a.turnOrder - b.turnOrder);

    return {
      roleplayId,
      npcTurns: npcTurns.map((turn) => ({
        id: turn.id,
        turnOrder: turn.turnOrder,
        speaker: turn.speaker,
        message: turn.message,
        videoUrl: turn.videoUrl,
        createdAt: turn.createdAt,
      })),
      totalNpcTurns: npcTurns.length,
    };
  }

  async sendMessage(
    roleplayId: string,
    messageDto: RoleplayMessageDto,
  ): Promise<RoleplayResponseDto> {
    // Find the roleplay
    const roleplay = await this.roleplayRepository.findOne({
      where: { id: roleplayId },
      relations: ['level'],
    });

    if (!roleplay) {
      throw new NotFoundException('Roleplay not found');
    }

    // Validate user exists
    const user = await this.userRepository.findOneBy({
      id: messageDto.userId as any,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get template turns (read-only reference data)
    const templateTurns = await this.roleplayTurnRepository.find({
      where: { roleplay: { id: roleplayId } },
      order: { turnOrder: 'ASC' },
    });

    // Get all user turns from template for vocabulary checking
    const userTurnsInTemplate = templateTurns.filter(
      (turn) => turn.speaker === 'user',
    );

    if (userTurnsInTemplate.length === 0) {
      throw new NotFoundException('No template conversation found');
    }

    // Check user message against ALL possible user turns in template
    // and find the best match
    let bestMatch = null;
    let bestMatchScore = 0;

    for (const templateUserTurn of userTurnsInTemplate) {
      const vocabularyCheck = this.checkStrictVocabulary(
        messageDto.message,
        templateUserTurn.message,
      );

      if (vocabularyCheck.isCorrect) {
        // Found exact match
        bestMatch = {
          templateTurn: templateUserTurn,
          vocabularyCheck: vocabularyCheck,
          isExactMatch: true,
        };
        break;
      }

      // Calculate partial match score for potential feedback
      const userWords = messageDto.message.toLowerCase().split(/\s+/);
      const templateWords = templateUserTurn.message.toLowerCase().split(/\s+/);
      const matchingWords = userWords.filter((word) =>
        templateWords.some((templateWord) => templateWord.includes(word)),
      );
      const score = matchingWords.length / templateWords.length;

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = {
          templateTurn: templateUserTurn,
          vocabularyCheck: vocabularyCheck,
          isExactMatch: false,
        };
      }
    }

    if (!bestMatch) {
      // No match found at all
      return {
        message: messageDto.message,
        turnOrder: 0,
        speaker: 'user',
        isMatched: false,
        sessionId: messageDto.sessionId,
        metadata: {
          expectedVocabMatched: [],
          hintsUsed: false,
          feedback:
            'Maaf, saya tidak mengerti. Silakan coba dengan kalimat yang sesuai dengan konteks percakapan.',
        },
      };
    }

    if (bestMatch.isExactMatch) {
      // Exact match found - return user message with matched status
      return {
        message: messageDto.message,
        turnOrder: bestMatch.templateTurn.turnOrder,
        speaker: 'user',
        isMatched: true,
        sessionId: messageDto.sessionId,
        metadata: {
          expectedVocabMatched:
            bestMatch.vocabularyCheck.metadata?.expectedVocabMatched || [],
          hintsUsed: false,
          feedback: 'Vocabulary matched successfully!',
        },
      };
    } else {
      // Partial match - return user message with feedback
      return {
        message: messageDto.message,
        turnOrder: bestMatch.templateTurn.turnOrder,
        speaker: 'user',
        isMatched: false,
        sessionId: messageDto.sessionId,
        metadata: {
          expectedVocabMatched:
            bestMatch.vocabularyCheck.metadata?.expectedVocabMatched || [],
          hintsUsed: false,
          feedback: bestMatch.vocabularyCheck.feedback,
        },
      };
    }
  }

  private checkStrictVocabulary(
    userMessage: string,
    expectedMessage: string,
  ): {
    isCorrect: boolean;
    feedback: string;
    metadata: {
      expectedVocabMatched?: string[];
      hintsUsed?: boolean;
      expressions?: { sentence: number; label: string }[];
    };
  } {
    // Clean and normalize both messages
    const cleanUserMessage = userMessage
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();
    const cleanExpectedMessage = expectedMessage
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();

    // Extract words from both messages
    const userWords = cleanUserMessage
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const expectedWords = cleanExpectedMessage
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Check if all expected words are present in user message
    const matchedWords = expectedWords.filter((word) =>
      userWords.includes(word),
    );
    const matchPercentage = (matchedWords.length / expectedWords.length) * 100;

    // Strict checking: require 100% match
    if (matchPercentage === 100) {
      return {
        isCorrect: true,
        feedback: 'Bagus sekali! Anda menggunakan vocabulary yang tepat.',
        metadata: {
          expectedVocabMatched: matchedWords,
          hintsUsed: false,
          expressions: [{ sentence: 1, label: 'encouraging' }],
        },
      };
    } else {
      const missingWords = expectedWords.filter(
        (word) => !userWords.includes(word),
      );
      return {
        isCorrect: false,
        feedback: `Maaf, jawaban Anda belum tepat. Silakan coba lagi dengan menggunakan kata-kata: "${expectedMessage}". Kata yang hilang: ${missingWords.join(', ')}.`,
        metadata: {
          expectedVocabMatched: matchedWords,
          hintsUsed: false,
          expressions: [{ sentence: 1, label: 'apologetic' }],
        },
      };
    }
  }

  private async checkVocabularyAndGenerateResponse(
    roleplay: Roleplay,
    userMessage: string,
  ): Promise<{
    message: string;
    videoUrl?: string;
    metadata?: any;
  }> {
    try {
      // Get current turn order (the turn the user just made)
      const currentTurnOrder = roleplay.turns.length + 1;

      // Find the expected user turn for this turn order from the predefined roleplay_turns
      const expectedUserTurn = await this.roleplayTurnRepository.findOne({
        where: {
          roleplay: { id: roleplay.id },
          speaker: 'user',
          turnOrder: currentTurnOrder,
        },
      });

      // If no expected turn found, get all user turns for general vocabulary checking
      let expectedMessage = '';
      let allUserTurns: RoleplayTurn[] = [];

      if (expectedUserTurn) {
        expectedMessage = expectedUserTurn.message;
      } else {
        // Fallback: get all predefined user turns for vocabulary checking
        allUserTurns = await this.roleplayTurnRepository.find({
          where: {
            roleplay: { id: roleplay.id },
            speaker: 'user',
          },
          order: { turnOrder: 'ASC' },
        });
      }

      // Extract expected vocabulary
      let expectedVocab: string[] = [];

      if (expectedMessage) {
        // Use specific expected message for this turn
        expectedVocab = expectedMessage
          .toLowerCase()
          .replace(/[^\w\s]/g, '') // Remove punctuation
          .split(/\s+/)
          .filter((word) => word.length > 0); // Include all words
      } else {
        // Use all user turns vocabulary as fallback
        allUserTurns.forEach((turn) => {
          if (turn.message) {
            const words = turn.message
              .toLowerCase()
              .replace(/[^\w\s]/g, '')
              .split(/\s+/)
              .filter((word) => word.length > 0);
            expectedVocab.push(...words);
          }
        });
        // Remove duplicates for fallback
        expectedVocab = [...new Set(expectedVocab)];
      }

      // Check which vocabulary from user input matches expected vocabulary
      const userWords = userMessage
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const matchedVocab = userWords.filter((word) =>
        expectedVocab.includes(word),
      );

      // Calculate match percentage
      const matchPercentage =
        expectedVocab.length > 0
          ? (matchedVocab.length / expectedVocab.length) * 100
          : 0;

      // Generate response based on vocabulary match
      let responseMessage: string;
      let feedback: string;

      if (matchPercentage >= 70) {
        responseMessage =
          'Bagus sekali! Anda menggunakan vocabulary yang tepat.';
        feedback = 'excellent';
      } else if (matchPercentage >= 40) {
        responseMessage =
          'Cukup baik! Coba gunakan lebih banyak vocabulary yang sesuai.';
        feedback = 'good';
      } else {
        responseMessage =
          'Coba lagi! Perhatikan vocabulary yang diharapkan dalam skenario ini.';
        feedback = 'needs_improvement';
      }

      // Add some context-specific encouragement
      if (matchedVocab.length > 0) {
        responseMessage += ` Vocabulary yang benar: ${matchedVocab.join(', ')}.`;
      }

      // Add suggestions for missing vocabulary
      if (matchPercentage < 70 && expectedVocab.length > 0) {
        const missingVocab = expectedVocab.filter(
          (word) => !matchedVocab.includes(word),
        );
        if (missingVocab.length > 0) {
          responseMessage += ` Coba gunakan kata-kata ini: ${missingVocab.slice(0, 3).join(', ')}.`;
        }
      }

      return {
        message: responseMessage,
        metadata: {
          expectedVocabMatched: matchedVocab,
          expectedVocabTotal: expectedVocab,
          matchPercentage: Math.round(matchPercentage),
          feedback: feedback,
          hintsUsed: false,
          userInput: userMessage,
          expectedMessage:
            expectedMessage || 'No specific expected message for this turn',
          currentTurnOrder: currentTurnOrder,
        },
      };
    } catch (err) {
      throw new HttpException(
        'Failed to check vocabulary and generate response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
