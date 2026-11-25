<script lang="ts">
  import { getDirectPdfDownloadUrl } from "$lib/data/cv";
  import { locale } from "$lib/stores/locale";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: cv = data.cv;
  $: isAdmin = data.isAdmin;
  $: updatedAt = data.updatedAt;
  $: rawPdfUrl = (cv.pdf_url || "").trim();
  $: pdfDownloadUrl = getDirectPdfDownloadUrl(rawPdfUrl);

  $: formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString($locale === "en" ? "en-US" : "id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
</script>

<svelte:head>
  <title>CV — Moh. Abroril Huda</title>
  <meta
    name="description"
    content="Unduh Curriculum Vitae (CV) terbaru Moh. Abroril Huda — Fullstack Developer lulusan S1 Informatika (IPK 3.59)."
  />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex items-center justify-center px-4 py-16">
  <div class="w-full max-w-xl">
    <!-- Top bar -->
    <div class="flex items-center justify-between mb-6">
      <a
        href="/"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>{$locale === "en" ? "Back to Portfolio" : "Kembali ke Beranda"}</span>
      </a>

      {#if isAdmin}
        <a
          href="/admin/cv"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          <span>Kelola PDF CV</span>
        </a>
      {/if}
    </div>

    <!-- Main Card -->
    <main class="rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-white/10 shadow-xl p-8 sm:p-10 space-y-8 text-center">
      <!-- Icon -->
      <div class="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600/15 to-purple-600/15 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>

      <!-- Identity -->
      <div class="space-y-2">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold {pdfDownloadUrl ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'}">
          <span class="w-2 h-2 rounded-full {pdfDownloadUrl ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}"></span>
          {#if pdfDownloadUrl}
            {$locale === "en" ? "Latest PDF Ready" : "CV Versi Terbaru Tersedia"}
          {:else}
            {$locale === "en" ? "Update in Progress" : "Sedang Ada Pembaruan Terbaru"}
          {/if}
        </span>

        <h1 class="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Moh. Abroril Huda
        </h1>
        <p class="text-sm font-medium text-blue-600 dark:text-blue-400">
          {$locale === "en"
            ? "Fullstack Developer · Informatics Graduate (GPA 3.59)"
            : "Fullstack Developer · Lulusan S1 Informatika (IPK 3.59)"}
        </p>
      </div>

      <!-- Status Message & Actions -->
      {#if pdfDownloadUrl}
        <div class="space-y-5">
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
            {$locale === "en"
              ? "Please download my latest ATS-friendly CV in PDF format using the button below."
              : "CV sedang diperbarui secara berkala. Silakan unduh versi terbaru dalam format PDF melalui tombol di bawah."}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={pdfDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-95 hover:scale-[1.02] active:scale-98 transition-all shadow-lg shadow-blue-500/20"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>{$locale === "en" ? "Download CV (PDF)" : "Unduh CV (PDF)"}</span>
            </a>

            <a
              href={rawPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span>{$locale === "en" ? "Open Preview" : "Buka Pratinjau"}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          {#if formattedDate}
            <p class="text-xs text-gray-400 dark:text-gray-500">
              {$locale === "en" ? `Last updated: ${formattedDate}` : `Terakhir diperbarui: ${formattedDate}`}
            </p>
          {/if}
        </div>
      {:else}
        <div class="space-y-5">
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
            {$locale === "en"
              ? "My CV is currently being updated with the latest version. Please check back shortly or contact me directly."
              : "CV sedang dalam pembaruan terbaru. Silakan kembali sebentar lagi untuk mengunduh versi PDF terbaru, atau hubungi saya langsung."}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:moh.abrorilhuda@gmail.com"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-95 transition-opacity"
            >
              <span>{$locale === "en" ? "Email Me" : "Kirim Email"}</span>
            </a>
            <a
              href="/#contact"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span>{$locale === "en" ? "Contact Form" : "Formulir Kontak"}</span>
            </a>
          </div>
        </div>
      {/if}

      <!-- Footer Links -->
      <div class="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-500 dark:text-gray-400">
        <a href="mailto:moh.abrorilhuda@gmail.com" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          moh.abrorilhuda@gmail.com
        </a>
        <span>•</span>
        <a href="https://www.linkedin.com/in/moh-abroril-huda" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          LinkedIn
        </a>
        <span>•</span>
        <a href="https://github.com/abrorilhuda" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          GitHub
        </a>
      </div>
    </main>
  </div>
</div>
