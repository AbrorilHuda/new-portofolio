<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { PUBLIC_UPLOADCARE_PUBLIC_KEY } from "$env/static/public";
  import ConfirmDialog from "$lib/../components/ConfirmDialog.svelte";

  type Project = {
    id: number;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    link: string;
    created_at: string;
  };

  export let data: any;
  export let form: any;

  $: projects = (data.projects ?? []) as Project[];

  let editingItem: Project | null = null;
  let showCreateForm = false;
  let pendingDeleteId: number | null = null;
  let deleteForm: HTMLFormElement;

  let image = "";
  let submittingProject = false;
  let searchQuery = "";

  // Uploadcare File Uploader v1 (web components) via CDN, Regular mode
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
    if (!detail?.uuid) return;
    image = detail.cdnUrl || `https://${PUBLIC_UPLOADCARE_PUBLIC_KEY}.ucarecd.net/${detail.uuid}/`;
  }

  function startCreate() {
    editingItem = null;
    showCreateForm = true;
    image = "";
  }

  function startEdit(item: Project) {
    editingItem = { ...item };
    showCreateForm = false;
    image = item.image;
  }

  function cancelForm() {
    showCreateForm = false;
    editingItem = null;
    image = "";
  }

  $: filteredProjects = projects.filter((p: Project) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = p.title?.toLowerCase().includes(q);
    const matchDesc = p.description?.toLowerCase().includes(q);
    const matchTech = p.technologies?.some((t: string) => t.toLowerCase().includes(q));
    return matchTitle || matchDesc || matchTech;
  });
</script>

<svelte:head>
  <link rel="stylesheet" href={UC_CSS} />
</svelte:head>

<div class="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-20 sm:pb-12">
  <!-- Top Command Bar & Statistics Header -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
    <div>
      <div class="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
        <span>Admin</span>
        <span>/</span>
        <span class="text-blue-600 dark:text-blue-400">Projects</span>
      </div>
      <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Proyek & Portofolio
      </h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
        Kelola karya terbaik yang ditampilkan di etalase beranda
      </p>
    </div>

    <!-- Action & Metric Buttons -->
    <div class="flex items-center justify-between sm:justify-end gap-2.5">
      <span class="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-zinc-200/60 dark:border-zinc-700/60">
        {projects.length} Proyek
      </span>
      <button
        type="button"
        on:click={() => (showCreateForm || editingItem ? cancelForm() : startCreate())}
        class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer {showCreateForm || editingItem ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-none' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'}"
      >
        <span>{showCreateForm || editingItem ? '✕ Batal' : '+ Proyek Baru'}</span>
      </button>
    </div>
  </div>

  <!-- Form Alert Feedback -->
  {#if form?.error}
    <div class="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{form.error}</span>
    </div>
  {/if}
  {#if form?.success}
    <div class="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Berhasil disimpan!</span>
    </div>
  {/if}

  <!-- ── Create / Edit Form Card ── -->
  {#if showCreateForm || editingItem}
    <div class="rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xl p-4 sm:p-6 transition-all">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 class="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full {editingItem ? 'bg-amber-500' : 'bg-blue-500'}"></span>
          {editingItem ? 'Edit Proyek: ' + editingItem.title : 'Tambah Proyek Baru'}
        </h2>
        <button
          type="button"
          on:click={cancelForm}
          class="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          ✕ Tutup
        </button>
      </div>

      <form
        method="POST"
        action={editingItem ? "?/update" : "?/create"}
        use:enhance={() => {
          submittingProject = true;
          return async ({ update }) => {
            await update();
            invalidateAll();
            submittingProject = false;
            cancelForm();
          };
        }}
        class="space-y-4"
      >
        {#if editingItem}
          <input type="hidden" name="id" value={editingItem.id} />
        {/if}
        <input type="hidden" name="image" value={image} />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          <!-- Kolom Kiri: Form Text Inputs (7 cols on lg) -->
          <div class="lg:col-span-7 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="f_title">
                Judul Proyek *
              </label>
              <input
                id="f_title"
                name="title"
                required
                value={editingItem?.title ?? ""}
                placeholder="Contoh: Portfolio Website v2"
                class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="f_desc">
                Deskripsi Singkat
              </label>
              <textarea
                id="f_desc"
                name="description"
                rows="3"
                value={editingItem?.description ?? ""}
                placeholder="Satu atau dua kalimat penjelasan tentang fitur dan tujuan proyek..."
                class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="f_tech">
                  Teknologi (Koma)
                </label>
                <input
                  id="f_tech"
                  name="technologies"
                  value={editingItem?.technologies?.join(", ") ?? ""}
                  placeholder="SvelteKit, Tailwind, Supabase"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <p class="text-[11px] text-zinc-400 mt-1">Pisahkan dengan koma</p>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="f_link">
                  Link Proyek / Demo
                </label>
                <input
                  id="f_link"
                  name="link"
                  type="url"
                  value={editingItem?.link ?? ""}
                  placeholder="https://..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>

          <!-- Kolom Kanan: Gambar & Uploadcare (5 cols on lg) -->
          <div class="lg:col-span-5 space-y-2">
            <span class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Gambar Sampul *
            </span>

            {#if image}
              <div class="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group aspect-video bg-zinc-100 dark:bg-zinc-800 shadow-xs">
                <img src={image} alt="Preview project" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    on:click={() => (image = "")}
                    class="px-3 py-1.5 bg-white text-zinc-900 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-zinc-100"
                  >
                    Ganti Gambar
                  </button>
                </div>
              </div>
            {:else if ucReady}
              <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-center">
                <uc-config
                  ctx-name="project-uploader"
                  pubkey={PUBLIC_UPLOADCARE_PUBLIC_KEY}
                  source-list="local, camera, gdrive, url"
                  files-view-mode="grid"
                  userAgentIntegration="svelte-admin"
                ></uc-config>

                <uc-upload-ctx-provider
                  ctx-name="project-uploader"
                  on:file-upload-success={handleUploadSuccess}
                ></uc-upload-ctx-provider>

                <uc-file-uploader-regular
                  ctx-name="project-uploader"
                  class="uc-light dark:uc-dark block"
                ></uc-file-uploader-regular>
              </div>
            {:else}
              <div class="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                Memuat Uploadcare widget...
              </div>
            {/if}

            <!-- Manual input for image URL fallback -->
            <div class="pt-1">
              <label for="manual_img" class="block text-[11px] font-semibold text-zinc-400 mb-1">
                Atau input URL gambar langsung:
              </label>
              <input
                id="manual_img"
                type="url"
                bind:value={image}
                placeholder="https://example.com/project.jpg"
                class="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            on:click={cancelForm}
            class="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!image || submittingProject}
            class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {#if submittingProject}
              <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Menyimpan...</span>
            {:else}
              <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Proyek'}</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Search Filter Bar -->
  <div class="p-3 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl">
    <div class="relative w-full">
      <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari judul proyek, teknologi, atau deskripsi..."
        class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      {#if searchQuery}
        <button
          type="button"
          aria-label="Hapus pencarian"
          on:click={() => (searchQuery = '')}
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          ✕
        </button>
      {/if}
    </div>
  </div>

  <!-- ── Projects Grid List ── -->
  {#if filteredProjects.length === 0}
    <div class="text-center py-16 px-4 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 text-xs sm:text-sm">
      <p class="font-medium">Tidak ada proyek yang sesuai pencarian.</p>
      <p class="text-zinc-400 text-xs mt-1">Klik "+ Proyek Baru" untuk menambah karya baru.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {#each filteredProjects as item (item.id)}
        <div class="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden flex flex-col backdrop-blur-xl shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
          
          <!-- Image thumbnail (16:9) -->
          <div class="aspect-video w-full bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
            />
            {#if item.link}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                class="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                title="Buka Link Proyek"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            {/if}
          </div>

          <!-- Card Content Body -->
          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
            <div class="space-y-2 min-w-0 max-w-full">
              <div class="flex items-start justify-between gap-2 min-w-0">
                <h3 class="font-bold text-sm sm:text-base text-zinc-900 dark:text-white line-clamp-1 break-words min-w-0 flex-1">
                  {item.title}
                </h3>
                <span class="text-[10px] font-mono text-zinc-400 shrink-0">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              </div>

              {#if item.description}
                <p class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed break-words">
                  {item.description}
                </p>
              {/if}

              <!-- Technology Tags -->
              {#if item.technologies && item.technologies.length > 0}
                <div class="flex flex-wrap gap-1 pt-1">
                  {#each item.technologies.slice(0, 4) as tech}
                    <span class="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md text-[10px] font-semibold border border-zinc-200/40 dark:border-zinc-700/40">
                      {tech}
                    </span>
                  {/each}
                  {#if item.technologies.length > 4}
                    <span class="px-1.5 py-0.5 text-zinc-400 text-[10px] font-semibold">
                      +{item.technologies.length - 4}
                    </span>
                  {/if}
                </div>
              {/if}
            </div>

            <!-- Card Action Buttons with safe touch targets -->
            <div class="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              {#if item.link}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 text-center py-2 px-2.5 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <span>Lihat</span>
                  <svg class="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              {/if}

              <button
                type="button"
                on:click={() => startEdit(item)}
                class="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <span>Edit</span>
              </button>

              <button
                type="button"
                on:click={() => (pendingDeleteId = item.id)}
                class="p-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="Hapus Proyek"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Hidden delete form -->
<form
  method="POST"
  action="?/delete"
  use:enhance
  class="hidden"
  bind:this={deleteForm}
>
  <input type="hidden" name="id" value={pendingDeleteId ?? ""} />
</form>

<ConfirmDialog
  open={pendingDeleteId !== null}
  message="Yakin ingin menghapus proyek ini? Data dan gambar di Uploadcare akan dihapus secara permanen."
  on:confirm={() => {
    deleteForm.requestSubmit();
    pendingDeleteId = null;
  }}
  on:cancel={() => (pendingDeleteId = null)}
/>
