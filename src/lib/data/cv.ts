export interface CVContact {
  location: string;
  email: string;
  linkedin: string;
  linkedin_url?: string;
  github: string;
  github_url?: string;
  website?: string;
  website_url?: string;
}

export interface CVExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  period: string;
  highlights: string[];
}

export interface CVProject {
  id: string;
  title: string;
  period: string;
  description: string;
  link?: string;
}

export interface CVEducation {
  id: string;
  degree: string;
  institution: string;
  period: string;
  info?: string;
}

export interface CVSkillCategory {
  id: string;
  category: string;
  skills: string;
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface CVData {
  name: string;
  role: string;
  pdf_url?: string;
  contact: CVContact;
  summary: string;
  experiences: CVExperience[];
  projects: CVProject[];
  education: CVEducation[];
  skills: CVSkillCategory[];
  certifications: CVCertification[];
}

/**
 * Converts a Google Drive share link into a direct download URL.
 * Non-Drive URLs are returned as-is.
 */
export function getDirectPdfDownloadUrl(url?: string): string {
  if (!url || !url.trim()) return "";
  const trimmed = url.trim();

  // Match https://drive.google.com/file/d/{FILE_ID}/...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }

  // Match https://drive.google.com/open?id={FILE_ID} or uc?id={FILE_ID}
  const idMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*[?&]?id=([a-zA-Z0-9_-]+)/);
  if (idMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
  }

  return trimmed;
}

export const initialCVData: CVData = {
  name: "Moh. Abroril Huda",
  role: "Fullstack Developer · Lulusan S1 Informatika (IPK 3.59)",
  pdf_url: "",
  contact: {
    location: "Pamekasan, Jawa Timur, Indonesia",
    email: "moh.abrorilhuda@gmail.com",
    linkedin: "linkedin.com/in/moh-abroril-huda",
    linkedin_url: "https://www.linkedin.com/in/moh-abroril-huda",
    github: "github.com/abrorilhuda",
    github_url: "https://github.com/abrorilhuda",
    website: "abror.madura.dev",
    website_url: "https://abror.madura.dev"
  },
  summary:
    "Lulusan S1 Informatika Universitas Madura (IPK 3.59 / 4.00) dengan pengalaman 3+ tahun membangun aplikasi web end-to-end menggunakan Laravel, React, Next.js, SvelteKit, Node.js, FastAPI, dan PostgreSQL. Terbiasa mengelola deployment produksi di VPS Linux dengan Docker, Nginx, GitHub Actions (CI/CD), dan Cloudflare, serta aktif memimpin komunitas developer di Madura. Terbuka untuk posisi magang maupun junior Fullstack Developer.",
  experiences: [
    {
      id: "exp-0",
      title: "Fullstack Developer (Proyek Klien & Freelance)",
      company: "Proyek Independen & Klien UMKM",
      location: "Pamekasan (Remote)",
      period: "2023 – 2026",
      highlights: [
        "Merancang dan membangun 5+ aplikasi web live dari database, API backend, antarmuka responsif, hingga deployment di VPS Linux dengan Docker dan Nginx.",
        "Mengembangkan platform studio fotografi Margasera (portofolio, booking, dashboard admin, galeri seleksi foto) dan Presentation Deck berbasis Next.js dan Gemini API.",
        "Mengotomatiskan proses rilis produksi menggunakan GitHub Actions (CI/CD) dan Cloudflare."
      ]
    },
    {
      id: "exp-1",
      title: "Lead Organizer & Fullstack Developer",
      company: "MaduraDev Community",
      location: "Pamekasan & Surabaya (Hybrid)",
      period: "Jan 2024 – 2026",
      highlights: [
        "Memimpin komunitas developer di Madura dengan 200+ anggota aktif dan mengorganisir 5+ workshop teknis serta networking meetup.",
        "Membangun dan memelihara portal madura.dev menggunakan Next.js, TypeScript, dan Tailwind CSS dengan arsitektur modular."
      ]
    },
    {
      id: "exp-2",
      title: "Builder & Community Organizer",
      company: "DCN (Dicoding Community Network) Universitas Madura",
      location: "Universitas Madura, Pamekasan",
      period: "Agu 2024 – 2026",
      highlights: [
        "Membangun hub aktivitas komunitas dcnunira.dev berbasis Next.js dan Tailwind CSS.",
        "Mengkoordinasikan program belajar bersertifikat dan memfasilitasi workshop coding bagi 100+ peserta di lingkungan kampus."
      ]
    },
    {
      id: "exp-3",
      title: "Asisten Praktikum Sistem Operasi",
      company: "Laboratorium Informatika, Universitas Madura",
      location: "Pamekasan",
      period: "Apr 2025 – Jul 2025",
      highlights: [
        "Membimbing 60+ peserta praktikum dalam penggunaan Linux CLI, manajemen proses, memori, file system, dan Bash scripting.",
        "Menyusun modul evaluasi teknis dan mendampingi troubleshooting langsung selama sesi laboratorium."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Presentation Deck",
      period: "2025",
      description:
        "Platform slide presentasi berbasis web dengan bantuan AI (Next.js, TypeScript, Gemini API, Markdown) untuk mempercepat penyusunan deck presentasi.",
      link: "https://slide.dcnunira.dev"
    },
    {
      id: "proj-2",
      title: "MaduraDev Community Portal",
      period: "2024",
      description:
        "Portal resmi komunitas developer Madura berbasis Next.js, TypeScript, dan Tailwind CSS yang menjadi pusat informasi 200+ anggota.",
      link: "https://madura.dev"
    },
    {
      id: "proj-3",
      title: "Margasera — Photography Studio Platform",
      period: "2025",
      description:
        "Website portofolio studio fotografi lengkap dengan sistem booking online, dashboard admin, dan galeri seleksi foto klien menggunakan Next.js, Tailwind CSS, dan PostgreSQL/Supabase.",
      link: ""
    },
    {
      id: "proj-4",
      title: "Demtimcod Docs",
      period: "2024",
      description:
        "Platform dokumentasi teknis open-source berbasis React dan Docusaurus untuk membantu developer mempelajari panduan pemrograman.",
      link: "https://demtimcod.github.io/"
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "S1 Informatika (Lulus)",
      institution: "Universitas Madura",
      period: "2022 – 2026",
      info: "Peminatan Business Intelligence · IPK 3.59 / 4.00"
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Frontend",
      skills: "React, Next.js, Svelte / SvelteKit, Inertia, Tailwind CSS"
    },
    {
      id: "skill-2",
      category: "Backend",
      skills: "Node.js, Laravel (PHP), FastAPI (Python)"
    },
    {
      id: "skill-3",
      category: "Database",
      skills: "PostgreSQL"
    },
    {
      id: "skill-4",
      category: "DevOps",
      skills: "Docker, Nginx, VPS, GitHub Actions (CI/CD), Cloudflare"
    },
    {
      id: "skill-5",
      category: "Bahasa",
      skills: "Indonesia (Native), Inggris (Menengah)"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Belajar Fundamental Aplikasi Web dengan React",
      issuer: "Dicoding Indonesia",
      year: "2024"
    },
    {
      id: "cert-2",
      name: "Belajar Dasar Pemrograman JavaScript",
      issuer: "Dicoding Indonesia",
      year: "2024"
    },
    {
      id: "cert-3",
      name: "Menjadi Front-End Web Developer Expert",
      issuer: "Dicoding Indonesia",
      year: "2023"
    }
  ]
};

export function sanitizeCVData(raw: any): CVData {
  if (!raw || typeof raw !== "object") {
    return initialCVData;
  }

  return {
    name: typeof raw.name === "string" && raw.name.trim() ? raw.name : initialCVData.name,
    role: typeof raw.role === "string" && raw.role.trim() ? raw.role : initialCVData.role,
    pdf_url: typeof raw.pdf_url === "string" ? raw.pdf_url.trim() : initialCVData.pdf_url || "",
    contact: {
      location: raw.contact?.location || initialCVData.contact.location,
      email: raw.contact?.email || initialCVData.contact.email,
      linkedin: raw.contact?.linkedin || initialCVData.contact.linkedin,
      linkedin_url: raw.contact?.linkedin_url || initialCVData.contact.linkedin_url,
      github: raw.contact?.github || initialCVData.contact.github,
      github_url: raw.contact?.github_url || initialCVData.contact.github_url,
      website: raw.contact?.website || initialCVData.contact.website,
      website_url: raw.contact?.website_url || initialCVData.contact.website_url
    },
    summary: typeof raw.summary === "string" ? raw.summary : initialCVData.summary,
    experiences: Array.isArray(raw.experiences)
      ? raw.experiences.map((exp: any, idx: number) => ({
          id: exp.id || `exp-${idx}`,
          title: exp.title || "",
          company: exp.company || "",
          location: exp.location || "",
          period: exp.period || "",
          highlights: Array.isArray(exp.highlights)
            ? exp.highlights.filter((h: any) => typeof h === "string" && h.trim())
            : []
        }))
      : initialCVData.experiences,
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((proj: any, idx: number) => ({
          id: proj.id || `proj-${idx}`,
          title: proj.title || "",
          period: proj.period || "",
          description: proj.description || "",
          link: proj.link || ""
        }))
      : initialCVData.projects,
    education: Array.isArray(raw.education)
      ? raw.education.map((edu: any, idx: number) => ({
          id: edu.id || `edu-${idx}`,
          degree: edu.degree || "",
          institution: edu.institution || "",
          period: edu.period || "",
          info: edu.info || ""
        }))
      : initialCVData.education,
    skills: Array.isArray(raw.skills)
      ? raw.skills.map((skill: any, idx: number) => ({
          id: skill.id || `skill-${idx}`,
          category: skill.category || "",
          skills: skill.skills || ""
        }))
      : initialCVData.skills,
    certifications: Array.isArray(raw.certifications)
      ? raw.certifications.map((cert: any, idx: number) => ({
          id: cert.id || `cert-${idx}`,
          name: cert.name || "",
          issuer: cert.issuer || "",
          year: cert.year || ""
        }))
      : initialCVData.certifications
  };
}
