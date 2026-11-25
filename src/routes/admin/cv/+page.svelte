<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import { PUBLIC_UPLOADCARE_PUBLIC_KEY } from "$env/static/public";
  import { getDirectPdfDownloadUrl, type CVData } from "$lib/data/cv";
  import type { PageData, ActionData } from "./$types";

  export let data: PageData;
  export let form: ActionData;

  let cv: CVData = JSON.parse(JSON.stringify(data.cv));
  let pdfUrl = cv.pdf_url || "";
  let saving = false;

  const UC_JS = "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-inline.min.js";
  const UC_CSS = "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-regular.min.css";
  let ucReady = false;

  onMount(async () => {
    if (typeof window !== "undefined" && !window.customElements.get("uc-config")) {
      const UC = await import(/* @vite-ignore */ UC_JS);
      UC.defineComponents(UC);
    }
    ucReady = true;
  });

  function handleUploadSuccess(e: Event) {
    const detail = (e as CustomEvent).detail;
    if (!detail) return;
    const cdnUrl =
      detail.cdnUrl ||
      (detail.uuid ? `https://ucarecdn.com/${detail.uuid}/` : "");
    if (cdnUrl) {
      pdfUrl = cdnUrl;
    }
  }

  function uploadListener(node: HTMLElement) {
    const handler = (e: Event) => handleUploadSuccess(e);
    node.addEventListener("file-upload-success", handler);
    return {
      destroy() {
        node.removeEventListener("file-upload-success", handler);
      },
    };
  }

  $: directDownloadUrl = getDirectPdfDownloadUrl(pdfUrl);
  $: payloadString = JSON.stringify({
    ...cv,
    pdf_url: pdfUrl.trim(),
  });
</script>

<svelte:head>
  <title>Kelola CV (PDF) – Admin</title>
  <link rel="stylesheet" href={UC_CSS} />
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6 pb-20">
  <!-- Header -->
  <div class="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>PDF RESUME</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Kelola Curriculum Vitae (CV)
        </h1>
        <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Upload file PDF CV atau tempel link Google Drive untuk halaman publik <code class="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 text-xs font-mono">/cv</code>.
        </p>
      </div>

      <a
        href="/cv"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
      >
        <span>Lihat /cv ↗</span>
      </a>
    </div>

    {#if form?.success}
      <div class="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
        <span>{form.message || "File CV berhasil disimpan!"}</span>
      </div>
    {:else if form?.error}
      <div class="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
        <span>{form.error}</span>
      </div>
    {/if}
  </div>

  <!-- Upload / Link Card -->
  <div class="p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs space-y-6">
    <!-- Option 1: Direct PDF Upload -->
    <div class="space-y-2">
      <p class="text-sm font-bold text-zinc-900 dark:text-white">
        1. Upload File PDF Langsung
      </p>
      <p class="text-xs text-zinc-500 dark:text-zinc-400">
        Pilih file PDF CV dari perangkat Anda. URL file akan otomatis terisi di kolom bawah.
      </p>

      {#if ucReady && PUBLIC_UPLOADCARE_PUBLIC_KEY}
        <div use:uploadListener class="pt-1">
          <uc-config
            ctx-name="cv-pdf-uploader"
            pubkey={PUBLIC_UPLOADCARE_PUBLIC_KEY}
            multiple="false"
            accept=".pdf,application/pdf"
            source-list="local, url, gdrive"
          ></uc-config>
          <uc-file-uploader-regular ctx-name="cv-pdf-uploader"></uc-file-uploader-regular>
          <uc-upload-ctx-provider ctx-name="cv-pdf-uploader"></uc-upload-ctx-provider>
        </div>
      {:else}
        <div class="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-xs text-zinc-500">
          Memuat uploader PDF...
        </div>
      {/if}
    </div>

    <div class="border-t border-zinc-200/70 dark:border-zinc-800"></div>

    <!-- Option 2: Paste Google Drive / Direct PDF URL -->
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
      class="space-y-4"
    >
      <input type="hidden" name="payload" value={payloadString} />

      <div class="space-y-1.5">
        <label for="cv-pdf-url" class="text-sm font-bold text-zinc-900 dark:text-white block">
          2. Atau Tempel Link PDF / Google Drive
        </label>
        <input
          id="cv-pdf-url"
          type="url"
          bind:value={pdfUrl}
          placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
          class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <p class="text-[11px] text-zinc-500 dark:text-zinc-400">
          Link Google Drive otomatis dikonversi menjadi tautan unduh langsung. Kosongkan jika CV sedang dalam pembaruan.
        </p>
      </div>

      {#if directDownloadUrl}
        <div class="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 flex flex-wrap items-center justify-between gap-2">
          <div class="text-xs text-emerald-700 dark:text-emerald-300 truncate max-w-md">
            <span class="font-semibold">Tautan Unduh Aktif:</span>
            <span class="font-mono ml-1">{directDownloadUrl}</span>
          </div>
          <a
            href={directDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            Tes Unduh ↗
          </a>
        </div>
      {/if}

      <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          on:click={() => (pdfUrl = "")}
          disabled={!pdfUrl || saving}
          class="px-3.5 py-2 text-xs font-medium rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-40 cursor-pointer"
        >
          Kosongkan PDF
        </button>

        <button
          type="submit"
          disabled={saving}
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {#if saving}
            <span>Menyimpan...</span>
          {:else}
            <span>Simpan Perubahan</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
