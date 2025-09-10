import { Injectable } from '@nestjs/common';
import { BaseConversationService } from './base-conversation.service';
import { GenericAIService } from './generic-ai.service';
import {
  ConversationStep,
  ScenarioContext,
  SystemPromptBuilder,
} from '../interfaces/conversation.interface';

// Classroom scenario prompt builder
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

// Classroom scenario conversation steps
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

// Classroom scenario context
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
export class ClassroomConversationService extends BaseConversationService {
  constructor(protected readonly aiService: GenericAIService) {
    super(aiService);
    // Initialize with classroom specific configuration
    this.initializeConversation(
      CLASSROOM_STEPS,
      CLASSROOM_CONTEXT,
      new ClassroomPromptBuilder(),
    );
  }
}
