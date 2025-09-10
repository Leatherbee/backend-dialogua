import { Injectable } from '@nestjs/common';
import { BaseConversationService } from '../base-conversation.service';
import { OpenAIService } from '../openai.service';
import {
  ConversationStep,
  ScenarioContext,
  SystemPromptBuilder,
} from '../../interfaces/conversation.interface';

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

Struktur Percakapan (modular, urut dan bertahap):
1. Sapaan → "Selamat siang!"
2. Perkenalan nama → "Nama saya Yudha. Nama kamu siapa?"
3. Asal negara → "Kamu dari mana?"
4. Tujuan ke kampus → "Ayo kita ke kampus Universitas Negeri."
5. Penutup ramah → "Senang bertemu kamu!"

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

Tambahan teknis:
- Di akhir setiap balasan, keluarkan satu baris META JSON dalam tag <META>...</META> dengan format:
<META>{"step_id":"${stepContext.step_id}","expected_vocab_matched":[],"hints_used":false}</META>

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

// Local Buddy specific conversation steps
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
    'Ikuti urutan modular step 1 sampai 5, jangan melompat.',
    "Jangan ganti nama. Tetap gunakan 'Yudha'.",
    'Boleh menambahkan topik ringan di luar Step Goal, selama tetap ramah dan tidak melanggar batasan.',
    'Step Goal hanya panduan, bukan aturan kaku.',
    'Jika pengguna diam, ulangi pertanyaan dengan versi lebih mudah.',
    'Jika pengguna keluar konteks, arahkan kembali dengan kalimat ramah.',
  ],
  technical_requirements: [
    'Di akhir setiap balasan, keluarkan satu baris META JSON dalam tag <META>...</META> dengan format:',
    '<META>{"step_id":"{step_id}","expected_vocab_matched":[],"hints_used":false}</META>',
  ],
};

@Injectable()
export class LocalBuddyConversationService extends BaseConversationService {
  constructor(protected readonly aiService: OpenAIService) {
    super(aiService);
    this.initializeConversation(
      LOCAL_BUDDY_STEPS,
      LOCAL_BUDDY_CONTEXT,
      new LocalBuddyPromptBuilder(),
    );
  }
}
