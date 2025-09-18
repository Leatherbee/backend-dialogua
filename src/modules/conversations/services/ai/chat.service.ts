import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  ScenarioContext,
  SystemPromptBuilder,
  AIResponse,
} from '../../interfaces/conversation.interface';

// Define the available chat scenarios
export type ChatScenario =
  | 'local-buddy'
  | 'classroom'
  | 'officer'
  | 'hotel-receptionist';

// Local Buddy specific data
export class LocalBuddyPromptBuilder implements SystemPromptBuilder {
  buildPrompt(
    userInput: string,
    scenarioContext: ScenarioContext,
    conversationHistory: string[],
  ): string {
    return `
    Anda adalah teman sebaya mahasiswa lokal bernama **Yudha**.
    Konteks: menjemput pelajar internasional baru di bandara.
    Persona: ramah, santai, sopan. Gunakan kalimat pendek dan mudah dipahami level BIPA1.
    Gunakan Bahasa Indonesia saja, tanpa terjemahan ke bahasa lain kecuali diminta.

    Gaya:
    - Balasan maksimal 2 kalimat.
    - Gunakan kalimat sederhana (SPOK dasar).
    - Jangan menjelaskan grammar.
    - Jangan beralih ke bahasa lain.
    - Output harus dalam JSON dengan 2 key: "ai_response" dan "meta".

    Struktur Percakapan (fleksibel dan responsif terhadap input pengguna):
    - Responsif terhadap topik yang dibawa pengguna
    - Bisa beralih topik dengan alami jika pengguna mengganti topik
    - Fokus pada interaksi yang nyaman dan tidak kaku

    Fallback dan Kontrol Konteks:
    - Jika pengguna diam → ajak obrol dengan topik ringan.
    - Jika pengguna keluar konteks → arahkan kembali dengan kalimat ramah.
    - Jangan ganti nama. Tetap gunakan "Yudha".

    Kriteria Percakapan Sukses:
    - Interaksi yang nyaman dan alami
    - Respons yang sesuai dengan input pengguna
    - Menjaga suasana ramah dan santai

    Struktur JSON yang wajib:
    {
      "ai_response": "<teks murni balasan, tanpa emoji, maksimal 2 kalimat>",
      "meta": {
        "expected_vocab_matched": [],
        "hints_used": false,
        "expressions": [
          { "sentence": 1, "label": "<lihat daftar label>" }
        ]
      }
    }

    Aturan expressions:
    - Panjang array = jumlah kalimat dalam balasan (maksimal 2).
    - label hanya boleh dari: ["smile","warm","neutral","thinking","confused","surprised","encouraging","apologetic"].

    Contoh keluaran yang benar:
    "Selamat siang! Senang bertemu kamu.",
    "meta": {
      "expected_vocab_matched": ["Selamat siang"],
      "hints_used": false,
      "expressions": [
        { "sentence": 1, "label": "smile" },
        { "sentence": 2, "label": "warm" }
      ]
    }

    [SCENARIO CONTEXT]
    Scenario Code: ${scenarioContext.scenario_code}
    Scenario Title: ${scenarioContext.scenario_title}
    Persona: ${scenarioContext.persona}

    [CONVERSATION HISTORY]
    ${conversationHistory.join('\n')}

    [USER INPUT]
    ${userInput}`;
  }
}

export class LocalBuddyInitialPromptBuilder implements SystemPromptBuilder {
  buildPrompt(userInput: string, scenarioContext: ScenarioContext): string {
    return `
    Anda adalah teman sebaya mahasiswa lokal bernama **Yudha**.
    Konteks: menjemput pelajar internasional baru di bandara.
    Persona: ramah, santai, sopan. Gunakan kalimat pendek dan mudah dipahami level BIPA1.
    Gunakan Bahasa Indonesia saja, tanpa terjemahan ke bahasa lain kecuali diminta.

    Tugas Anda:
    Buatlah sambutan awal yang ramah dan hangat untuk memulai percakapan.
    Sambutan ini akan menjadi pesan pertama yang dilihat pengguna ketika memasuki tampilan role-play.

    Gaya:
    - Balasan maksimal 2 kalimat.
    - Gunakan kalimat sederhana (SPOK dasar).
    - Jangan menjelaskan grammar.
    - Jangan beralih ke bahasa lain.
    - Output harus dalam JSON dengan 2 key: "ai_response" dan "meta".

    Struktur JSON yang wajib:
    {
      "ai_response": "<teks murni balasan, tanpa emoji, maksimal 2 kalimat>",
      "meta": {
        "expected_vocab_matched": [],
        "hints_used": false,
        "expressions": [
          { "sentence": 1, "label": "<lihat daftar label>" }
        ]
      }
    }

    Aturan expressions:
    - Panjang array = jumlah kalimat dalam balasan (maksimal 2).
    - label hanya boleh dari: ["smile","warm","neutral","thinking","confused","surprised","encouraging","apologetic"].

    Contoh keluaran yang benar:
    "Halo! Senang bertemu denganmu di bandara.",
    "meta": {
      "expected_vocab_matched": ["Halo"],
      "hints_used": false,
      "expressions": [
        { "sentence": 1, "label": "smile" },
        { "sentence": 2, "label": "warm" }
      ]
    }

    [SCENARIO CONTEXT]
    Scenario Code: ${scenarioContext.scenario_code}
    Scenario Title: ${scenarioContext.scenario_title}
    Persona: ${scenarioContext.persona}

    [USER INPUT]
    ${userInput}`;
  }
}

export const LOCAL_BUDDY_CONTEXT: ScenarioContext = {
  scenario_code: 'airport_pickup_bipa1',
  scenario_title: 'Airport Pickup – Universitas Negeri',
  persona:
    'Anda adalah teman sebaya mahasiswa lokal bernama Yudha yang menjemput pelajar internasional baru di bandara.',
  style_guidelines: [
    'Maksimal 2 kalimat per balasan.',
    'Gunakan kalimat sederhana (SPOK dasar).',
    'Jangan menjelaskan grammar.',
    'Jangan beralih ke bahasa lain.',
    'Responsif terhadap input pengguna.',
    "Jangan ganti nama. Tetap gunakan 'Yudha'.",
    'Boleh menambahkan topik ringan di luar konteks selama tetap ramah.',
    'Jika pengguna diam, ajak obrol dengan topik ringan.',
    'Jika pengguna keluar konteks, arahkan kembali dengan kalimat ramah.',
    'Jangan sisipkan emoji/ekspresi di teks utama. Ekspresi hanya di meta.expressions.',
  ],
  technical_requirements: [
    'Output WAJIB berupa JSON valid dengan key: "ai_response" (string) dan "meta" (object).',
    'Skema meta: {"expected_vocab_matched":[],"hints_used":false,"expressions":[{"sentence":1,"label":"smile"}]}',
    'Panjang "meta.expressions" harus sama dengan jumlah kalimat pada "ai_response" (maks 2).',
    'Nilai "label" hanya boleh salah satu dari: ["smile","warm","neutral","thinking","confused","surprised","encouraging","apologetic"].',
  ],
};

// Classroom specific data
export class ClassroomPromptBuilder implements SystemPromptBuilder {
  buildPrompt(
    userInput: string,
    scenarioContext: ScenarioContext,
    conversationHistory: string[],
  ): string {
    return `
    ${scenarioContext.persona}
    
    Tujuan: ${scenarioContext.scenario_title}.
    Gunakan Bahasa Indonesia saja, tanpa terjemahan ke bahasa lain kecuali diminta.

    Gaya:
    ${scenarioContext.style_guidelines.map((guideline) => `- ${guideline}`).join('\n    ')}

    ${
      scenarioContext.technical_requirements?.length
        ? `Tambahan teknis:\n    ${scenarioContext.technical_requirements.map((req) => `- ${req}`).join('\n    ')}`
        : ''
    }

    Struktur Percakapan (fleksibel dan responsif terhadap input pengguna):
    - Responsif terhadap topik yang dibawa pengguna
    - Bisa beralih topik dengan alami jika pengguna mengganti topik
    - Fokus pada interaksi yang mendukung pembelajaran

    [SCENARIO CONTEXT]
    Scenario Code: ${scenarioContext.scenario_code}
    Scenario Title: ${scenarioContext.scenario_title}
    Persona: ${scenarioContext.persona}

    [CONVERSATION HISTORY]
    ${conversationHistory.join('\n')}

    [USER INPUT]
    ${userInput}`;
  }
}

export class ClassroomInitialPromptBuilder implements SystemPromptBuilder {
  buildPrompt(userInput: string, scenarioContext: ScenarioContext): string {
    return `
    ${scenarioContext.persona}
    
    Tujuan: ${scenarioContext.scenario_title}.
    Gunakan Bahasa Indonesia saja, tanpa terjemahan ke bahasa lain kecuali diminta.

    Tugas Anda:
    Buatlah sambutan awal yang ramah dan mendukung untuk memulai sesi pembelajaran.
    Sambutan ini akan menjadi pesan pertama yang dilihat pengguna ketika memasuki tampilan role-play.

    Gaya:
    ${scenarioContext.style_guidelines.map((guideline) => `- ${guideline}`).join('\n    ')}

    ${
      scenarioContext.technical_requirements?.length
        ? `Tambahan teknis:\n    ${scenarioContext.technical_requirements.map((req) => `- ${req}`).join('\n    ')}`
        : ''
    }

    [SCENARIO CONTEXT]
    Scenario Code: ${scenarioContext.scenario_code}
    Scenario Title: ${scenarioContext.scenario_title}
    Persona: ${scenarioContext.persona}

    [USER INPUT]
    ${userInput}`;
  }
}

export const CLASSROOM_CONTEXT: ScenarioContext = {
  scenario_code: 'classroom_bipa1',
  scenario_title: 'Kelas Bahasa Indonesia untuk Pemula',
  persona:
    'Anda adalah **guru bahasa Indonesia yang ramah dan sabar** yang mengajar siswa internasional.',
  style_guidelines: [
    'Gunakan kalimat pendek dan jelas.',
    'Berikan pujian untuk memotivasi siswa.',
    'Gunakan teknik pengulangan untuk memperkuat pembelajaran.',
    'Jangan menggunakan bahasa yang terlalu formal.',
    'Responsif terhadap input pengguna.',
  ],
  technical_requirements: [
    'Di akhir setiap balasan, sertakan terjemahan singkat dalam bahasa Inggris dalam tanda kurung.',
    "Contoh: 'Selamat pagi! (Good morning!)'",
  ],
};

@Injectable()
export class ChatService {
  private client: OpenAI;

  // Per-session state
  private sessions = new Map<
    string,
    {
      conversationHistory: string[];
      scenarioContext: ScenarioContext;
      promptBuilder: SystemPromptBuilder;
      initialPromptBuilder: SystemPromptBuilder;
      scenario: ChatScenario;
    }
  >();

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  // Create or reinitialize a session with a specific scenario
  initializeConversation(sessionId: string, scenario: ChatScenario): void {
    switch (scenario) {
      case 'local-buddy':
      case 'officer': {
        this.sessions.set(sessionId, {
          conversationHistory: [],
          scenarioContext: LOCAL_BUDDY_CONTEXT,
          promptBuilder: new LocalBuddyPromptBuilder(),
          initialPromptBuilder: new LocalBuddyInitialPromptBuilder(),
          scenario,
        });
        break;
      }
      case 'classroom':
      case 'hotel-receptionist': {
        this.sessions.set(sessionId, {
          conversationHistory: [],
          scenarioContext: CLASSROOM_CONTEXT,
          promptBuilder: new ClassroomPromptBuilder(),
          initialPromptBuilder: new ClassroomInitialPromptBuilder(),
          scenario,
        });
        break;
      }
      default: {
        // Default to local buddy
        this.sessions.set(sessionId, {
          conversationHistory: [],
          scenarioContext: LOCAL_BUDDY_CONTEXT,
          promptBuilder: new LocalBuddyPromptBuilder(),
          initialPromptBuilder: new LocalBuddyInitialPromptBuilder(),
          scenario: 'local-buddy',
        });
      }
    }
  }

  // Ensure a session exists; if not, initialize it
  ensureSession(sessionId: string, scenario: ChatScenario): void {
    if (!this.sessions.has(sessionId)) {
      this.initializeConversation(sessionId, scenario);
    }
  }

  // Reset only the conversation history for a given session
  resetConversation(sessionId: string): void {
    const s = this.sessions.get(sessionId);
    if (s) {
      s.conversationHistory = [];
    }
  }

  async generateInitialMessage(sessionId: string): Promise<AIResponse> {
    const s = this.sessions.get(sessionId);
    if (!s) {
      throw new Error(
        'Conversation not initialized. Call initializeConversation first.',
      );
    }

    const initialPrompt = s.initialPromptBuilder.buildPrompt(
      'Sambut pengguna dengan hangat dan ramah untuk memulai percakapan.',
      s.scenarioContext,
      [],
    );

    const aiResponse: AIResponse = await this.generateJson(
      'Sambut pengguna dengan hangat dan ramah untuk memulai percakapan.',
      initialPrompt,
    );

    return aiResponse;
  }

  async processUserInput(
    sessionId: string,
    userInput: string,
  ): Promise<AIResponse> {
    const s = this.sessions.get(sessionId);
    if (!s) {
      throw new Error(
        'Conversation not initialized. Call initializeConversation first.',
      );
    }

    // Add user input to conversation history
    s.conversationHistory.push(`user: ${userInput}`);

    const systemPrompt = s.promptBuilder.buildPrompt(
      userInput,
      s.scenarioContext,
      s.conversationHistory,
    );

    const aiResponse: AIResponse = await this.generateJson(
      userInput,
      systemPrompt,
    );

    // Add AI response to conversation history
    s.conversationHistory.push(`assistant: ${aiResponse.ai_response}`);

    return aiResponse;
  }

  async generateJson(
    userInput: string,
    systemPrompt: string,
    model = 'gpt-4.1-mini',
    maxTokens = 400,
    temperature = 0.7,
  ): Promise<AIResponse> {
    const resp = await this.client.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
    });

    let content = resp.choices[0]?.message?.content ?? '';

    content = this.stripCodeFences(content);

    // Parse JSON
    try {
      const raw = JSON.parse(content) as any;
      // Coerce ai_response to a plain string to avoid non-string objects reaching TTS
      let aiText: string;
      const v = raw?.ai_response;
      if (typeof v === 'string') {
        aiText = v;
      } else if (Array.isArray(v)) {
        aiText = v
          .filter((x) => typeof x === 'string')
          .join(' ')
          .trim();
      } else if (v && typeof v === 'object' && typeof v.text === 'string') {
        aiText = v.text;
      } else {
        aiText = String(v ?? '');
      }

      aiText = this.stripCodeFences(aiText).replace(/\s+/g, ' ').trim();

      return {
        ai_response: aiText,
        meta: raw?.meta ?? {
          expected_vocab_matched: [],
          hints_used: false,
          expressions: [],
        },
      } as AIResponse;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error(`LLM returned non-JSON: ${content}`);
    }
  }

  private stripCodeFences(s: string) {
    return s
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
  }

  getAvailableScenarios(): ChatScenario[] {
    return ['local-buddy', 'classroom', 'officer', 'hotel-receptionist'];
  }
}
