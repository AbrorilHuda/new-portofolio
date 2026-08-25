<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Blog } from '$lib/supabase/supabase';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import type { PageData } from './$types';

  export let data: PageData;

  $: blog = data.blog as Blog;

  let title = blog?.title ?? '';
  let slug = blog?.slug ?? '';
  let content = blog?.content ?? '';
  let excerpt = blog?.excerpt ?? '';
  let coverImage = blog?.cover_image ?? '';
  let author = blog?.author ?? '';
  let published = blog?.published ?? false;
  let saving = false;
  let error = '';
  let previewMode = false;
  let previewHtml = '';

  async function updatePreview() {
    if (content) {
      const rawHtml = await marked(content);
      previewHtml = DOMPurify.sanitize(rawHtml);
    }
  }

  async function handleSubmit() {
    error = '';

    if (!title || !slug || !content) {
      error = 'Judul, slug, dan konten wajib diisi';
      return;
    }

    saving = true;

    try {
      const res = await fetch('?/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          title,
          slug,
          content,
          excerpt,
          cover_image: coverImage,
          author,
          published: String(published)
        })
      });

      if (!res.ok) {
        const form = await res.json().catch(() => null);
        error = form?.message ?? 'Gagal menyimpan artikel';
        saving = false;
        return;
      }

      goto('/admin/blogs');
    } catch {
      error = 'Gagal menyimpan artikel';
      saving = false;
    }
  }
</script>

<div class="max-w-5xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold mb-2">Edit Artikel</h1>
      <p class="text-gray-600 dark:text-gray-400">Update artikel blog</p>
    </div>
    <a href="/admin/blogs" class="text-gray-600 hover:underline">
      ← Kembali
    </a>
  </div>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  {/if}

  {#if blog}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <div class="flex">
          <button 
            class="px-6 py-3 font-medium {!previewMode ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}"
            on:click={() => previewMode = false}
          >
            Edit
          </button>
          <button 
            class="px-6 py-3 font-medium {previewMode ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}"
            on:click={() => { previewMode = true; updatePreview(); }}
          >
            Preview
          </button>
        </div>
      </div>

      <div class="p-6">
        {#if !previewMode}
          <form on:submit|preventDefault={handleSubmit} class="space-y-6">
            <div>
              <label for="title" class="block text-sm font-medium mb-2">
                Judul Artikel *
              </label>
              <input
                id="title"
                type="text"
                required
                bind:value={title}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label for="slug" class="block text-sm font-medium mb-2">
                Slug (URL) *
              </label>
              <input
                id="slug"
                type="text"
                required
                bind:value={slug}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <p class="text-sm text-gray-500 mt-1">URL: /blog/{slug}</p>
            </div>

            <div>
              <label for="excerpt" class="block text-sm font-medium mb-2">
                Excerpt (Ringkasan)
              </label>
              <textarea
                id="excerpt"
                bind:value={excerpt}
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              ></textarea>
            </div>

            <div>
              <label for="coverImage" class="block text-sm font-medium mb-2">
                Cover Image URL
              </label>
              <input
                id="coverImage"
                type="url"
                bind:value={coverImage}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label for="author" class="block text-sm font-medium mb-2">
                Author
              </label>
              <input
                id="author"
                type="text"
                bind:value={author}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label for="content" class="block text-sm font-medium mb-2">
                Konten (Markdown) *
              </label>
              <textarea
                id="content"
                required
                bind:value={content}
                rows="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
              ></textarea>
            </div>

            <div class="flex items-center">
              <input
                id="published"
                type="checkbox"
                bind:checked={published}
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label for="published" class="ml-2 text-sm font-medium">
                Publish artikel
              </label>
            </div>

            <div class="flex justify-end space-x-4">
              <a 
                href="/admin/blogs"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
              >
                Batal
              </a>
              <button
                type="submit"
                disabled={saving}
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {#if saving}
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Menyimpan perubahan...</span>
                {:else}
                  <span>Update Artikel</span>
                {/if}
              </button>
            </div>
          </form>
        {:else}
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <h1>{title}</h1>
            {#if excerpt}
              <p class="text-gray-600 dark:text-gray-400">{excerpt}</p>
            {/if}
            {@html previewHtml}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.prose) { color: inherit; }
  :global(.prose h1) { font-size: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
  :global(.prose h2) { font-size: 1.875rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.875rem; }
  :global(.prose h3) { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  :global(.prose p) { margin-bottom: 1.25rem; line-height: 1.75; }
  :global(.prose a) { color: #3b82f6; text-decoration: underline; }
  :global(.prose code) { background-color: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; }
  :global(.dark .prose code) { background-color: #374151; }
  :global(.prose pre) { background-color: #1f2937; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
</style>