<script lang="ts">
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";

  interface ExperienceItem {
    id: number;
    title_id: string;
    title_en: string;
    company_id: string;
    company_en: string;
    period_id: string;
    period_en: string;
    badge_id?: string;
    badge_en?: string;
    description_id: string;
    description_en: string;
    highlights_id: string[];
    highlights_en: string[];
    type: "work" | "education";
  }

  const experiences: ExperienceItem[] = [
    {
      id: 1,
      title_id: "Fullstack Developer (Proyek Klien & Freelance)",
      title_en: "Fullstack Developer (Client & Freelance Projects)",
      company_id: "Proyek Independen & Klien UMKM",
      company_en: "Independent & SME Client Projects",
      period_id: "2023 - 2026",
      period_en: "2023 - 2026",
      description_id:
        "Merancang, membangun, dan men-deploy aplikasi web end-to-end untuk kebutuhan bisnis, katalog layanan, dan sistem internal klien menggunakan Laravel, React, Next.js, dan PostgreSQL.",
      description_en:
        "Designed, built, and deployed end-to-end web applications for business operations, service catalogs, and internal client systems using Laravel, React, Next.js, and PostgreSQL.",
      highlights_id: [
        "Mengembangkan 5+ aplikasi web live dari tahap perancangan database, API backend, antarmuka responsif, hingga deployment di VPS Linux dengan Docker dan Nginx.",
        "Membangun platform studio fotografi Margasera (portofolio, booking, dashboard admin, galeri seleksi foto) serta Presentation Deck berbasis Next.js dan Gemini API.",
        "Mengotomatiskan alur rilis dengan GitHub Actions (CI/CD) dan Cloudflare untuk menjaga stabilitas dan kecepatan akses produksi.",
      ],
      highlights_en: [
        "Delivered 5+ live web applications from database design, backend APIs, and responsive front-ends to Linux VPS deployments with Docker and Nginx.",
        "Built the Margasera photography studio platform (portfolio, booking, admin dashboard, client photo selection gallery) and an AI-assisted Presentation Deck app with Next.js and Gemini API.",
        "Automated production deployments using GitHub Actions (CI/CD) and Cloudflare for reliable uptime and performance.",
      ],
      type: "work",
    },
    {
      id: 2,
      title_id: "Lead Organizer",
      title_en: "Lead Organizer",
      company_id: "Komunitas MaduraDev",
      company_en: "MaduraDev Community",
      period_id: "Jan 2024 - 2026",
      period_en: "Jan 2024 - 2026",
      description_id:
        "Memimpin komunitas developer di Pulau Madura untuk menumbuhkan ekosistem teknologi lokal melalui kegiatan kolaboratif dan pengembangan platform komunitas.",
      description_en:
        "Leading the developer community on Madura Island to grow the local tech ecosystem through collaborative events and community web platforms.",
      highlights_id: [
        "Mengelola komunitas dengan 200+ anggota aktif serta mengorganisir 5+ workshop teknis, tech talk, dan networking meetup daring maupun luring.",
        "Membangun dan memelihara portal madura.dev menggunakan Next.js, TypeScript, dan Tailwind CSS.",
      ],
      highlights_en: [
        "Grew and coordinated a community of 200+ active members, organizing 5+ technical workshops, tech talks, and networking meetups.",
        "Built and maintained the madura.dev community portal using Next.js, TypeScript, and Tailwind CSS.",
      ],
      type: "work",
    },
    {
      id: 3,
      title_id: "Builder & Organizer",
      title_en: "Builder & Organizer",
      company_id: "Dicoding Community Network (DCN) Universitas Madura",
      company_en: "Dicoding Community Network (DCN) Universitas Madura",
      period_id: "Agu 2024 - 2026",
      period_en: "Aug 2024 - 2026",
      description_id:
        "Menginisiasi dan membangun komunitas belajar resmi Dicoding di lingkungan Universitas Madura dari penyusunan program hingga eksekusi kegiatan.",
      description_en:
        "Initiated and built the official Dicoding learning community chapter at Universitas Madura from program planning to event execution.",
      highlights_id: [
        "Memfasilitasi program belajar bersertifikat dan sesi workshop pemrograman bagi 100+ peserta di lingkungan kampus.",
        "Membangun hub aktivitas komunitas dcnunira.dev berbasis Next.js dan Tailwind CSS.",
      ],
      highlights_en: [
        "Facilitated certified learning programs and coding workshops for 100+ campus participants.",
        "Built the dcnunira.dev community activity hub with Next.js and Tailwind CSS.",
      ],
      type: "work",
    },
    {
      id: 4,
      title_id: "Asisten Praktikum Sistem Operasi",
      title_en: "Operating Systems Practicum Assistant",
      company_id: "Laboratorium Informatika, Universitas Madura",
      company_en: "Informatics Laboratory, Universitas Madura",
      period_id: "Apr 2025 - Jul 2025",
      period_en: "Apr 2025 - Jul 2025",
      description_id:
        "Mendampingi sesi praktikum laboratorium Sistem Operasi dan membantu peserta memahami konsep fundamental Linux secara praktis.",
      description_en:
        "Guided Operating Systems laboratory sessions and helped students master fundamental Linux concepts through hands-on practice.",
      highlights_id: [
        "Membimbing 60+ peserta praktikum dalam penggunaan Linux CLI, manajemen proses, memori, file system, dan Bash scripting.",
        "Menyusun modul evaluasi teknis dan mendampingi troubleshooting langsung selama sesi laboratorium.",
      ],
      highlights_en: [
        "Mentored 60+ students in Linux CLI usage, process management, memory, file systems, and Bash scripting.",
        "Prepared technical evaluation modules and led hands-on troubleshooting during lab sessions.",
      ],
      type: "work",
    },
    {
      id: 5,
      title_id: "S1 Informatika (Lulus)",
      title_en: "B.Sc. in Informatics (Graduated)",
      company_id: "Universitas Madura",
      company_en: "Universitas Madura",
      period_id: "2022 - 2026",
      period_en: "2022 - 2026",
      badge_id: "IPK 3.59 / 4.00",
      badge_en: "GPA 3.59 / 4.00",
      description_id:
        "Lulusan S1 Informatika Universitas Madura dengan peminatan Business Intelligence dan IPK 3.59 / 4.00. Aktif mengembangkan aplikasi web fullstack serta memimpin komunitas developer kampus dan lokal.",
      description_en:
        "B.Sc. in Informatics graduate from Universitas Madura with a Business Intelligence concentration and a 3.59 / 4.00 GPA. Actively built fullstack web applications while leading campus and local developer communities.",
      highlights_id: [
        "Peminatan Business Intelligence dengan IPK akhir 3.59 / 4.00.",
        "Aktif menginisiasi komunitas DCN UNIRA, memimpin MaduraDev, dan bertugas sebagai asisten praktikum Sistem Operasi.",
      ],
      highlights_en: [
        "Business Intelligence concentration with a 3.59 / 4.00 GPA.",
        "Co-founded DCN UNIRA, led MaduraDev, and served as an Operating Systems practicum assistant.",
      ],
      type: "education",
    },
  ];

  function getLocalizedText(item: ExperienceItem, field: "title" | "company" | "period" | "description" | "badge") {
    const key = ($locale === "en" ? `${field}_en` : `${field}_id`) as keyof ExperienceItem;
    return item[key] as string | undefined;
  }

  function getLocalizedHighlights(item: ExperienceItem): string[] {
    return $locale === "en" ? item.highlights_en : item.highlights_id;
  }
</script>

<section
  id="experience"
  class="py-20 md:py-32 px-6 lg:px-8 bg-gray-50 dark:bg-zinc-950/20 border-y border-gray-200/30 dark:border-white/5"
>
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-16">
      <h2
        class="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
      >
        {t($locale, "experience.titlePrefix")} &
        <span
          class="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >{t($locale, "experience.titleHighlight")}</span
        >
      </h2>
      <p
        class="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"
      >
        {t($locale, "experience.tagline")}
      </p>
    </div>

    <!-- Timeline -->
    <div class="relative">
      <!-- Vertical Line -->
      <div
        class="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-600 to-purple-600"
      ></div>

      <!-- Timeline Items -->
      <div class="space-y-12">
        {#each experiences as exp, i (exp.id)}
          <div
            class="relative flex flex-col md:flex-row gap-8 {i % 2 === 0
              ? 'md:flex-row'
              : 'md:flex-row-reverse'}"
          >
            <!-- Timeline Dot -->
            <div
              class="absolute left-8 md:left-1/2 w-4 h-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-full transform -translate-x-1/2 shadow-lg"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-75"
              ></div>
            </div>

            <!-- Content Card -->
            <div
              class="md:w-1/2 {i % 2 === 0
                ? 'md:pr-12'
                : 'md:pl-12'}"
            >
              <div
                class="ml-16 md:ml-0 bg-white dark:bg-gray-800/90 border border-gray-200/60 dark:border-white/5 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-left"
              >
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    {#if exp.type === "work"}
                      <svg
                        class="w-5 h-5 text-blue-600 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    {:else}
                      <svg
                        class="w-5 h-5 text-purple-600 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    {/if}
                    <span
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >{getLocalizedText(exp, "period")}</span
                    >
                  </div>
                  {#if getLocalizedText(exp, "badge")}
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    >
                      {getLocalizedText(exp, "badge")}
                    </span>
                  {/if}
                </div>

                <h3
                  class="text-xl font-bold text-gray-900 dark:text-white mb-1"
                >
                  {getLocalizedText(exp, "title")}
                </h3>
                <p class="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">
                  {getLocalizedText(exp, "company")}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  {getLocalizedText(exp, "description")}
                </p>

                {#if getLocalizedHighlights(exp).length > 0}
                  <ul class="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 list-disc pl-4 leading-relaxed">
                    {#each getLocalizedHighlights(exp) as bullet}
                      <li>{bullet}</li>
                    {/each}
                  </ul>
                {/if}
              </div>
            </div>

            <div class="md:w-1/2"></div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
