<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import type { CVData, CVExperience, CVProject, CVEducation, CVSkillCategory, CVCertification } from "$lib/data/cv";

  export let data: PageData;
  export let form: ActionData;

  // Clone local state from data
  let cv: CVData = JSON.parse(JSON.stringify(data.cv));
  let hasDbRecord = data.hasDbRecord;

  let activeTab: "profile" | "summary" | "experience" | "projects" | "education" | "skills" | "certifications" | "preview" = "profile";
  let saving = false;
  let resetting = false;
  let showSqlModal = false;

  // JSON payload string for form submit
  $: payloadString = JSON.stringify(cv);

  function addExperience() {
    cv.experiences = [
      ...cv.experiences,
      {
        id: "exp-" + Date.now(),
        title: "Software Engineer",
        company: "Nama Perusahaan",
        location: "Surabaya (Remote)",
        period: "2024 – Sekarang",
        highlights: ["Mengembangkan fitur aplikasi web...", "Mengoptimalkan performa sistem..."]
      }
    ];
    activeTab = "experience";
  }

  function removeExperience(index: number) {
    cv.experiences = cv.experiences.filter((_, i) => i !== index);
  }

  function addHighlight(expIndex: number) {
    cv.experiences[expIndex].highlights = [
      ...cv.experiences[expIndex].highlights,
      "Poin pencapaian baru..."
    ];
  }

  function removeHighlight(expIndex: number, hIndex: number) {
    cv.experiences[expIndex].highlights = cv.experiences[expIndex].highlights.filter((_, i) => i !== hIndex);
  }

  function addProject() {
    cv.projects = [
      ...cv.projects,
      {
        id: "proj-" + Date.now(),
        title: "Nama Proyek",
        period: new Date().getFullYear().toString(),
        description: "Deskripsi singkat proyek, solusi yang dibangun, dan teknologi yang digunakan.",
        link: ""
      }
    ];
    activeTab = "projects";
  }

  function removeProject(index: number) {
    cv.projects = cv.projects.filter((_, i) => i !== index);
  }

  function addEducation() {
    cv.education = [
      ...cv.education,
      {
        id: "edu-" + Date.now(),
        degree: "S1 Teknik Informatika",
        institution: "Universitas Madura",
        period: "2022 – Sekarang",
        info: "IPK 3.8 / 4.0"
      }
    ];
    activeTab = "education";
  }

  function removeEducation(index: number) {
    cv.education = cv.education.filter((_, i) => i !== index);
  }

  function addSkill() {
    cv.skills = [
      ...cv.skills,
      {
        id: "skill-" + Date.now(),
        category: "Kategori Baru",
        skills: "Skill 1, Skill 2, Skill 3"
      }
    ];
    activeTab = "skills";
  }

  function removeSkill(index: number) {
    cv.skills = cv.skills.filter((_, i) => i !== index);
  }

  function addCertification() {
    cv.certifications = [
      ...cv.certifications,
      {
        id: "cert-" + Date.now(),
        name: "Nama Sertifikasi",
        issuer: "Penerbit / Platform",
        year: new Date().getFullYear().toString()
      }
    ];
    activeTab = "certifications";
  }

  function removeCertification(index: number) {
    cv.certifications = cv.certifications.filter((_, i) => i !== index);
  }
</script>

<svelte:head>
  <title>Kelola CV (Curriculum Vitae) – Admin</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6 pb-20">
  <!-- Header Bar -->
  <div class="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>ATS-FRIENDLY RESUME</span>
          {#if hasDbRecord}
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Tersimpan di Supabase</span>
          {:else}
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Data Template (Default)</span>
          {/if}
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Kelola Curriculum Vitae (CV)
        </h1>
        <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Format standar ATS (Applicant Tracking System) untuk halaman publik <code class="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 text-xs font-mono">/cv</code>.
        </p>
      </div>

      <div class="flex items-center flex-wrap gap-2.5">
        <a
          href="/cv"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span>Lihat /cv</span>
        </a>

        <button
          type="button"
          on:click={() => (showSqlModal = true)}
          class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Petunjuk Setup Tabel Supabase"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <span>Info SQL</span>
        </button>

        <form
          method="POST"
          action="?/reset"
          use:enhance={() => {
            if (!confirm("Apakah kamu yakin ingin mereset seluruh data CV ke nilai template awal?")) {
              return () => {};
            }
            resetting = true;
            return async ({ update }) => {
              await update();
              resetting = false;
            };
          }}
        >
          <button
            type="submit"
            disabled={resetting || saving}
            class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {resetting ? "Mereset..." : "Reset Default"}
          </button>
        </form>

        <form
          method="POST"
          action="?/save"
          use:enhance={() => {
            saving = true;
            return async ({ update }) => {
              await update();
              saving = false;
            };
          }}
        >
          <input type="hidden" name="payload" value={payloadString} />
          <button
            type="submit"
            disabled={saving || resetting}
            class="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {#if saving}
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Menyimpan...</span>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Simpan Perubahan</span>
            {/if}
          </button>
        </form>
      </div>
    </div>

    <!-- Alert Success or Error -->
    {#if form?.success}
      <div class="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{form.message || "Data CV berhasil disimpan!"}</span>
      </div>
    {:else if form?.error}
      <div class="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span>{form.error}</span>
      </div>
    {/if}
  </div>

  <!-- Navigation Tabs -->
  <div class="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <button
      type="button"
      on:click={() => (activeTab = "profile")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
    >
      👤 Identitas & Kontak
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "summary")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'summary' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
    >
      📝 Ringkasan
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "experience")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'experience' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
    >
      💼 Pengalaman ({cv.experiences.length})
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "projects")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'projects' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
    >
      🚀 Proyek ({cv.projects.length})
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "education")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'education' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
    >
      🎓 Pendidikan ({cv.education.length})
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "skills")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'skills' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
    >
      ⚡ Keahlian ({cv.skills.length})
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "certifications")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'certifications' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
    >
      🏆 Sertifikasi ({cv.certifications.length})
    </button>
    <button
      type="button"
      on:click={() => (activeTab = "preview")}
      class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer {activeTab === 'preview' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20'}"
    >
      👁️ Pratinjau Langsung
    </button>
  </div>

  <!-- TAB CONTENT -->
  <div class="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-7 shadow-xs">
    
    <!-- 1. IDENTITAS & KONTAK -->
    {#if activeTab === "profile"}
      <div class="space-y-6">
        <div>
          <h2 class="text-base font-bold text-zinc-900 dark:text-white">Identitas Pokok & Informasi Kontak</h2>
          <p class="text-xs text-zinc-500">Tampil di bagian paling atas CV (Header).</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label for="cv-name" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nama Lengkap</label>
            <input
              id="cv-name"
              type="text"
              bind:value={cv.name}
              placeholder="Contoh: Moh. Abroril Huda"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="cv-role" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Role / Profesi Utama</label>
            <input
              id="cv-role"
              type="text"
              bind:value={cv.role}
              placeholder="Contoh: Full-Stack Web Developer"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="cv-loc" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Lokasi / Domisili</label>
            <input
              id="cv-loc"
              type="text"
              bind:value={cv.contact.location}
              placeholder="Contoh: Pamekasan, Jawa Timur, Indonesia"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="cv-email" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email</label>
            <input
              id="cv-email"
              type="email"
              bind:value={cv.contact.email}
              placeholder="nama@email.com"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="cv-phone" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nomor Telepon / WhatsApp</label>
            <input
              id="cv-phone"
              type="text"
              bind:value={cv.contact.phone}
              placeholder="+62 812-3456-7890"
              class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="cv-linkedin" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">LinkedIn (Teks & URL)</label>
            <div class="flex gap-2">
              <input
                id="cv-linkedin"
                type="text"
                bind:value={cv.contact.linkedin}
                placeholder="linkedin.com/in/username"
                class="w-1/2 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs"
              />
              <input
                type="url"
                bind:value={cv.contact.linkedin_url}
                placeholder="https://linkedin.com/in/username"
                class="w-1/2 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="cv-github" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">GitHub (Teks & URL)</label>
            <div class="flex gap-2">
              <input
                id="cv-github"
                type="text"
                bind:value={cv.contact.github}
                placeholder="github.com/username"
                class="w-1/2 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs"
              />
              <input
                type="url"
                bind:value={cv.contact.github_url}
                placeholder="https://github.com/username"
                class="w-1/2 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="cv-web" class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Website / Portfolio (Teks & URL)</label>
            <div class="flex gap-2">
              <input
                id="cv-web"
                type="text"
                bind:value={cv.contact.website}
                placeholder="abror.madura.dev"
                class="w-1/2 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs"
              />
              <input
                type="url"
                bind:value={cv.contact.website_url}
                placeholder="https://abror.madura.dev"
                class="w-1/2 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- 2. RINGKASAN PROFESIONAL -->
    {#if activeTab === "summary"}
      <div class="space-y-4">
        <div>
          <h2 class="text-base font-bold text-zinc-900 dark:text-white">Ringkasan Profesional (Professional Summary)</h2>
          <p class="text-xs text-zinc-500">Paragraf ringkas yang menonjolkan fokus karir, pengalaman kunci, teknologi utama, dan nilai tambah yang kamu bawa.</p>
        </div>

        <div class="space-y-1.5">
          <textarea
            bind:value={cv.summary}
            rows="6"
            placeholder="Tulis ringkasan profesional kamu di sini..."
            class="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          ></textarea>
          <div class="flex justify-between items-center text-[11px] text-zinc-400">
            <span>Disarankan 2 - 4 kalimat padat & informatif.</span>
            <span>{cv.summary.length} karakter</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- 3. PENGALAMAN KERJA -->
    {#if activeTab === "experience"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-white">Pengalaman Kerja & Organisasi</h2>
            <p class="text-xs text-zinc-500">Urutkan dari yang terbaru ke terlama.</p>
          </div>
          <button
            type="button"
            on:click={addExperience}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Tambah Pengalaman</span>
          </button>
        </div>

        {#if cv.experiences.length === 0}
          <div class="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
            Belum ada pengalaman kerja yang ditambahkan.
          </div>
        {/if}

        <div class="space-y-5">
          {#each cv.experiences as exp, expIdx (exp.id || expIdx)}
            <div class="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-4 relative group">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400">#{expIdx + 1} Pengalaman</span>
                <button
                  type="button"
                  on:click={() => removeExperience(expIdx)}
                  class="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Hapus Posisi
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div class="sm:col-span-2">
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Posisi / Jabatan</span>
                    <input
                      type="text"
                      bind:value={exp.title}
                      placeholder="Full-Stack Developer"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div>
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Perusahaan / Komunitas</span>
                    <input
                      type="text"
                      bind:value={exp.company}
                      placeholder="PT Nama Perusahaan"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div>
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Periode</span>
                    <input
                      type="text"
                      bind:value={exp.period}
                      placeholder="Jan 2024 – Sekarang"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div class="sm:col-span-2">
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Lokasi / Tipe Kerja</span>
                    <input
                      type="text"
                      bind:value={exp.location}
                      placeholder="Surabaya (Kerja Jarak Jauh)"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
              </div>

              <!-- Highlights / Bullet points -->
              <div class="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Poin Pencapaian / Bullet Points</span>
                  <button
                    type="button"
                    on:click={() => addHighlight(expIdx)}
                    class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    + Tambah Poin
                  </button>
                </div>
                <div class="space-y-2">
                  {#each exp.highlights as item, hIdx}
                    <div class="flex items-center gap-2">
                      <span class="text-zinc-400 text-xs">•</span>
                      <input
                        type="text"
                        bind:value={exp.highlights[hIdx]}
                        placeholder="Uraikan aksi, konteks, dan hasil terukur (misal: memangkas waktu load hingga 40%)..."
                        class="flex-1 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      />
                      <button
                        type="button"
                        on:click={() => removeHighlight(expIdx, hIdx)}
                        class="text-zinc-400 hover:text-rose-500 p-1 text-xs cursor-pointer"
                        title="Hapus poin"
                      >
                        ✕
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 4. PROYEK -->
    {#if activeTab === "projects"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-white">Proyek Pilihan (Projects)</h2>
            <p class="text-xs text-zinc-500">Proyek penting yang mendemonstrasikan keahlian teknis kamu.</p>
          </div>
          <button
            type="button"
            on:click={addProject}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Tambah Proyek</span>
          </button>
        </div>

        {#if cv.projects.length === 0}
          <div class="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
            Belum ada proyek yang ditambahkan.
          </div>
        {/if}

        <div class="space-y-4">
          {#each cv.projects as proj, pIdx (proj.id || pIdx)}
            <div class="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400">Proyek #{pIdx + 1}</span>
                <button
                  type="button"
                  on:click={() => removeProject(pIdx)}
                  class="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Hapus Proyek
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Nama Proyek</span>
                    <input
                      type="text"
                      bind:value={proj.title}
                      placeholder="Sistem POS untuk Warung"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div>
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Tahun / Periode</span>
                    <input
                      type="text"
                      bind:value={proj.period}
                      placeholder="2025"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div class="sm:col-span-3">
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Tautan Proyek (Opsional)</span>
                    <input
                      type="url"
                      bind:value={proj.link}
                      placeholder="https://demtimcod.github.io/"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div class="sm:col-span-3">
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Deskripsi & Teknologi</span>
                    <textarea
                      bind:value={proj.description}
                      rows="2"
                      placeholder="Aplikasi kasir berbasis web dengan struk digital... Dibangun dengan Next.js dan Supabase..."
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs resize-none"
                    ></textarea>
                  </label>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 5. PENDIDIKAN -->
    {#if activeTab === "education"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-white">Riwayat Pendidikan (Education)</h2>
            <p class="text-xs text-zinc-500">Gelar, nama kampus / institusi, dan keterangan IPK atau pencapaian.</p>
          </div>
          <button
            type="button"
            on:click={addEducation}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Tambah Pendidikan</span>
          </button>
        </div>

        {#if cv.education.length === 0}
          <div class="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
            Belum ada data pendidikan.
          </div>
        {/if}

        <div class="space-y-4">
          {#each cv.education as edu, eduIdx (edu.id || eduIdx)}
            <div class="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400">Pendidikan #{eduIdx + 1}</span>
                <button
                  type="button"
                  on:click={() => removeEducation(eduIdx)}
                  class="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Jenjang & Jurusan</span>
                    <input
                      type="text"
                      bind:value={edu.degree}
                      placeholder="S1 Teknik Informatika"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div>
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Nama Kampus / Sekolah</span>
                    <input
                      type="text"
                      bind:value={edu.institution}
                      placeholder="Universitas Madura"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div>
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Tahun / Periode</span>
                    <input
                      type="text"
                      bind:value={edu.period}
                      placeholder="2022 – Sekarang"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
                <div class="sm:col-span-3">
                  <label class="block space-y-1">
                    <span class="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Catatan / IPK (Opsional)</span>
                    <input
                      type="text"
                      bind:value={edu.info}
                      placeholder="IPK 3.75/4.00, Fokus pada Software Engineering"
                      class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                    />
                  </label>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 6. KEAHLIAN (SKILLS) -->
    {#if activeTab === "skills"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-white">Keahlian Teknis & Bahasa</h2>
            <p class="text-xs text-zinc-500">Dikelompokkan per kategori untuk kemudahan screening ATS.</p>
          </div>
          <button
            type="button"
            on:click={addSkill}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Tambah Kategori</span>
          </button>
        </div>

        {#if cv.skills.length === 0}
          <div class="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
            Belum ada kategori keahlian.
          </div>
        {/if}

        <div class="space-y-3">
          {#each cv.skills as skill, sIdx (skill.id || sIdx)}
            <div class="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="w-full sm:w-1/3">
                <input
                  type="text"
                  bind:value={skill.category}
                  placeholder="Kategori (mis: Framework)"
                  class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
                />
              </div>
              <div class="flex-1">
                <input
                  type="text"
                  bind:value={skill.skills}
                  placeholder="Daftar keahlian (pisahkan dengan koma)"
                  class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                />
              </div>
              <button
                type="button"
                on:click={() => removeSkill(sIdx)}
                class="text-rose-500 hover:text-rose-700 p-2 text-xs cursor-pointer self-end sm:self-center"
                title="Hapus Kategori"
              >
                ✕
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 7. SERTIFIKASI -->
    {#if activeTab === "certifications"}
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-white">Sertifikasi & Lisensi Profesional</h2>
            <p class="text-xs text-zinc-500">Sertifikat kursus, ujian profesional, atau bootcamp.</p>
          </div>
          <button
            type="button"
            on:click={addCertification}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Tambah Sertifikasi</span>
          </button>
        </div>

        {#if cv.certifications.length === 0}
          <div class="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
            Belum ada sertifikasi.
          </div>
        {/if}

        <div class="space-y-3">
          {#each cv.certifications as cert, cIdx (cert.id || cIdx)}
            <div class="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div class="sm:col-span-6">
                <input
                  type="text"
                  bind:value={cert.name}
                  placeholder="Nama Sertifikasi"
                  class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
                />
              </div>
              <div class="sm:col-span-4">
                <input
                  type="text"
                  bind:value={cert.issuer}
                  placeholder="Penerbit / Penyelenggara"
                  class="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                />
              </div>
              <div class="sm:col-span-1">
                <input
                  type="text"
                  bind:value={cert.year}
                  placeholder="2024"
                  class="w-full px-2 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-center"
                />
              </div>
              <div class="sm:col-span-1 text-right">
                <button
                  type="button"
                  on:click={() => removeCertification(cIdx)}
                  class="text-rose-500 hover:text-rose-700 p-1 text-xs cursor-pointer"
                  title="Hapus Sertifikasi"
                >
                  ✕
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 8. LIVE PREVIEW -->
    {#if activeTab === "preview"}
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-white">Pratinjau Langsung (ATS Friendly Document)</h2>
            <p class="text-xs text-zinc-500">Tampilan akurat seperti yang akan dilihat visitor dan dibaca parser ATS.</p>
          </div>
          <a
            href="/cv"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Buka Fullscreen di /cv ↗
          </a>
        </div>

        <!-- Render paper inside container with ATS styles -->
        <div class="p-4 sm:p-6 bg-zinc-200 dark:bg-zinc-950 rounded-2xl overflow-x-auto">
          <div class="preview-paper bg-white dark:bg-[#1c2228] text-[#1b1f24] dark:text-[#e8ecef] p-6 sm:p-10 rounded shadow-md max-w-[760px] mx-auto text-sm leading-relaxed">
            <header>
              <h1 class="text-2xl font-serif font-bold text-[#1b1f24] dark:text-[#e8ecef]">{cv.name}</h1>
              <p class="text-[#1f4e5f] dark:text-[#7cc1d6] font-semibold text-sm mt-0.5">{cv.role}</p>
              <ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4f5a66] dark:text-[#a3afba] mt-2 list-none p-0">
                {#if cv.contact.location}<li>{cv.contact.location}</li>{/if}
                {#if cv.contact.email}<li>{cv.contact.email}</li>{/if}
                {#if cv.contact.phone}<li>{cv.contact.phone}</li>{/if}
                {#if cv.contact.linkedin}<li>{cv.contact.linkedin}</li>{/if}
                {#if cv.contact.github}<li>{cv.contact.github}</li>{/if}
              </ul>
            </header>

            {#if cv.summary}
              <section class="mt-5">
                <h2 class="text-sm font-serif font-bold text-[#1f4e5f] dark:text-[#7cc1d6] border-b border-[#cfd6dc] dark:border-[#34404a] pb-1 mb-2">
                  Ringkasan Profesional
                </h2>
                <p class="text-xs leading-relaxed text-[#1b1f24] dark:text-[#e8ecef]">{cv.summary}</p>
              </section>
            {/if}

            {#if cv.experiences.length > 0}
              <section class="mt-5">
                <h2 class="text-sm font-serif font-bold text-[#1f4e5f] dark:text-[#7cc1d6] border-b border-[#cfd6dc] dark:border-[#34404a] pb-1 mb-2">
                  Pengalaman Kerja
                </h2>
                <div class="space-y-3">
                  {#each cv.experiences as exp}
                    <div>
                      <div class="flex justify-between items-baseline gap-2">
                        <h3 class="font-serif font-semibold text-xs text-[#1b1f24] dark:text-[#e8ecef]">{exp.title}</h3>
                        <span class="text-[11px] text-[#4f5a66] dark:text-[#a3afba] whitespace-nowrap">{exp.period}</span>
                      </div>
                      <p class="text-[11px] text-[#4f5a66] dark:text-[#a3afba] mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                      {#if exp.highlights && exp.highlights.length > 0}
                        <ul class="list-disc pl-4 text-xs space-y-0.5">
                          {#each exp.highlights as h}
                            <li>{h}</li>
                          {/each}
                        </ul>
                      {/if}
                    </div>
                  {/each}
                </div>
              </section>
            {/if}

            {#if cv.projects.length > 0}
              <section class="mt-5">
                <h2 class="text-sm font-serif font-bold text-[#1f4e5f] dark:text-[#7cc1d6] border-b border-[#cfd6dc] dark:border-[#34404a] pb-1 mb-2">
                  Proyek
                </h2>
                <div class="space-y-2.5">
                  {#each cv.projects as proj}
                    <div>
                      <div class="flex justify-between items-baseline gap-2">
                        <h3 class="font-serif font-semibold text-xs text-[#1b1f24] dark:text-[#e8ecef]">{proj.title}</h3>
                        <span class="text-[11px] text-[#4f5a66] dark:text-[#a3afba] whitespace-nowrap">{proj.period}</span>
                      </div>
                      <p class="text-xs text-[#1b1f24] dark:text-[#e8ecef]">{proj.description}</p>
                    </div>
                  {/each}
                </div>
              </section>
            {/if}

            {#if cv.education.length > 0}
              <section class="mt-5">
                <h2 class="text-sm font-serif font-bold text-[#1f4e5f] dark:text-[#7cc1d6] border-b border-[#cfd6dc] dark:border-[#34404a] pb-1 mb-2">
                  Pendidikan
                </h2>
                <div class="space-y-2">
                  {#each cv.education as edu}
                    <div>
                      <div class="flex justify-between items-baseline gap-2">
                        <h3 class="font-serif font-semibold text-xs text-[#1b1f24] dark:text-[#e8ecef]">{edu.degree}</h3>
                        <span class="text-[11px] text-[#4f5a66] dark:text-[#a3afba] whitespace-nowrap">{edu.period}</span>
                      </div>
                      <p class="text-[11px] text-[#4f5a66] dark:text-[#a3afba]">{edu.institution}{edu.info ? `, ${edu.info}` : ""}</p>
                    </div>
                  {/each}
                </div>
              </section>
            {/if}

            {#if cv.skills.length > 0}
              <section class="mt-5">
                <h2 class="text-sm font-serif font-bold text-[#1f4e5f] dark:text-[#7cc1d6] border-b border-[#cfd6dc] dark:border-[#34404a] pb-1 mb-2">
                  Keahlian
                </h2>
                <dl class="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-xs">
                  {#each cv.skills as s}
                    <dt class="font-semibold">{s.category}</dt>
                    <dd class="m-0 text-[#4f5a66] dark:text-[#a3afba]">{s.skills}</dd>
                  {/each}
                </dl>
              </section>
            {/if}

            {#if cv.certifications.length > 0}
              <section class="mt-5">
                <h2 class="text-sm font-serif font-bold text-[#1f4e5f] dark:text-[#7cc1d6] border-b border-[#cfd6dc] dark:border-[#34404a] pb-1 mb-2">
                  Sertifikasi
                </h2>
                <ul class="list-disc pl-4 text-xs space-y-0.5">
                  {#each cv.certifications as c}
                    <li><strong>{c.name}</strong> – {c.issuer}, {c.year}</li>
                  {/each}
                </ul>
              </section>
            {/if}
          </div>
        </div>
      </div>
    {/if}

  </div>
</div>

<!-- Modal Panduan SQL Supabase -->
{#if showSqlModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Setup Tabel Supabase (cv_profile)</span>
        </h3>
        <button
          type="button"
          on:click={() => (showSqlModal = false)}
          class="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
      
      <p class="text-xs text-zinc-500 leading-relaxed">
        Buka <strong class="text-zinc-700 dark:text-zinc-300">Supabase Dashboard → SQL Editor</strong>, lalu jalankan query di bawah ini agar perubahan CV dari halaman Admin dapat tersimpan permanen di basis data Supabase:
      </p>

      <pre class="p-3.5 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-zinc-800"><code>create table if not exists cv_profile (
    id text primary key default 'default',
    data jsonb not null,
    updated_at timestamptz not null default now()
);

alter table cv_profile enable row level security;

create policy "public can read cv_profile"
    on cv_profile for select to anon, authenticated using (true);

create policy "authenticated can insert cv_profile"
    on cv_profile for insert to authenticated with check (true);

create policy "authenticated can update cv_profile"
    on cv_profile for update to authenticated using (true) with check (true);

create policy "authenticated can delete cv_profile"
    on cv_profile for delete to authenticated using (true);</code></pre>

      <div class="flex justify-end pt-2">
        <button
          type="button"
          on:click={() => (showSqlModal = false)}
          class="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
