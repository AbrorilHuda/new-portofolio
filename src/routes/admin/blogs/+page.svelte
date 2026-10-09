<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import type { Blog } from "$lib/supabase/supabase";
  import ViewCounter from "../../../components/ViewCounter.svelte";
  import ConfirmDialog from "../../../components/ConfirmDialog.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: blogs = data.blogs as Blog[];

  let deleteConfirm: string | null = null;
  let togglingId: string | null = null;
  let deletingId: string | null = null;
  let actionError = "";

  async function togglePublish(blog: Blog) {
    togglingId = blog.id;
    actionError = "";
    try {
      const res = await fetch("?/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id: blog.id, published: String(!blog.published) })
      });
      if (!res.ok) {
        const form = await res.json().catch(() => null);
        actionError = form?.message ?? "Gagal mengubah status publikasi";
      } else {
        await invalidateAll();
      }
    } catch {
      actionError = "Gagal mengubah status publikasi";
    }
    togglingId = null;
  }

  async function deleteBlog(id: string) {
    deletingId = id;
    actionError = "";
    try {
      const res = await fetch("?/delete", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id })
      });
      if (!res.ok) {
        const form = await res.json().catch(() => null);
        actionError = form?.message ?? "Gagal menghapus artikel";
      } else {
        deleteConfirm = null;
        await invalidateAll();
      }
    } catch {
      actionError = "Gagal menghapus artikel";
    }
    deletingId = null;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  let searchQuery = "";
  let statusFilter: "all" | "published" | "draft" = "all";

  $: filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && blog.published) ||
      (statusFilter === "draft" && !blog.published);

    return matchesSearch && matchesStatus;
  });

  $: publishedCount = blogs.filter((b) => b.published).length;
  $: draftCount = blogs.filter((b) => !b.published).length;
</script>

<div class="space-y-5 sm:space-y-6">
  <!-- Header Section -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Kelola Blog
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
        {blogs.length} total artikel · {publishedCount} terbit · {draftCount} draft
      </p>
    </div>
    <a
      href="/admin/blogs/new"
      class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs sm:text-sm shadow-xs transition-colors self-stretch sm:self-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span>Tulis Artikel Baru</span>
    </a>
  </div>

  <!-- Search and Status Filter Bar -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
    <!-- Search Input -->
    <div class="relative flex-1">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari berdasarkan judul atau slug..."
        class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {#if searchQuery}
        <button
          type="button"
          aria-label="Hapus pencarian"
          on:click={() => (searchQuery = "")}
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
    </div>

    <!-- Status Filter Pills -->
    <div class="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl overflow-x-auto shrink-0 select-none">
      <button
        type="button"
        on:click={() => (statusFilter = "all")}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {statusFilter === 'all'
          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
      >
        Semua ({blogs.length})
      </button>
      <button
        type="button"
        on:click={() => (statusFilter = "published")}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {statusFilter === 'published'
          ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
      >
        Terbit ({publishedCount})
      </button>
      <button
        type="button"
        on:click={() => (statusFilter = "draft")}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {statusFilter === 'draft'
          ? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 shadow-xs'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
      >
        Draft ({draftCount})
      </button>
    </div>
  </div>

  <!-- Content Section -->
  {#if actionError}
    <div class="p-3.5 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-600 dark:text-red-400 text-xs sm:text-sm">
      {actionError}
    </div>
  {/if}

  {#if blogs.length === 0}
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
      <p class="font-semibold text-gray-900 dark:text-white mb-1">
        Belum ada artikel
      </p>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
        Mulai dengan membuat artikel pertama Anda
      </p>
      <a
        href="/admin/blogs/new"
        class="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
      >
        Buat artikel pertama
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  {:else if filteredBlogs.length === 0}
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Tidak ditemukan artikel yang cocok dengan filter atau pencarian Anda.
      </p>
      <button
        type="button"
        on:click={() => { searchQuery = ""; statusFilter = "all"; }}
        class="mt-3 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
      >
        Reset pencarian & filter
      </button>
    </div>
  {:else}
    <!-- ============================================== -->
    <!-- MOBILE VIEW (sm:hidden) - Touch Friendly Cards -->
    <!-- ============================================== -->
    <div class="block sm:hidden space-y-3">
      {#each filteredBlogs as blog (blog.id)}
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3 shadow-xs">
          <!-- Top Row: Title + Status -->
          <div class="space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <a
                href="/admin/blogs/{blog.id}/edit"
                class="font-semibold text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
              >
                {blog.title}
              </a>
              {#if blog.published}
                <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                  <span class="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"></span>
                  Terbit
                </span>
              {:else}
                <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                  <span class="w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full"></span>
                  Draft
                </span>
              {/if}
            </div>
            <p class="text-[11px] font-mono text-gray-400 truncate">
              /blog/{blog.slug}
            </p>
          </div>

          <!-- Metadata Info Row: Date + Views -->
          <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 pt-2.5">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {formatDate(blog.created_at)}
            </span>
            <span>·</span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c1.07-3.291 4.201-5.75 7.964-5.75s6.894 2.459 7.964 5.75c-1.07 3.291-4.201 5.75-7.964 5.75s-6.894-2.459-7.964-5.75z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <ViewCounter slug={blog.slug} /> views
            </span>
          </div>

          <!-- Mobile Action Buttons Grid -->
          <div class="grid grid-cols-4 gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-800/80">
            <!-- View Live -->
            <a
              href="/blog/{blog.slug}"
              target="_blank"
              class="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-medium transition-colors"
              title="Lihat Artikel"
            >
              <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span>Lihat</span>
            </a>

            <!-- Edit -->
            <a
              href="/admin/blogs/{blog.id}/edit"
              class="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-[10px] font-semibold transition-colors"
              title="Edit Artikel"
            >
              <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              <span>Edit</span>
            </a>

            <!-- Toggle Publish -->
            <button
              type="button"
              on:click={() => togglePublish(blog)}
              disabled={togglingId === blog.id}
              class="flex flex-col items-center justify-center py-2 px-1 rounded-lg {blog.published ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'} text-[10px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
              title={blog.published ? "Tarik ke draft" : "Terbitkan"}
            >
              {#if togglingId === blog.id}
                <svg class="w-4 h-4 mb-0.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>...</span>
              {:else}
                <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                <span>{blog.published ? "Draft" : "Terbit"}</span>
              {/if}
            </button>

            <!-- Delete -->
            <button
              type="button"
              on:click={() => (deleteConfirm = blog.id)}
              class="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-[10px] font-medium transition-colors cursor-pointer"
              title="Hapus Artikel"
            >
              <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span>Hapus</span>
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- ============================================== -->
    <!-- DESKTOP VIEW (hidden sm:block) - Polished Table -->
    <!-- ============================================== -->
    <div class="hidden sm:block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Judul & Slug
              </th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Views
              </th>
              <th class="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            {#each filteredBlogs as blog (blog.id)}
              <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors">
                <td class="px-4 py-3.5">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {blog.title}
                  </div>
                  <div class="text-xs text-gray-400 font-mono mt-0.5">
                    /blog/{blog.slug}
                  </div>
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap">
                  {#if blog.published}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <span class="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"></span>
                      Published
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      <span class="w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full"></span>
                      Draft
                    </span>
                  {/if}
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(blog.created_at)}
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                  <ViewCounter slug={blog.slug} />
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- View -->
                    <a
                      href="/blog/{blog.slug}"
                      target="_blank"
                      class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Lihat di situs"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>

                    <!-- Edit -->
                    <a
                      href="/admin/blogs/{blog.id}/edit"
                      class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit artikel"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                      </svg>
                    </a>

                    <!-- Toggle Publish -->
                    <button
                      type="button"
                      on:click={() => togglePublish(blog)}
                      disabled={togglingId === blog.id}
                      class="p-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      title={blog.published ? "Tarik ke draft" : "Terbitkan artikel"}
                    >
                      {#if togglingId === blog.id}
                        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      {:else if blog.published}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      {:else}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c1.07-3.291 4.201-5.75 7.964-5.75s6.894 2.459 7.964 5.75c-1.07 3.291-4.201 5.75-7.964 5.75s-6.894-2.459-7.964-5.75z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      {/if}
                    </button>

                    <!-- Delete -->
                    <button
                      type="button"
                      on:click={() => (deleteConfirm = blog.id)}
                      class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                      title="Hapus artikel"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<ConfirmDialog
  open={!!deleteConfirm}
  message="Apakah Anda yakin ingin menghapus artikel ini? Semua data akan hilang secara permanen."
  loading={deletingId !== null}
  on:confirm={() => deleteBlog(deleteConfirm!)}
  on:cancel={() => (deleteConfirm = null)}
/>
