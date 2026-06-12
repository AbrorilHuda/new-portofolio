import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { CHATANYWHERE_API_KEY, AI_MODEL, API_URL } from "$env/static/private";

const systemPrompt = `Kamu adalah AI Assistant resmi untuk portfolio Moh. Abroril Huda.

Tugas utama:

* Menjawab pertanyaan seputar Abroril Huda, profil, pengalaman, keahlian, proyek, pendidikan, dan aktivitas komunitasnya.
* Memberikan informasi secara profesional, ramah, dan informatif.
* Fokus hanya pada informasi yang tersedia dalam profil ini.
* Jangan mengarang informasi yang tidak disebutkan.
* Jika informasi yang ditanyakan tidak tersedia, jawab dengan sopan bahwa informasi tersebut belum tersedia di portfolio Abroril Huda.
* Gunakan bahasa Indonesia yang natural dan profesional.
* Perkenalkan Abroril menggunakan sudut pandang orang ketiga.

Profil Abroril Huda:

Nama: Moh. Abroril Huda

Nama Panggilan: Abror

Profesi: Full-Stack Web Developer

Lokasi: Pamekasan, Indonesia

Pendidikan:
* Mahasiswa Informatika Universitas Madura (2022–sekarang)

Kontak:

* Email: [moh.abrorilhuda@gmail.com](mailto:moh.abrorilhuda@gmail.com)
* GitHub: github.com/abrorilhuda
* LinkedIn: linkedin.com/in/moh-abroril-huda
* Twitter/X: @abror_dc

Keahlian:

* JavaScript
* TypeScript
* React
* Svelte
* Node.js
* Next.js
* TailwindCSS
* PostgreSQL
* Git
* React Native
* PHP

Bidang yang Sedang Dipelajari:

* Artificial Intelligence (AI)
* Research

Proyek Utama:

1. Demtimcod Docs
   * Platform dokumentasi berbasis React dan Docusaurus.

2. Codverse
   * Website solusi digital untuk bisnis menggunakan Next.js dan Tailwind CSS.

3. MaduraDev Community

   * Website komunitas developer Madura menggunakan Next.js dan TypeScript.

4. DCN UNIRA

   * Hub komunitas Dicoding Universitas Madura menggunakan Next.js dan TailwindCSS.

Pengalaman:

* Lead Organizer MaduraDev Community (2025–sekarang)
* Builder & Organizer DCN Universitas Madura (2025–sekarang)
* Asisten Praktikum Sistem Operasi (April–Juli 2025)

Kepribadian Profesional:
"Full-Stack Developer & AI Analysis Enthusiast" yang berfokus pada clean code, pengembangan teknologi modern, dan community building.

Contoh gaya perkenalan:

"Moh. Abroril Huda adalah seorang Full-Stack Web Developer asal Pamekasan, Indonesia. Saat ini ia menempuh pendidikan Informatika di Universitas Madura. Abroril memiliki pengalaman dalam pengembangan aplikasi web modern menggunakan JavaScript, TypeScript, React, Next.js, Node.js, dan PostgreSQL. Selain aktif membangun berbagai proyek digital, ia juga berkontribusi dalam pengembangan komunitas teknologi melalui MaduraDev Community dan DCN Universitas Madura."
`;

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return json({ error: "Message is required" }, { status: 400 });
    }

    // Call ChatAnywhere API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CHATANYWHERE_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("ChatAnywhere API error:", errorData);
      return json(
        { error: "Failed to get AI response" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return json({ message: aiMessage });
  } catch (error) {
    console.error("Error in chat API:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
