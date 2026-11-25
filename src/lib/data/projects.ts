export interface ProjectCaseStudy {
  problem: string;
  role: string;
  solution: string[];
  impact: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  description_id?: string;
  description_en?: string;
  image: string;
  technologies: string[];
  link: string;
  repoUrl?: string;
  icon?: string;
  featured?: boolean;
  category_id?: string;
  category_en?: string;
  caseStudy_id?: ProjectCaseStudy;
  caseStudy_en?: ProjectCaseStudy;
}

export const projects: Project[] = [
  {
    id: 6,
    title: 'Presentation Deck',
    description:
      'Platform SaaS slide presentasi berbasis web dengan bantuan AI untuk membantu mahasiswa dan pemateri menyusun presentasi lebih cepat.',
    description_id:
      'Platform SaaS slide presentasi berbasis web dengan bantuan AI untuk membantu mahasiswa dan pemateri menyusun presentasi lebih cepat.',
    description_en:
      'AI-powered web presentation deck platform built to help students and speakers create structured slides faster.',
    image:
      'https://32ily8ib82.ucarecd.net/4abf756f-b6ac-4ba6-8a10-bf1d29ed688e/presentasionapp.png',
    technologies: ['Next.js', 'TypeScript', 'Gemini API', 'Markdown', 'Tailwind CSS'],
    link: 'https://slide.dcnunira.dev',
    icon: 'presentation',
    featured: true,
    category_id: 'Platform Produk',
    category_en: 'Product Platform',
    caseStudy_id: {
      problem:
        'Mahasiswa dan pemateri komunitas sering menghabiskan waktu berjam-jam hanya untuk merapikan layout slide presentasi sebelum sesi kuliah atau tech talk.',
      role: 'Fullstack Developer — merancang arsitektur aplikasi, integrasi Gemini API, editor berbasis Markdown, hingga deployment produksi.',
      solution: [
        'Membangun editor slide berbasis Markdown yang otomatis mengubah teks terstruktur menjadi deck presentasi siap tampil.',
        'Mengintegrasikan Gemini API untuk membantu membuat kerangka materi dan menyempurnakan poin presentasi.',
        'Menyediakan mode presentasi langsung di browser yang responsif di layar proyektor maupun perangkat mobile.',
      ],
      impact:
        'Memangkas waktu persiapan slide untuk pemateri dan mahasiswa di lingkungan DCN UNIRA dan komunitas developer lokal.',
    },
    caseStudy_en: {
      problem:
        'Students and community speakers often spend hours formatting presentation layouts before lectures or tech talks instead of focusing on content.',
      role: 'Fullstack Developer — designed the application architecture, Gemini API integration, Markdown-based slide editor, and production deployment.',
      solution: [
        'Built a Markdown-driven slide editor that automatically turns structured notes into clean presentation decks.',
        'Integrated the Gemini API to assist with generating outlines and refining slide talking points.',
        'Implemented a responsive browser presentation mode ready for projectors and mobile devices.',
      ],
      impact:
        'Significantly reduced slide preparation time for speakers and students across DCN UNIRA and local developer sessions.',
    },
  },
  {
    id: 4,
    title: 'MaduraDev',
    description:
      'Portal resmi komunitas developer Madura untuk menampilkan profil talenta lokal, jadwal event, dan inisiatif open-source.',
    description_id:
      'Portal resmi komunitas developer Madura untuk menampilkan profil talenta lokal, jadwal event, dan inisiatif open-source.',
    description_en:
      'Official community portal for Madura developers showcasing local tech talent, community events, and open-source initiatives.',
    image:
      'https://32ily8ib82.ucarecd.net/519fe07d-e17b-4b57-b2ef-d6f2948955a9/maduradev.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    link: 'https://madura.dev',
    icon: 'users',
    featured: true,
    category_id: 'Platform Komunitas',
    category_en: 'Community Platform',
    caseStudy_id: {
      problem:
        'Komunitas developer di Madura sebelumnya belum memiliki pusat informasi daring yang rapi untuk publikasi event, kolaborasi, dan memperkenalkan talenta teknologi lokal.',
      role: 'Lead Organizer & Fullstack Developer — mengembangkan arsitektur web modular, desain antarmuka, dan pemeliharaan berkelanjutan bersama tim inti.',
      solution: [
        'Membangun portal komunitas dengan Next.js dan TypeScript yang cepat diakses serta ramah SEO.',
        'Menyusun struktur komponen modular agar kontributor komunitas mudah menambahkan halaman kegiatan dan informasi baru.',
        'Mengoptimalkan tampilan responsif dan performa halaman untuk pengunjung dari perangkat mobile.',
      ],
      impact:
        'Menjadi pusat informasi resmi bagi 200+ anggota komunitas MaduraDev serta rujukan publikasi berbagai workshop dan meetup.',
    },
    caseStudy_en: {
      problem:
        'Developers in Madura lacked a centralized web presence to publish tech events, coordinate collaboration, and showcase local engineering talent.',
      role: 'Lead Organizer & Fullstack Developer — built the modular web architecture, UI design, and ongoing maintenance alongside the core team.',
      solution: [
        'Built a fast, SEO-friendly community portal using Next.js and TypeScript.',
        'Structured reusable, modular components so community contributors can easily add new events and pages.',
        'Optimized responsive layouts and page performance for mobile-first visitors.',
      ],
      impact:
        'Serves as the official digital hub for 200+ MaduraDev community members and a central reference for workshops and meetups.',
    },
  },
  {
    id: 7,
    title: 'Margasera',
    description:
      'Website portofolio studio fotografi lengkap dengan sistem booking, dashboard admin, dan galeri seleksi foto untuk klien.',
    description_id:
      'Website portofolio studio fotografi lengkap dengan sistem booking, dashboard admin, dan galeri seleksi foto untuk klien.',
    description_en:
      'Photography studio portfolio website with an integrated booking system, admin dashboard, and client photo selection gallery.',
    image: '/og-default-image.png',
    technologies: ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Supabase'],
    link: '',
    icon: 'globe',
    featured: true,
    category_id: 'Proyek Bisnis / Klien',
    category_en: 'Business / Client Project',
    caseStudy_id: {
      problem:
        'Studio fotografi sebelumnya mengelola jadwal booking dan proses seleksi foto klien secara manual melalui chat, sehingga rawan bentrok jadwal dan memakan banyak waktu.',
      role: 'Fullstack Developer — menangani perancangan alur pengguna, desain antarmuka, pengembangan front-end dan back-end, hingga deployment.',
      solution: [
        'Membangun website portofolio studio yang menampilkan katalog paket dan hasil karya secara terstruktur.',
        'Mengembangkan sistem booking online terintegrasi untuk memudahkan penjadwalan sesi foto klien.',
        'Menyediakan dashboard admin untuk mengelola pesanan, jadwal, dan daftar klien secara terpusat.',
        'Membangun galeri seleksi foto khusus klien agar pemilihan foto hasil pemotretan dapat dilakukan langsung dari browser.',
      ],
      impact:
        'Mempermudah alur pemesanan dan seleksi foto antara studio dan klien, mengurangi koordinasi manual yang berulang.',
    },
    caseStudy_en: {
      problem:
        'The photography studio previously handled client bookings and photo selection manually via chat, leading to scheduling friction and repetitive back-and-forth.',
      role: 'Fullstack Developer — handled user flow design, UI implementation, full-stack development, and production deployment.',
      solution: [
        'Built a studio portfolio website showcasing service packages and photography work clearly.',
        'Developed an online booking system to streamline session scheduling for clients.',
        'Created an admin dashboard to centrally manage bookings, schedules, and client records.',
        'Implemented a client photo selection gallery so clients can review and pick photos directly in the browser.',
      ],
      impact:
        'Streamlined the booking and photo selection workflow between the studio and its clients, reducing manual coordination.',
    },
  },
  {
    id: 2,
    title: 'Codverse — Website Digital Solution',
    description:
      'Website profil bisnis dan katalog layanan solusi digital untuk membantu UMKM dan klien mengenal layanan pengembangan web secara jelas.',
    description_id:
      'Website profil bisnis dan katalog layanan solusi digital untuk membantu UMKM dan klien mengenal layanan pengembangan web secara jelas.',
    description_en:
      'Business profile and digital solutions showcase website designed to help SMEs and clients explore web development services clearly.',
    image:
      'https://32ily8ib82.ucarecd.net/40e78aef-543f-4bc6-8b46-402cdaefe117/codverse.png',
    technologies: ['Next.js', 'Tailwind CSS'],
    link: 'https://codverse.site',
    icon: 'globe',
  },
  {
    id: 5,
    title: 'DCN UNIRA',
    description:
      'Hub informasi resmi Dicoding Community Network Universitas Madura untuk program belajar bersertifikat dan agenda komunitas kampus.',
    description_id:
      'Hub informasi resmi Dicoding Community Network Universitas Madura untuk program belajar bersertifikat dan agenda komunitas kampus.',
    description_en:
      'Official information hub for the Dicoding Community Network at Universitas Madura featuring certified learning programs and campus tech events.',
    image:
      'https://32ily8ib82.ucarecd.net/68fcd631-d4c4-4f53-becf-2b602286e771/dcnuniradev.png',
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://dcnunira.dev',
    icon: 'academic',
  },
  {
    id: 1,
    title: 'Demtimcod Docs',
    description:
      'Platform dokumentasi teknis open-source berbasis React dan Docusaurus untuk membantu developer mempelajari panduan pemrograman secara terstruktur.',
    description_id:
      'Platform dokumentasi teknis open-source berbasis React dan Docusaurus untuk membantu developer mempelajari panduan pemrograman secara terstruktur.',
    description_en:
      'Open-source technical documentation platform built with React and Docusaurus to help developers navigate programming guides effortlessly.',
    image:
      'https://32ily8ib82.ucarecd.net/80bddb32-e19f-453c-a1a9-a0c30a1f52ec/demtimcod.png',
    technologies: ['React', 'Docusaurus', 'Tailwind CSS'],
    link: 'https://demtimcod.github.io/',
    icon: 'docs',
  },
];

function normalizeKey(value: string): string {
  return value.toLowerCase().trim().replace(/\/+$/, '');
}

/**
 * Cleans placeholder records (e.g. unnamed "Mobile Apps") and enriches
 * Supabase rows with bilingual descriptions and structured case study data.
 */
export function enrichProjects(rawProjects: Project[] | null | undefined): Project[] {
  if (!rawProjects || rawProjects.length === 0) {
    return projects;
  }

  const enriched = rawProjects
    .filter((item) => {
      const normalizedTitle = normalizeKey(item.title || '');
      // Hide unnamed placeholder card until it is ready with a real name/case study
      if (normalizedTitle === 'mobile apps' && !item.link) {
        return false;
      }
      return Boolean(item.title && item.title.trim());
    })
    .map((item) => {
      const match = projects.find(
        (preset) =>
          (preset.link && item.link && normalizeKey(preset.link) === normalizeKey(item.link)) ||
          normalizeKey(preset.title) === normalizeKey(item.title) ||
          (normalizeKey(item.title).includes('margasera') &&
            normalizeKey(preset.title) === 'margasera') ||
          (normalizeKey(item.title) === 'website digital solution' &&
            normalizeKey(preset.link) === 'https://codverse.site')
      );

      const cleanedTechs = (item.technologies || [])
        .map((t) => t.trim())
        .filter((t) => t && t.toLowerCase() !== 'etc');

      if (!match) {
        return {
          ...item,
          technologies: cleanedTechs,
        };
      }

      return {
        ...match,
        ...item,
        title: match.title,
        image: item.image || match.image,
        link: item.link || match.link,
        description: match.description,
        description_id: match.description_id,
        description_en: match.description_en,
        technologies: cleanedTechs.length > 0 ? cleanedTechs : match.technologies,
        featured: match.featured,
        category_id: match.category_id,
        category_en: match.category_en,
        caseStudy_id: match.caseStudy_id,
        caseStudy_en: match.caseStudy_en,
      };
    });

  // Ensure featured Margasera case study appears even if not yet seeded in Supabase
  const hasMargasera = enriched.some((p) => normalizeKey(p.title).includes('margasera'));
  const margaseraPreset = projects.find((p) => normalizeKey(p.title) === 'margasera');
  if (!hasMargasera && margaseraPreset) {
    enriched.push(margaseraPreset);
  }

  // Sort featured case studies first so recruiters see the strongest work immediately
  return enriched.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}
