import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  ConversationStep,
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
    stepContext: ConversationStep,
    scenarioContext: ScenarioContext,
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
    - Selalu tunggu respons pengguna sebelum lanjut ke topik berikutnya.
    - Output harus dalam JSON dengan 2 key: "ai_response" dan "meta".

    Struktur Percakapan (modular, urut dan bertahap) namun bisa tetap fleksibel:
    1. Sapaan 
    2. Perkenalan nama 
    3. Asal negara 
    4. Tujuan setelah dari bandara
    5. Penutup ramah 

    Fallback dan Kontrol Konteks:
    - Jika pengguna diam → ulangi pertanyaan dengan versi lebih mudah.
      Contoh: "Nama kamu siapa?" → "Siapa nama kamu?"
    - Jika pengguna keluar konteks → arahkan kembali dengan kalimat ramah.
      Contoh: "Mungkin maksud kamu adalah perkenalan."
    - Jangan ganti nama. Tetap gunakan "Yudha".
    - Jangan lompat langsung ke semua pertanyaan. Ikuti urutan di atas.

    Kriteria Percakapan Sukses:
    - Sudah terjadi sapaan.
    - Sudah menyebut nama masing-masing.
    - Sudah menyebut asal negara.
    - Ada penutup ramah saling senang bertemu.

    Improvisasi:
    - Boleh menambahkan topik ringan di luar Step Goal, selama tetap ramah dan tidak melanggar batasan di atas.
    - Step Goal hanya panduan, bukan aturan kaku.

    Struktur JSON yang wajib:
    {
      "ai_response": "<teks murni balasan, tanpa emoji, maksimal 2 kalimat>",
      "meta": {
        "step_id": "${stepContext.step_id}",
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
      "step_id": "${stepContext.step_id}",
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
    Current Step: ${stepContext.step_id}
    Step Goal: ${stepContext.step_goal}
    Target Vocabulary: ${JSON.stringify(stepContext.target_vocab)}
    Hints: ${JSON.stringify(stepContext.hints)}

    [RECENT DIALOG]
    ${stepContext.recent_dialog ?? ''}

    [USER INPUT]`;
  }
}

export const LOCAL_BUDDY_STEPS: ConversationStep[] = [
  {
    step_id: 'step1',
    step_goal: 'Menyapa di bandara',
    target_vocab: ['Halo', 'Selamat pagi', 'Selamat siang', 'Selamat malam'],
    hints: ["Mulai dengan salam sederhana seperti 'Halo' atau 'Selamat siang'"],
    recent_dialog: '',
  },
  {
    step_id: 'step2',
    step_goal: 'Tukar nama dengan sopan',
    target_vocab: ['Nama saya...', 'Siapa nama kamu?'],
    hints: ["Sebutkan nama kamu dengan 'Nama saya ...'"],
    recent_dialog: '',
  },
  {
    step_id: 'step3',
    step_goal: 'Menyebutkan asal negara',
    target_vocab: ['Saya dari...', 'Dari mana asal kamu?'],
    hints: ["Jawab dengan asal negara, misalnya 'Saya dari Jepang'"],
    recent_dialog: '',
  },
  {
    step_id: 'step4',
    step_goal: 'Membicarakan tujuan selanjutnya (kampus/asrama)',
    target_vocab: ['Kamu mau ke asrama?', 'Kita pergi ke kampus'],
    hints: ['Kaitkan percakapan dengan kampus atau asrama'],
    recent_dialog: '',
  },
  {
    step_id: 'step5',
    step_goal: 'Mengucapkan terima kasih sebelum mengakhiri percakapan',
    target_vocab: ['Terima kasih'],
    hints: ["Tutup percakapan dengan sopan, misalnya 'Terima kasih'"],
    recent_dialog: '',
  },
];

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
    'Selalu tunggu respons pengguna sebelum lanjut ke topik berikutnya.',
    'Ikuti urutan modular secara luwes; boleh fleksibel tetapi tetap jaga alur.',
    "Jangan ganti nama. Tetap gunakan 'Yudha'.",
    'Boleh menambahkan topik ringan di luar Step Goal selama tetap ramah dan tidak melanggar batasan.',
    'Jika pengguna diam, ulangi pertanyaan dengan versi lebih mudah.',
    'Jika pengguna keluar konteks, arahkan kembali dengan kalimat ramah.',
    'Jangan sisipkan emoji/ekspresi di teks utama. Ekspresi hanya di meta.expressions.',
  ],
  technical_requirements: [
    'Output WAJIB berupa JSON valid dengan key: "ai_response" (string) dan "meta" (object).',
    'Skema meta: {"step_id":"{step_id}","expected_vocab_matched":[],"hints_used":false,"expressions":[{"sentence":1,"label":"smile"}]}',
    'Panjang "meta.expressions" harus sama dengan jumlah kalimat pada "ai_response" (maks 2).',
    'Nilai "label" hanya boleh salah satu dari: ["smile","warm","neutral","thinking","confused","surprised","encouraging","apologetic"].',
  ],
};

// Classroom specific data
export class ClassroomPromptBuilder implements SystemPromptBuilder {
  buildPrompt(
    stepContext: ConversationStep,
    scenarioContext: ScenarioContext,
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

    [SCENARIO CONTEXT]
    Scenario Code: ${scenarioContext.scenario_code}
    Scenario Title: ${scenarioContext.scenario_title}
    Current Step: ${stepContext.step_id}
    Step Goal: ${stepContext.step_goal}
    Target Vocabulary: ${JSON.stringify(stepContext.target_vocab)}
    Hints: ${JSON.stringify(stepContext.hints)}

    [RECENT DIALOG]
    ${stepContext.recent_dialog ?? ''}

    [USER INPUT]`;
  }
}

export const CLASSROOM_STEPS: ConversationStep[] = [
  {
    step_id: 'step1',
    step_goal: 'Menyapa guru dan teman di kelas',
    target_vocab: ['Selamat pagi', 'Perkenalkan', 'Nama saya'],
    hints: ['Mulai dengan salam dan perkenalan diri'],
    recent_dialog: '',
  },
  {
    step_id: 'step2',
    step_goal: 'Bertanya tentang mata pelajaran',
    target_vocab: ['Apa pelajaran hari ini?', 'Saya ingin belajar...'],
    hints: ['Tunjukkan minat pada pelajaran'],
    recent_dialog: '',
  },
  {
    step_id: 'step3',
    step_goal: 'Meminta bantuan saat tidak mengerti',
    target_vocab: ['Saya tidak mengerti', 'Bisa diulang?', 'Bagaimana cara...'],
    hints: ['Gunakan frasa sopan saat meminta bantuan'],
    recent_dialog: '',
  },
  {
    step_id: 'step4',
    step_goal: 'Berpartisipasi dalam diskusi kelas',
    target_vocab: ['Saya setuju', 'Menurut saya', 'Pendapat yang menarik'],
    hints: ['Bagikan pendapat dengan sopan'],
    recent_dialog: '',
  },
  {
    step_id: 'step5',
    step_goal: 'Mengucapkan salam perpisahan',
    target_vocab: ['Terima kasih', 'Sampai jumpa', 'Selamat tinggal'],
    hints: ['Akhiri interaksi dengan sopan'],
    recent_dialog: '',
  },
];

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
  ],
  technical_requirements: [
    'Di akhir setiap balasan, sertakan terjemahan singkat dalam bahasa Inggris dalam tanda kurung.',
    "Contoh: 'Selamat pagi! (Good morning!)'",
  ],
};

@Injectable()
export class ChatService {
  private client: OpenAI;
  private currentStepIndex = 0;
  private conversationHistory: string[] = [];
  private conversationSteps: ConversationStep[] = [];
  private scenarioContext: ScenarioContext | null = null;
  private promptBuilder: SystemPromptBuilder | null = null;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  // Initialize conversation with specific scenario
  initializeConversation(scenario: ChatScenario): void {
    this.currentStepIndex = 0;
    this.conversationHistory = [];

    switch (scenario) {
      case 'local-buddy':
      case 'officer':
        this.conversationSteps = LOCAL_BUDDY_STEPS;
        this.scenarioContext = LOCAL_BUDDY_CONTEXT;
        this.promptBuilder = new LocalBuddyPromptBuilder();
        break;
      case 'classroom':
      case 'hotel-receptionist':
        this.conversationSteps = CLASSROOM_STEPS;
        this.scenarioContext = CLASSROOM_CONTEXT;
        this.promptBuilder = new ClassroomPromptBuilder();
        break;
      default:
        // Default to local buddy
        this.conversationSteps = LOCAL_BUDDY_STEPS;
        this.scenarioContext = LOCAL_BUDDY_CONTEXT;
        this.promptBuilder = new LocalBuddyPromptBuilder();
    }

    // Reset recent_dialog for all steps
    this.conversationSteps.forEach((step) => {
      step.recent_dialog = '';
    });
  }

  getCurrentStep(): ConversationStep | null {
    if (this.conversationSteps.length === 0) return null;
    return this.conversationSteps[this.currentStepIndex];
  }

  getNextStep(): ConversationStep | null {
    if (
      this.conversationSteps.length === 0 ||
      this.currentStepIndex >= this.conversationSteps.length - 1
    ) {
      return null;
    }
    return this.conversationSteps[this.currentStepIndex + 1];
  }

  updateRecentDialog(
    stepId: string,
    userMessage: string,
    aiResponse: string,
  ): void {
    const step = this.conversationSteps.find((s) => s.step_id === stepId);
    if (step) {
      step.recent_dialog = `${step.recent_dialog || ''}
user: ${userMessage}
assistant: ${aiResponse}`;
    }
  }

  advanceToNextStep(): boolean {
    if (this.currentStepIndex < this.conversationSteps.length - 1) {
      this.currentStepIndex++;
      return true;
    }
    return false;
  }

  resetConversation(): void {
    this.currentStepIndex = 0;
    this.conversationHistory = [];
    // Reset recent_dialog for all steps
    this.conversationSteps.forEach((step) => {
      step.recent_dialog = '';
    });
  }

  async processUserInput(userInput: string): Promise<AIResponse> {
    if (!this.scenarioContext || !this.promptBuilder) {
      throw new Error(
        'Conversation not initialized. Call initializeConversation first.',
      );
    }

    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      throw new Error('No conversation steps defined.');
    }

    const systemPrompt = this.promptBuilder.buildPrompt(
      currentStep,
      this.scenarioContext,
    );

    const aiResponse: AIResponse = await this.generateJson(
      userInput,
      systemPrompt,
    );

    this.updateRecentDialog(
      currentStep.step_id,
      userInput,
      aiResponse.ai_response,
    );

    this.conversationHistory.push(`user: ${userInput}`);
    this.conversationHistory.push(`assistant: ${aiResponse.ai_response}`);

    return aiResponse;
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

    content = this.stripCodeFences(content);

    // Parse JSON
    try {
      const parsedResponse = JSON.parse(content) as AIResponse;
      return parsedResponse;
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

  isConversationComplete(): boolean {
    return (
      this.conversationSteps.length > 0 &&
      this.currentStepIndex >= this.conversationSteps.length - 1
    );
  }

  getConversationProgress(): {
    currentStep: number;
    totalSteps: number;
    percentage: number;
  } {
    if (this.conversationSteps.length === 0) {
      return { currentStep: 0, totalSteps: 0, percentage: 0 };
    }

    const currentStep = this.currentStepIndex + 1;
    const totalSteps = this.conversationSteps.length;
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return { currentStep, totalSteps, percentage };
  }

  getAvailableScenarios(): ChatScenario[] {
    return ['local-buddy', 'classroom', 'officer', 'hotel-receptionist'];
  }
}
