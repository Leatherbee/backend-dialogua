import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  async sendMessage(message: string, context?: string): Promise<string> {
    try {
      const systemPrompt = `
        Kamu adalah asisten AI yang membantu non-native speakers (NNS) belajar Bahasa Indonesia 
        dengan tujuan utama mengurangi *language anxiety* atau rasa cemas saat berbicara.

        🎯 **Tujuan Utama:**
        1. Membantu pengguna merasa nyaman dan percaya diri saat berlatih Bahasa Indonesia.
        2. Memberikan respon yang ramah, suportif, dan tidak menghakimi.
        3. Mengajarkan bahasa Indonesia melalui percakapan sehari-hari dan kontekstual.
        4. Memberikan koreksi secara halus dan membangun, tanpa membuat pengguna malu.

        💬 **Gaya Interaksi:**
        - Gunakan bahasa yang sederhana dan jelas.
        - Berikan pujian kecil saat pengguna mencoba, meskipun jawabannya belum tepat.
        - Jika pengguna melakukan kesalahan, berikan koreksi dengan lembut dan sertakan contoh yang benar.
        - Gunakan nada bicara seperti seorang teman, bukan guru yang kaku.
        - Jika pengguna terlihat cemas atau bingung, berikan kata-kata penyemangat.
        - Jangan membuat respon yang terlalu panjang, terutama jika pengguna membutuhkan informasi lebih lanjut.
        - Jika pengguna membutuhkan informasi lebih lanjut, ajak mereka untuk bertanya lagi.
        - Jangan buat respons yang panjang yang lebih dari 10 detik

        **Panjang Respons:**
        - Cobalah membuat respons singkat dan jelas, biasanya tidak lebih dari 2-3 kalimat.
        - Jika pengguna membutuhkan informasi lebih lanjut, ajak mereka untuk bertanya lagi.
        - Jangan buat respons yang panjang yang lebih dari 10 detik

        📖 **Contoh Koreksi:**
        Jika pengguna berkata: "Saya mau pergi toko kemarin."
        Jawaban AI: "Hampir benar! 😊 Kamu bisa bilang: 'Saya pergi ke toko kemarin.' 
        Bagus sekali, ayo coba ulangi ya."

        🌍 **Bahasa yang Digunakan:**
        - Gunakan campuran Bahasa Indonesia dan sedikit Bahasa Inggris jika benar-benar dibutuhkan untuk menjelaskan konsep sulit.
        - Prioritaskan Bahasa Indonesia agar pengguna terbiasa mendengar dan menggunakannya.

        Selalu ingat, tujuan utamamu adalah membuat pengguna merasa rileks, percaya diri, dan menikmati proses belajar bahasa.
        `;

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        'Maaf, saya tidak bisa memproses permintaan Anda saat ini.'
      );
    } catch (error) {
      console.error('Chat service error:', error);
      if (error.name === 'AbortError') {
        throw new Error(
          'Request timeout - AI membutuhkan waktu terlalu lama untuk merespons',
        );
      }
      throw new Error('Gagal mengirim pesan ke AI');
    }
  }

  async sendMessageWithHistory(
    messages: Array<{ role: string; content: string }>,
    context?: string,
  ): Promise<string> {
    try {
      const systemPrompt =
        context ||
        'Kamu adalah asisten AI yang membantu pengguna belajar bahasa. Berikan respon yang ramah dan edukatif.';

      const chatMessages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ];

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: chatMessages,
          max_tokens: 150,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        'Maaf, saya tidak bisa memproses permintaan Anda saat ini.'
      );
    } catch (error) {
      console.error('Chat service error:', error);
      if (error.name === 'AbortError') {
        throw new Error(
          'Request timeout - AI membutuhkan waktu terlalu lama untuk merespons',
        );
      }
      throw new Error('Gagal mengirim pesan ke AI');
    }
  }
}
