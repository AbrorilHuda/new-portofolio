<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import type { NowItem } from "$lib/supabase/supabase";
  import ConfirmDialog from "$lib/../components/ConfirmDialog.svelte";

  export let data: PageData;
  export let form: ActionData;

  $: nowItems = (data.nowItems ?? []) as NowItem[];

  let editingItem: NowItem | null = null;
  let showCreateForm = false;
  let pendingDeleteItem: NowItem | null = null;
  let deleteForm: HTMLFormElement;
  let deleting = false;
  let saving = false;
  let updating = false;

  let searchQuery = "";
  let filterStatus: "all" | "active" | "completed" = "all";
  let filterPriority: "all" | "high" | "medium" | "low" = "all";

  function startEdit(item: NowItem) {
    editingItem = { ...item };
    showCreateForm = false;
  }

  function cancelEdit() {
    editingItem = null;
  }

  function tasksToText(tasks: string[]): string {
    return tasks.join("\n");
  }

  $: activeCount = nowItems.filter((i: any) => i.status === "active").length;
  $: completedCount = nowItems.filter((i: any) => i.status === "completed").length;

  $: filteredItems = nowItems.filter((item: any) => {
    const matchesSearch =
      !searchQuery ||
      item.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tasks &&
        item.tasks.some((t: string) =>
          t.toLowerCase().includes(searchQuery.toLowerCase()),
        ));
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || item.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const priorityConfig: Record<
    string,
    { label: string; badge: string; border: string; dot: string }
  > = {
    high: {
      label: "Tinggi",
      badge:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      border: "border-l-rose-500",
      dot: "bg-rose-500",
    },
    medium: {
      label: "Sedang",
      badge:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      border: "border-l-amber-500",
      dot: "bg-amber-500",
    },
    low: {
      label: "Rendah",
      badge:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      border: "border-l-blue-500",
      dot: "bg-blue-500",
    },
  };

  const statusConfig: Record<string, { label: string; badge: string }> = {
    active: {
      label: "Aktif",
      badge:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    completed: {
      label: "Selesai",
      badge:
        "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20",
    },
  };
</script>

<div class="max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-20 sm:pb-12">
  <!-- Top Command Bar & Statistics Header -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
    <div>
      <div class="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
        <span>Admin</span>
        <span>/</span>
        <span class="text-blue-600 dark:text-blue-400">Now</span>
      </div>
      <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Now — Fokus Saat Ini
      </h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
        Kelola proyek & aktivitas yang ditampilkan di halaman publik <a href="/now" target="_blank" class="text-blue-500 hover:underline font-semibold">/now</a>
      </p>
    </div>

    <!-- Metric Badges & Create Action -->
    <div class="flex items-center justify-between sm:justify-end gap-2.5">
      <div class="flex items-center gap-1.5">
        <span class="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-zinc-200/60 dark:border-zinc-700/60">
          {nowItems.length} Total
        </span>
        <span class="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
          {activeCount} Aktif
        </span>
        <span class="px-2.5 py-1 rounded-xl bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 text-xs font-bold border border-zinc-500/20">
          {completedCount} Selesai
        </span>
      </div>

      <button
        type="button"
        on:click={() => {
          showCreateForm = !showCreateForm;
          editingItem = null;
        }}
        class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer {showCreateForm ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-none' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'}"
      >
        <span>{showCreateForm ? '✕ Batal' : '+ Tambah Fokus'}</span>
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

  <!-- ── Create Form Card ── -->
  {#if showCreateForm}
    <div class="rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xl p-4 sm:p-6 transition-all">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 class="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          Tambah Fokus Baru
        </h2>
        <button
          type="button"
          on:click={() => (showCreateForm = false)}
          class="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          ✕ Tutup
        </button>
      </div>

      <form
        method="POST"
        action="?/create"
        use:enhance={() => {
          saving = true;
          return async ({ update }) => {
            await update();
            saving = false;
            showCreateForm = false;
          };
        }}
        class="space-y-4"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 min-w-0 max-w-full">
          <div class="min-w-0">
            <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="create_name">
              Nama Proyek / Fokus *
            </label>
            <input
              id="create_name"
              name="project_name"
              type="text"
              required
              placeholder="Contoh: Mobile Apps v2"
              class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div class="min-w-0">
            <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="create_github">
              GitHub URL *
            </label>
            <input
              id="create_github"
              name="github_url"
              type="url"
              required
              value="https://"
              placeholder="https://github.com/username/repo"
              class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="create_priority">
              Prioritas
            </label>
            <select
              id="create_priority"
              name="priority"
              class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="high">🔴 Tinggi (High)</option>
              <option value="medium" selected>🟡 Sedang (Medium)</option>
              <option value="low">🔵 Rendah (Low)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="create_status">
              Status
            </label>
            <select
              id="create_status"
              name="status"
              class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="active" selected>🟢 Aktif</option>
              <option value="completed">⚪ Selesai</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="create_order">
              Urutan (Sort Order)
            </label>
            <input
              id="create_order"
              name="sort_order"
              type="number"
              value="0"
              min="0"
              class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5" for="create_tasks">
            Daftar Tugas / Target <span class="text-zinc-400 font-normal lowercase">(satu baris per target)</span>
          </label>
          <textarea
            id="create_tasks"
            name="tasks"
            rows="4"
            placeholder="Redesain tampilan navigation UI&#10;Implementasi dark mode&#10;Perbaikan performa mobile"
            class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={saving}
            on:click={() => (showCreateForm = false)}
            class="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {#if saving}
              <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Menyimpan...</span>
            {:else}
              <span>Simpan Fokus</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Search & Filter Controls -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl">
    <div class="relative flex-1">
      <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari fokus atau tugas..."
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

    <!-- Status Filters -->
    <div class="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl shrink-0 self-start sm:self-center">
      <button
        type="button"
        on:click={() => (filterStatus = 'all')}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {filterStatus === 'all' ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
      >
        Semua
      </button>
      <button
        type="button"
        on:click={() => (filterStatus = 'active')}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {filterStatus === 'active' ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
      >
        Aktif
      </button>
      <button
        type="button"
        on:click={() => (filterStatus = 'completed')}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {filterStatus === 'completed' ? 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
      >
        Selesai
      </button>
    </div>
  </div>

  <!-- ── Items List ── -->
  {#if filteredItems.length === 0}
    <div class="text-center py-16 px-4 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 text-xs sm:text-sm">
      <p class="font-medium">Tidak ada fokus yang ditemukan.</p>
      <p class="text-zinc-400 text-xs mt-1">Klik "+ Tambah Fokus" untuk membuat fokus baru.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each filteredItems as item (item.id)}
        <div
          class="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 border-l-4 {priorityConfig[item.priority ?? 'medium']?.border || 'border-l-blue-500'} backdrop-blur-xl shadow-xs p-4 sm:p-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden min-w-0 max-w-full {item.status === 'completed' ? 'opacity-75' : ''}"
        >
          {#if editingItem?.id === item.id}
            <!-- ── Inline Edit Form ── -->
            <form
              method="POST"
              action="?/update"
              use:enhance={() => {
                updating = true;
                return async ({ update }) => {
                  await update();
                  updating = false;
                  editingItem = null;
                };
              }}
              class="space-y-4"
            >
              <input type="hidden" name="id" value={item.id} />
              
              <div class="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <span class="text-xs font-bold uppercase tracking-wider text-blue-500">Edit Fokus</span>
                <button type="button" on:click={cancelEdit} class="text-xs text-zinc-400 hover:text-zinc-600">✕ Batal</button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 min-w-0 max-w-full">
                <div class="min-w-0">
                  <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1" for="edit_name_{item.id}">
                    Nama Proyek *
                  </label>
                  <input
                    id="edit_name_{item.id}"
                    name="project_name"
                    type="text"
                    required
                    bind:value={editingItem.project_name}
                    class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div class="min-w-0">
                  <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1" for="edit_github_{item.id}">
                    GitHub URL *
                  </label>
                  <input
                    id="edit_github_{item.id}"
                    name="github_url"
                    type="url"
                    required
                    bind:value={editingItem.github_url}
                    class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1" for="edit_priority_{item.id}">
                    Prioritas
                  </label>
                  <select
                    id="edit_priority_{item.id}"
                    name="priority"
                    bind:value={editingItem.priority}
                    class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="high">🔴 Tinggi (High)</option>
                    <option value="medium">🟡 Sedang (Medium)</option>
                    <option value="low">🔵 Rendah (Low)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1" for="edit_status_{item.id}">
                    Status
                  </label>
                  <select
                    id="edit_status_{item.id}"
                    name="status"
                    bind:value={editingItem.status}
                    class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="active">🟢 Aktif</option>
                    <option value="completed">⚪ Selesai</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1" for="edit_order_{item.id}">
                    Urutan
                  </label>
                  <input
                    id="edit_order_{item.id}"
                    name="sort_order"
                    type="number"
                    bind:value={editingItem.sort_order}
                    min="0"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1" for="edit_tasks_{item.id}">
                  Daftar Tugas (satu per baris)
                </label>
                <textarea
                  id="edit_tasks_{item.id}"
                  name="tasks"
                  rows="4"
                  value={tasksToText(editingItem.tasks)}
                  class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs sm:text-sm font-mono leading-relaxed focus:ring-2 focus:ring-blue-500/40 resize-y"
                ></textarea>
              </div>

              <div class="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={updating}
                  on:click={cancelEdit}
                  class="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {#if updating}
                    <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memperbarui...</span>
                  {:else}
                    <span>Perbarui Fokus</span>
                  {/if}
                </button>
              </div>
            </form>

          {:else}
            <!-- ── Display Mode Card ── -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 min-w-0 max-w-full">
              <div class="flex-1 min-w-0 max-w-full">
                <!-- Header badges row -->
                <div class="flex items-center gap-2 flex-wrap mb-2">
                  <h3 class="text-base sm:text-lg font-bold text-zinc-900 dark:text-white break-words">
                    {item.project_name}
                  </h3>
                  <!-- Priority badge -->
                  <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border {priorityConfig[item.priority ?? 'medium']?.badge}">
                    {priorityConfig[item.priority ?? 'medium']?.label}
                  </span>
                  <!-- Status badge -->
                  <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border {statusConfig[item.status ?? 'active']?.badge}">
                    {statusConfig[item.status ?? 'active']?.label}
                  </span>
                  <!-- Order badge -->
                  <span class="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    #{item.sort_order}
                  </span>
                </div>

                <!-- GitHub link with strict overflow protection -->
                <div class="min-w-0 max-w-full mb-3">
                  <a
                    href={item.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1.5 font-mono min-w-0 max-w-full"
                    title={item.github_url}
                  >
                    <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span class="truncate min-w-0 flex-1">{item.github_url}</span>
                  </a>
                </div>

                <!-- Tasks list -->
                {#if item.tasks && item.tasks.length > 0}
                  <ul class="space-y-1.5 pt-1">
                    {#each item.tasks as task}
                      <li class="flex items-start gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 min-w-0 max-w-full">
                        <span class="mt-1.5 w-1.5 h-1.5 rounded-full {priorityConfig[item.priority ?? 'medium']?.dot || 'bg-blue-500'} shrink-0"></span>
                        <span class="leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 flex-1 {item.status === 'completed' ? 'line-through text-zinc-400' : ''}">{task}</span>
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <p class="text-xs text-zinc-400 italic">
                    Belum ada target tugas yang dicatat.
                  </p>
                {/if}
              </div>

              <!-- Action buttons with safe mobile ergonomics -->
              <div class="flex items-center gap-2 pt-2 sm:pt-0 shrink-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 justify-end">
                <button
                  type="button"
                  on:click={() => startEdit(item)}
                  class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  on:click={() => (pendingDeleteItem = item)}
                  class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Hidden delete form, submitted programmatically -->
<form
  method="POST"
  action="?/delete"
  use:enhance
  class="hidden"
  bind:this={deleteForm}
>
  <input type="hidden" name="id" value={pendingDeleteItem?.id ?? ""} />
</form>

<ConfirmDialog
  open={pendingDeleteItem !== null}
  message="Apakah Anda yakin ingin menghapus item fokus ini? Data akan hilang secara permanen."
  loading={deleting}
  on:confirm={() => {
    deleting = true;
    deleteForm.requestSubmit();
    pendingDeleteItem = null;
    deleting = false;
  }}
  on:cancel={() => (pendingDeleteItem = null)}
/>
