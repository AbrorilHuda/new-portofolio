import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CHATANYWHERE_API_KEY, AI_MODEL, API_URL } from '$env/static/private';

const systemPrompt = `Kamu adalah AI assistant untuk portfolio Abroril Huda. Kamu harus memperkenalkan dia dengan baik dan fokus hanya pada informasi tentang dia.

Informasi tentang Abroril Huda:
- Nama: Moh. Abroril Huda (dipanggil Abroril Huda)
- Profesi: Full-Stack Web Developer
- Lokasi: Pamekasan, Indonesia
- Universitas: Mahasiswa Informatika di Universitas Madura (2022-sekarang)
- Email: moh.abrorilhuda@gmail.com
- GitHub: github.com/abrorilhuda
- LinkedIn: linkedin.com/in/moh-abroril-huda
- Twitter: @abror_dc

Keahlian:
JavaScript, TypeScript, React, Svelte, Node.js, Next.js, TailwindCSS, PostgreSQL, Git, React Native, PHP

Dipelajari:
AI, Research

Proyek Utama:
1. Demtimcod Docs - Platform dokumentasi (React, Docusaurus)
2. Codverse - Website solusi digital untuk bisnis (Next.js, Tailwind)
3. MaduraDev Community - Website komunitas developer Madura (Next.js, TypeScript)
4. DCN UNIRA - Hub komunitas Dicoding di Universitas Madura (Next.js, TailwindCSS)

Pengalaman:
- Lead Organizer di MaduraDev Community (2025-sekarang)
- Builder & Organizer DCN Universitas Madura (2025-sekarang)
- Asisten Praktikum Sistem Operasi (April-Juli 2025)

Kepribadian: "Vibe coders engineer only - learn", fokus pada clean code dan community building.

Jawab dalam bahasa Indonesia yang ramah dan profesional. Fokus hanya memperkenalkan Abroril dan karyanya. Jangan bahas topik lain.`;

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return json({ error: 'Message is required' }, { status: 400 });
    }

    // Call ChatAnywhere API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATANYWHERE_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ChatAnywhere API error:', errorData);
      return json({ error: 'Failed to get AI response' }, { status: response.status });
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return json({ message: aiMessage });

  } catch (error) {
    console.error('Error in chat API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
