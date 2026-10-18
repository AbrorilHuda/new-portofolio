export interface CVContact {
  location: string;
  email: string;
  phone: string;
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
  contact: CVContact;
  summary: string;
  experiences: CVExperience[];
  projects: CVProject[];
  education: CVEducation[];
  skills: CVSkillCategory[];
  certifications: CVCertification[];
}

export const initialCVData: CVData = {
  name: "Moh. Abroril Huda",
  role: "Full-Stack Web Developer",
  contact: {
    location: "Pamekasan, Jawa Timur, Indonesia",
    email: "moh.abrorilhuda@gmail.com",
    phone: "+62 812-3456-7890",
    linkedin: "linkedin.com/in/moh-abroril-huda",
    linkedin_url: "https://www.linkedin.com/in/moh-abroril-huda",
    github: "github.com/AbrorilHuda",
    github_url: "https://github.com/AbrorilHuda",
    website: "abror.madura.dev",
    website_url: "https://abror.madura.dev"
  },
  summary: "Web Developer dengan pengalaman 3+ tahun membangun aplikasi web full-stack modern menggunakan TypeScript, React, Next.js, SvelteKit, Node.js, dan PostgreSQL/Supabase. Terbiasa mengelola deployment di VPS Linux dengan Docker, CI/CD, dan optimasi performa web. Memiliki kepemimpinan kuat dalam komunitas developer lokal dan terbiasa bekerja kolaboratif dari analisis kebutuhan hingga rilis produksi.",
  experiences: [
    {
      id: "exp-1",
      title: "Lead Organizer & Full-Stack Developer",
      company: "MaduraDev Community",
      location: "Pamekasan & Surabaya (Hybrid)",
      period: "Jan 2024 – Sekarang",
      highlights: [
        "Memimpin komunitas developer di Madura dengan 200+ anggota aktif, menginisiasi workshop teknis dan kolaborasi proyek open-source.",
        "Membangun dan memelihara portal madura.dev menggunakan Next.js, TypeScript, dan Tailwind CSS dengan arsitektur modular.",
        "Mengorganisir sesi tech talk berkala dan mentorship pemrograman untuk talenta teknologi lokal."
      ]
    },
    {
      id: "exp-2",
      title: "Builder & Community Organizer",
      company: "DCN (Dicoding Community Network) UNIRA",
      location: "Universitas Madura, Pamekasan",
      period: "Agu 2024 – Sekarang",
      highlights: [
        "Membangun sistem informasi dan hub aktivitas komunitas dcnunira.dev berbasis Next.js dan Tailwind CSS.",
        "Mengkoordinasikan program belajar teknologi bersertifikat dan memfasilitasi workshop coding untuk ratusan mahasiswa."
      ]
    },
    {
      id: "exp-3",
      title: "Asisten Praktikum Sistem Operasi",
      company: "Laboratorium Informatika, Universitas Madura",
      location: "Pamekasan",
      period: "Apr 2025 – Jul 2025",
      highlights: [
        "Membimbing 60+ mahasiswa dalam praktikum manajemen proses Linux, shell scripting Bash, dan arsitektur OS.",
        "Menyusun modul evaluasi teknis dan menguji pemahaman mahasiswa terkait konsep konkurensi serta manajemen memori."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Sistem POS untuk Warung",
      period: "2025",
      description: "Aplikasi kasir berbasis web dengan struk digital yang dapat dibagikan lewat tautan. Dibangun dengan Next.js dan Supabase, dipakai oleh 30+ toko.",
      link: ""
    },
    {
      id: "proj-2",
      title: "Demtimcod Docs",
      period: "2024",
      description: "Platform dokumentasi interaktif open-source berbasis React dan Docusaurus untuk mempermudah developer membaca dan mempelajari dokumentasi teknis.",
      link: "https://demtimcod.github.io/"
    },
    {
      id: "proj-3",
      title: "Website Digital Solution (Codverse)",
      period: "2024",
      description: "Modern company profile dan portal solusi digital untuk bisnis UMKM menggunakan Next.js dan Tailwind CSS.",
      link: "https://codverse.site"
    },
    {
      id: "proj-4",
      title: "Presentation Deck SaaS",
      period: "2025",
      description: "Platform slide presentasi bertenaga AI untuk mahasiswa dan pemateri berbasis Next.js, Gemini API, dan Markdown.",
      link: "https://slide.dcnunira.dev"
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "S1 Teknik Informatika",
      institution: "Universitas Madura",
      period: "2022 – Sekarang",
      info: "Fokus pada Software Engineering, Basis Data, dan Pengembangan Web"
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Bahasa Pemrograman",
      skills: "JavaScript, TypeScript, PHP, Python, SQL, HTML/CSS"
    },
    {
      id: "skill-2",
      category: "Framework & Library",
      skills: "Svelte / SvelteKit, React, Next.js, Astro, FastAPI, Tailwind CSS, Express"
    },
    {
      id: "skill-3",
      category: "Infrastruktur & DevOps",
      skills: "Docker, Linux VPS, Nginx, Git, GitHub Actions, CI/CD"
    },
    {
      id: "skill-4",
      category: "Basis Data",
      skills: "PostgreSQL, Supabase, MySQL"
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
    contact: {
      location: raw.contact?.location || initialCVData.contact.location,
      email: raw.contact?.email || initialCVData.contact.email,
      phone: raw.contact?.phone || initialCVData.contact.phone,
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
