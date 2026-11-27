<script lang="ts">
  import { tick } from "svelte";
  import { getDirectPdfDownloadUrl } from "$lib/data/cv";
  import { locale } from "$lib/stores/locale";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: cv = data.cv;
  $: isAdmin = data.isAdmin;
  $: updatedAt = data.updatedAt;
  $: rawPdfUrl = (cv.pdf_url || "").trim();
  $: pdfDownloadUrl = getDirectPdfDownloadUrl(rawPdfUrl);

  let downloadBtnEl: (HTMLElement & { done?: () => void }) | null = null;
  let progressEl:
    | (HTMLElement & { set?: (n: number) => void; reset?: () => void })
    | null = null;

  let downloadState: "idle" | "downloading" | "done" | "error" = "idle";
  let downloadProgress = 0; // 0 - 100
  let hasTotalSize = false;
  let downloadedKB = 0;
  let totalKB = 0;
  let downloadError = "";

  $: formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString($locale === "en" ? "en-US" : "id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  $: progressLabel =
    downloadState === "done"
      ? "CV-Moh-Abroril-Huda.pdf"
      : downloadState === "downloading"
        ? hasTotalSize
          ? `${downloadedKB} KB / ${totalKB} KB`
          : downloadedKB > 0
            ? `${downloadedKB} KB`
            : $locale === "en"
              ? "Preparing PDF..."
              : "Menyiapkan PDF..."
        : $locale === "en"
          ? "Ready to download"
          : "Siap diunduh";

  function openPreview() {
    if (!rawPdfUrl) return;
    window.open(rawPdfUrl, "_blank", "noopener,noreferrer");
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleDownload() {
    if (downloadState === "downloading" || !pdfDownloadUrl) return;

    downloadState = "downloading";
    downloadProgress = 0;
    hasTotalSize = false;
    downloadedKB = 0;
    totalKB = 0;
    downloadError = "";

    await tick();
    progressEl?.reset?.();
    progressEl?.set?.(0.08);

    const startTime = performance.now();

    try {
      const response = await fetch("/api/cv/download");
      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || `HTTP ${response.status}`);
      }

      const contentLengthHeader = response.headers.get("content-length");
      const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
      hasTotalSize = Number.isFinite(totalBytes) && totalBytes > 0;
      totalKB = hasTotalSize ? Math.max(1, Math.round(totalBytes / 1024)) : 0;

      const reader = response.body?.getReader();
      let blob: Blob;

      if (!reader) {
        blob = await response.blob();
        downloadProgress = 90;
        progressEl?.set?.(0.9);
      } else {
        const chunks: BlobPart[] = [];
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            receivedBytes += value.length;
            downloadedKB = Math.max(1, Math.round(receivedBytes / 1024));
            const fraction = hasTotalSize
              ? Math.min(0.95, receivedBytes / totalBytes)
              : Math.min(0.9, (1 - Math.exp(-receivedBytes / 250000)) * 0.95);
            downloadProgress = Math.round(fraction * 100);
            progressEl?.set?.(Math.max(0.12, fraction));
          }
        }

        blob = new Blob(chunks, { type: "application/pdf" });
      }

      // Ensure Sakuga progress VFX is clearly visible even on fast 70KB downloads
      const elapsed = performance.now() - startTime;
      if (elapsed < 550) {
        progressEl?.set?.(0.65);
        await sleep(220);
        progressEl?.set?.(0.88);
        await sleep(Math.max(120, 550 - elapsed - 220));
      }

      downloadProgress = 100;
      progressEl?.set?.(1);
      triggerBlobDownload(blob);
      downloadState = "done";

      setTimeout(() => {
        if (downloadState === "done") {
          downloadState = "idle";
          downloadProgress = 0;
        }
      }, 3000);
    } catch (err) {
      console.error("CV download error:", err);
      downloadState = "error";
      progressEl?.reset?.();
      downloadError =
        $locale === "en"
          ? "Failed to download directly. You can open the preview link instead."
          : "Gagal mengunduh langsung. Silakan coba lagi atau buka pratinjau.";
    }
  }

  function triggerBlobDownload(blob: Blob) {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "CV-Moh-Abroril-Huda.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
</script>

<svelte:head>
  <title>CV — Moh. Abroril Huda</title>
  <meta
    name="description"
    content="Unduh Curriculum Vitae (CV) terbaru Moh. Abroril Huda — Fullstack Developer lulusan S1 Informatika (IPK 3.59)."
  />
  <script src="/sakuga-vfx/button.js"></script>
  <script src="/sakuga-vfx/progress.js"></script>
</svelte:head>

<div class="sakuga-cv-theme min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex items-center justify-center px-4 py-16">
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

      <!-- Status Message & Sakuga VFX Actions -->
      {#if pdfDownloadUrl}
        <div class="space-y-6">
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
            {$locale === "en"
              ? "Please download my latest ATS-friendly CV in PDF format using the button below."
              : "CV sedang diperbarui secara berkala. Silakan unduh versi terbaru dalam format PDF melalui tombol di bawah."}
          </p>

          <!-- Sakuga Buttons -> replaced by Sakuga Progress while downloading -->
          {#if downloadState === "downloading" || downloadState === "done"}
            <div class="max-w-sm mx-auto text-left py-2">
              <sakuga-progress
                bind:this={progressEl}
                label={progressLabel}
              ></sakuga-progress>
            </div>
          {:else}
            <div class="flex flex-wrap items-center justify-center gap-3">
              <sakuga-button
                bind:this={downloadBtnEl}
                on:click={handleDownload}
                role="button"
                tabindex="0"
                on:keydown={(e: KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDownload();
                  }
                }}
              >
                {$locale === "en" ? "Download CV (PDF)" : "Unduh CV (PDF)"}
              </sakuga-button>

              <sakuga-button
                variant="secondary"
                on:click={openPreview}
                role="button"
                tabindex="0"
                on:keydown={(e: KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPreview();
                  }
                }}
              >
                {$locale === "en" ? "Open Preview ↗" : "Buka Pratinjau ↗"}
              </sakuga-button>
            </div>
          {/if}

          {#if downloadState === "error" && downloadError}
            <p class="text-xs text-rose-600 dark:text-rose-400 max-w-sm mx-auto">
              {downloadError}
            </p>
          {/if}

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

<style>
  .sakuga-cv-theme {
    --sk-pri: #2563eb;
    --sk-acc: #9333ea;
  }

  :global(.dark) .sakuga-cv-theme {
    --sk-card: #18181b;
    --sk-ink: #f4f4f5;
    --sk-muted: #a1a1aa;
    --sk-line: #3f3f46;
    --sk-pri: #3b82f6;
    --sk-acc: #a855f7;
  }

  sakuga-progress {
    display: block;
    width: 100%;
  }
</style>
