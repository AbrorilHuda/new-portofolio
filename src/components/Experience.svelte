<script>
 import { locale } from '$lib/stores/locale';
 import { t } from '$lib/i18n';
  const experiences = [
    {
      id: 1,
      title_id: 'Builder & Organizer',
      title_en: 'Builder & Organizer',
      company_id: 'Dicoding Community Network Universitas Madura',
      company_en: 'Dicoding Community Network Madura University',
      period: '2025 - now',
      description_id: 'Sebagai salah satu inisiator dan builder Dicoding Community Network (DCN) Universitas Madura, saya terlibat dari fase perencanaan hingga eksekusi pembentukan komunitas resmi yang diakui oleh Dicoding Indonesia. Tanggung jawab saya mencakup penyusunan proposal pengajuan, rekrutmen anggota inti, perancangan program kerja, serta koordinasi dengan pihak kampus dan Dicoding untuk mendapatkan endorsement. Keberhasilan dalam membangun DCN Universitas Madura tidak hanya menciptakan ekosistem belajar yang lebih terstruktur, tetapi juga secara resmi menghubungkan kampus dengan sumber belajar dan peluang karir berskala nasional melalui platform Dicoding.',
      description_en: 'As one of the initiators and builders of the Dicoding Community Network (DCN) at Madura University, I was involved from the planning phase to the execution of establishing an official community recognized by Dicoding Indonesia. My responsibilities included drafting the application proposal, recruiting core members, designing work programs, and coordinating with the university and Dicoding to obtain endorsement. The success in building DCN Madura University not only created a more structured learning ecosystem but also officially connected the campus with national-scale learning resources and career opportunities through the Dicoding platform.',
      type: 'work'
    },
    {
      id: 2,
      title_id: 'Asisten Praktikum',
      title_en: 'Assistant Practicum',
      company_id: 'Jurusan Informatika Universitas Madura',
      company_en: 'Informatics Department Madura University',
      period: 'April 2025 - July 2025',
      description_id: 'Sebagai Asisten Praktikum Sistem Operasi, saya bertugas mendampingi dan membimbing mahasiswa dalam memahami konsep-konsep fundamental sistem operasi melalui sesi praktik di laboratorium. Tanggung jawab saya meliputi persiapan materi dan modul praktikum, memberikan demonstrasi langsung penggunaan command line interface (CLI), manajemen proses, memori, dan file system, serta membantu mahasiswa dalam mendiagnosis dan menyelesaikan masalah teknis yang mereka hadapi. Peran ini tidak hanya memperdalam expertise teknis saya di bidang sistem operasi, tetapi juga melatih kemampuan komunikasi, penyampaian materi yang kompleks dengan sederhana, kesabaran, dan kepemimpinan dalam setting edukatif.',
      description_en: 'As an Operating Systems Practicum Assistant, I was responsible for accompanying and guiding students in understanding fundamental operating system concepts through practical laboratory sessions. My responsibilities included preparing materials and practicum modules, providing live demonstrations of command line interface (CLI) usage, process management, memory, and file systems, as well as helping students diagnose and solve technical problems they encountered. This role not only deepened my technical expertise in operating systems but also trained my communication skills, ability to present complex material simply, patience, and leadership in an educational setting.',
      type: 'work'
    },
    {
      id: 3,
      title_id: 'Lead Organizer',
      title_en: 'Lead Organizer',
      company_id: 'Komunitas MaduraDev',
      company_en: 'MaduraDev Community',
      period: '2025 - now',
      description_id: 'Sebagai Lead Organizer MaduraDev, saya memimpin komunitas developer di Pulau Madura dengan visi untuk menumbuhkan ekosistem teknologi lokal. Tugas saya mencakup penyusunan strategi komunitas, perekrutan dan koordinasi tim inti, serta pengorganisasian berbagai event seperti workshop, seminar teknis, dan networking meetup baik secara daring maupun luring. Dan juga berkontribusi dalam pembuatan web komunitas dan lain-lain.',
      description_en: 'As Lead Organizer of MaduraDev, I lead the developer community on Madura Island with a vision to grow the local technology ecosystem. My duties include developing community strategy, recruiting and coordinating the core team, and organizing various events such as workshops, technical seminars, and networking meetups both online and offline. I also contribute to building the community website and other initiatives.',
      type: 'work'
    },
    {
      id: 4,
      title_id: 'Sarjana Ilmu Komputer',
      title_en: 'Bachelor of Computer Science',
      company_id: 'Universitas Madura',
      company_en: 'Madura University',
      period: '2022 - now',
      description_id: 'Saya mahasiswa Universitas Madura yang aktif belajar melalui kontribusi langsung, seperti mengelola komunitas developer (MaduraDev), membangun komunitas belajar bersama Dicoding (DCN UNIRA), dan membantu sesama sebagai asisten praktikum. Saya senang terlibat dalam proyek kolaboratif yang bermanfaat.',
      description_en: 'I am a Madura University student who actively learns through direct contributions, such as managing a developer community (MaduraDev), building a learning community with Dicoding (DCN UNIRA), and helping peers as a practicum assistant. I enjoy being involved in beneficial collaborative projects.',
      type: 'education'
    }
  ];
  
  // Helper function to get localized text
  function getLocalizedText(item, field) {
    return $locale === 'en' ? item[`${field}_en`] : item[`${field}_id`];
  }
</script>

<section id="experience" class="py-24 px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
       {t($locale, 'experience.titlePrefix')} & <span class="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t($locale, 'experience.titleHighlight')}</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        {t($locale, 'experience.tagline')}
      </p>
    </div>
    
    <!-- Timeline -->
    <div class="relative">
      <!-- Vertical Line -->
      <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-600 to-purple-600"></div>
      
      <!-- Timeline Items -->
      <div class="space-y-12">
        {#each experiences as exp, i}
          <div class="relative flex flex-col md:flex-row gap-8 {i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}">
            <!-- Timeline Dot -->
            <div class="absolute left-8 md:left-1/2 w-4 h-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-full transform -translate-x-1/2 shadow-lg">
              <div class="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-75"></div>
            </div>
            
            <!-- Content Card -->
            <div class="md:w-1/2 {i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}">
              <div class="ml-16 md:ml-0 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div class="flex items-center gap-2 mb-2 {i % 2 === 0 ? 'md:justify-end' : ''}">
                  {#if exp.type === 'work'}
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  {:else}
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  {/if}
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{exp.period}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{getLocalizedText(exp, 'title')}</h3>
                <p class="text-blue-600 dark:text-blue-400 font-medium mb-3">{getLocalizedText(exp, 'company')}</p>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{getLocalizedText(exp, 'description')}</p>
              </div>
            </div>
            
            <div class="md:w-1/2"></div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
