<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  let title = '';
  let slug = '';
  let content = '';
  let excerpt = '';
  let coverImage = '';
  let author = 'Abrordc';
  let published = false;
  let loading = false;
  let error = '';
  let previewMode = false;
  let previewHtml = '';
  const contentPlaceholder = `# Heading 1

Tulis konten artikel dengan Markdown...

## Heading 2

- List item
- List item

**Bold text** dan *italic text*

${'```'}javascript
console.log('Code block');
${'```'}`;

  function generateSlug() {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

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

    loading = true;

    // console.log(supabase.auth.getUser().then(res => console.log(res)))
    const { data, error: insertError } = await supabase
      .from('blogs')
      .insert([
        {
          title,
          slug,
          content,
          excerpt,
          cover_image: coverImage || null,
          author,
          published
        }
      ])
      .select()
      .single();

      // console.log("datas: ", data)
    if (insertError) {
      if (insertError.code === '23505') {
        error = 'Slug sudah digunakan, gunakan slug yang berbeda';
      } else {
        error = 'Gagal menyimpan artikel ' + insertError.message;
      }
      loading = false;
      return;
    }

    goto('/admin/blogs');
  }

  $: if (title && !slug) generateSlug();
</script>

<div class="max-w-5xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold mb-2">Artikel Baru</h1>
      <p class="text-gray-600 dark:text-gray-400">Buat artikel blog baru</p>
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
              on:input={generateSlug}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Masukkan judul artikel"
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
              placeholder="artikel-slug"
            />
            <p class="text-sm text-gray-500 mt-1">URL: /blog/{slug || 'artikel-slug'}</p>
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
              placeholder="Ringkasan singkat artikel..."
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
              placeholder="https://example.com/image.jpg"
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
              placeholder={contentPlaceholder}
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">
              Gunakan Markdown untuk format. 
              <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" class="text-blue-600 hover:underline">
                Panduan Markdown
              </a>
            </p>
          </div>

          <div class="flex items-center">
            <input
              id="published"
              type="checkbox"
              bind:checked={published}
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label for="published" class="ml-2 text-sm font-medium">
              Publish artikel (artikel akan langsung terlihat di website)
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
              disabled={loading}
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : published ? 'Publish' : 'Simpan sebagai Draft'}
            </button>
          </div>
        </form>
      {:else}
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <h1>{title || 'Judul Artikel'}</h1>
          {#if excerpt}
            <p class="text-gray-600 dark:text-gray-400">{excerpt}</p>
          {/if}
          {@html previewHtml}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.prose) {
    color: inherit;
  }
  :global(.prose h1) { font-size: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
  :global(.prose h2) { font-size: 1.875rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.875rem; }
  :global(.prose h3) { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  :global(.prose p) { margin-bottom: 1.25rem; line-height: 1.75; }
  :global(.prose a) { color: #3b82f6; text-decoration: underline; }
  :global(.prose ul, .prose ol) { margin-bottom: 1.25rem; padding-left: 1.5rem; }
  :global(.prose code) { background-color: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; }
  :global(.dark .prose code) { background-color: #374151; }
  :global(.prose pre) { background-color: #1f2937; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1.25rem; }
  :global(.prose pre code) { background-color: transparent; padding: 0; color: #e5e7eb; }
</style>