<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  $: stats = data.blogStats;
  $: messageStats = data.messageStats;
</script>

<div class="space-y-8">
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Ringkasan konten & pesan</p>
  </div>

  <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
    <a href="/admin/blogs" class="bg-white dark:bg-gray-900 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
      <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Artikel</p>
      <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{stats.total}</p>
      <p class="text-xs text-gray-400 mt-1">{stats.published} terbit · {stats.draft} draft</p>
    </a>

    <a href="/admin/messages" class="bg-white dark:bg-gray-900 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
      <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Pesan</p>
      <div class="flex items-baseline gap-2 mt-2">
        <p class="text-3xl font-semibold text-gray-900 dark:text-white">{messageStats.total}</p>
        {#if messageStats.unread > 0}
          <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{messageStats.unread} baru</span>
        {/if}
      </div>
    </a>
  </div>

  <section>
    <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Aksi cepat</h2>
    <div class="flex flex-wrap gap-2">
      <a
        href="/admin/blogs/new"
        class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Tulis artikel
      </a>
      <a
        href="/admin/thoughts"
        class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Celoteh baru
      </a>
      <a
        href="/admin/now"
        class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Update /now
      </a>
    </div>
  </section>
</div>
