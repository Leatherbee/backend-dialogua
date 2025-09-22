import { Injectable } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TextToSpeechService } from './text-to-speech.service';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationContext {
  conversationId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ChatToSpeechService {
  private conversations: Map<string, ConversationContext> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly textToSpeechService: TextToSpeechService,
  ) {}

  /**
   * Membuat conversation baru dengan system message
   */
  createConversation(
    conversationId: string,
    systemMessage?: string,
  ): ConversationContext {
    const messages: ChatMessage[] = [];

    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }

    const conversation: ConversationContext = {
      conversationId,
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversations.set(conversationId, conversation);
    return conversation;
  }

  /**
   * Mendapatkan conversation berdasarkan ID
   */
  getConversation(conversationId: string): ConversationContext | null {
    return this.conversations.get(conversationId) || null;
  }

  /**
   * Menambahkan pesan user ke conversation
   */
  addUserMessage(conversationId: string, message: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push({
        role: 'user',
        content: message,
      });
      conversation.updatedAt = new Date();
    }
  }

  /**
   * Menambahkan pesan assistant ke conversation
   */
  addAssistantMessage(conversationId: string, message: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push({
        role: 'assistant',
        content: message,
      });
      conversation.updatedAt = new Date();
    }
  }

  /**
   * Mendapatkan semua pesan dalam conversation
   */
  getConversationMessages(conversationId: string): ChatMessage[] {
    const conversation = this.conversations.get(conversationId);
    return conversation ? conversation.messages : [];
  }

  /**
   * Menghapus conversation
   */
  deleteConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  /**
   * Membersihkan conversation yang sudah lama (lebih dari 24 jam)
   */
  cleanupOldConversations(): void {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    for (const [id, conversation] of this.conversations.entries()) {
      if (conversation.updatedAt < twentyFourHoursAgo) {
        this.conversations.delete(id);
      }
    }
  }

  /**
   * Mengirim pesan dengan context dan mendapatkan response AI
   */
  async sendMessageWithContext(
    conversationId: string,
    userMessage: string,
    systemMessage?: string,
  ): Promise<string> {
    // Buat conversation baru jika belum ada
    if (!this.conversations.has(conversationId)) {
      this.createConversation(conversationId, systemMessage);
    }

    // Tambahkan pesan user
    this.addUserMessage(conversationId, userMessage);

    // Dapatkan semua pesan untuk context
    const messages = this.getConversationMessages(conversationId);

    // Kirim ke AI dengan context
    const aiResponse = await this.chatService.sendMessageWithHistory(
      messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    );

    // Tambahkan response AI ke conversation
    this.addAssistantMessage(conversationId, aiResponse);

    return aiResponse;
  }

  /**
   * Mengirim pesan dengan context dan convert ke speech
   */
  async sendMessageWithContextAndSpeech(
    conversationId: string,
    userMessage: string,
    options: {
      systemMessage?: string;
      voice?: string;
      format?: string;
    } = {},
  ): Promise<{
    userMessage: string;
    aiResponse: string;
    audioBuffer: Buffer;
    conversationContext: ChatMessage[];
  }> {
    // Dapatkan AI response dengan context
    const aiResponse = await this.sendMessageWithContext(
      conversationId,
      userMessage,
      options.systemMessage,
    );

    // Convert AI response ke speech
    const audioBuffer = await this.textToSpeechService.generateSpeech(
      aiResponse,
      {
        voice: options.voice as any,
        format: options.format as any,
      },
    );

    // Return semua data
    return {
      userMessage,
      aiResponse,
      audioBuffer,
      conversationContext: this.getConversationMessages(conversationId),
    };
  }

  /**
   * Mendapatkan statistik conversation
   */
  getConversationStats(conversationId: string): {
    messageCount: number;
    userMessages: number;
    assistantMessages: number;
    systemMessages: number;
    createdAt?: Date;
    updatedAt?: Date;
  } | null {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    const stats = {
      messageCount: conversation.messages.length,
      userMessages: conversation.messages.filter((m) => m.role === 'user')
        .length,
      assistantMessages: conversation.messages.filter(
        (m) => m.role === 'assistant',
      ).length,
      systemMessages: conversation.messages.filter((m) => m.role === 'system')
        .length,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };

    return stats;
  }

  /**
   * Mendapatkan daftar semua conversation IDs
   */
  getAllConversationIds(): string[] {
    return Array.from(this.conversations.keys());
  }

  /**
   * Reset conversation (hapus semua pesan kecuali system message)
   */
  resetConversation(conversationId: string): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;

    // Simpan system message jika ada
    const systemMessages = conversation.messages.filter(
      (m) => m.role === 'system',
    );

    conversation.messages = systemMessages;
    conversation.updatedAt = new Date();

    return true;
  }
}
