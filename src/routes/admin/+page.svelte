<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase/supabase';

  let stats = {
    total: 0,
    published: 0,
    draft: 0
  };
  let loading = true;

  onMount(async () => {
    const { data } = await supabase
      .from('blogs')
      .select('published');

    if (data) {
      stats.total = data.length;
      stats.published = data.filter(b => b.published).length;
      stats.draft = data.filter(b => !b.published).length;
    }
    loading = false;
  });
</script>

<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
    <p class="text-gray-600 dark:text-gray-400">Selamat datang di admin dashboard</p>
  </div>

  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each Array(3) as _}
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow animate-pulse">
          <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Artikel</h3>
        <p class="text-3xl font-bold">{stats.total}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Published</h3>
        <p class="text-3xl font-bold text-green-600">{stats.published}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Draft</h3>
        <p class="text-3xl font-bold text-yellow-600">{stats.draft}</p>
      </div>
    </div>
  {/if}

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
    <h2 class="text-xl font-bold mb-4">Quick Actions</h2>
    <div class="flex flex-wrap gap-4">
      <a 
        href="/admin/blogs/new" 
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        ✍️ Tulis Artikel Baru
      </a>
      <a 
        href="/admin/blogs" 
        class="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
      >
        📝 Kelola Artikel
      </a>
      <a 
        href="/blog" 
        class="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
      >
        👁️ Lihat Blog
      </a>
    </div>
  </div>
</div>