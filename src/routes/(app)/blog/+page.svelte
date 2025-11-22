<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase, type Blog } from '$lib/supabase';

  let blogs: Blog[] = [];
  let loading = true;

  onMount(async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) {
      blogs = data;
    }
    loading = false;
  });

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<div class="container mx-auto px-4 py-20 max-w-6xl">
  <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-3">Blog</h1>
  <p class="text-gray-600 dark:text-gray-400 mb-12">Artikel dan tulisan seputar teknologi</p>

  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each Array(6) as _}
        <div class="animate-pulse">
          <div class="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      {/each}
    </div>
  {:else if blogs.length === 0}
    <div class="text-center py-16">
      <p class="text-xl text-gray-600 dark:text-gray-400">Belum ada artikel yang dipublikasikan</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each blogs as blog}
        <a href="/blog/{blog.slug}" class="group">
          <article class="h-full flex flex-col">
            {#if blog.cover_image}
              <img 
                src={blog.cover_image} 
                alt={blog.title}
                class="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
              />
            {:else}
              <div class="w-full h-48 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg mb-4"></div>
            {/if}
            
            <div class="flex-1">
              <h2 class="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {blog.title}
              </h2>
              
              {#if blog.excerpt}
                <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
              {/if}
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
              <span>{blog.author}</span>
              <span>{formatDate(blog.created_at)}</span>
            </div>
          </article>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>