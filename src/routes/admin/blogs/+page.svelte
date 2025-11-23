<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase, type Blog } from '$lib/supabase/supabase';

  let blogs: Blog[] = [];
  let loading = true;
  let deleteConfirm: string | null = null;

  async function loadBlogs() {
    loading = true;
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      blogs = data;
    }
    loading = false;
  }

  onMount(loadBlogs);

  async function togglePublish(blog: Blog) {
    const { error } = await supabase
      .from('blogs')
      .update({ published: !blog.published })
      .eq('id', blog.id);

    if (!error) {
      loadBlogs();
    }
  }

  async function deleteBlog(id: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (!error) {
      deleteConfirm = null;
      loadBlogs();
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold mb-2">Kelola Blog</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage semua artikel blog</p>
    </div>
    <a 
      href="/admin/blogs/new"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
    >
      + Artikel Baru
    </a>
  </div>

  {#if loading}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="animate-pulse p-8 space-y-4">
        {#each Array(5) as _}
          <div class="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        {/each}
      </div>
    </div>
  {:else if blogs.length === 0}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">Belum ada artikel</p>
      <a href="/admin/blogs/new" class="text-blue-600 hover:underline">
        Buat artikel pertama →
      </a>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Judul
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tanggal
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          {#each blogs as blog}
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="text-sm font-medium">{blog.title}</div>
                <div class="text-sm text-gray-500">/blog/{blog.slug}</div>
              </td>
              <td class="px-6 py-4">
                {#if blog.published}
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Published
                  </span>
                {:else}
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Draft
                  </span>
                {/if}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {formatDate(blog.created_at)}
              </td>
              <td class="px-6 py-4 text-right text-sm space-x-2">
                <a 
                  href="/blog/{blog.slug}" 
                  target="_blank"
                  class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  👁️
                </a>
                <a 
                  href="/admin/blogs/{blog.id}/edit"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  ✏️
                </a>
                <button 
                  on:click={() => togglePublish(blog)}
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                  title={blog.published ? 'Unpublish' : 'Publish'}
                >
                  {blog.published ? '📤' : '📥'}
                </button>
                <button 
                  on:click={() => deleteConfirm = blog.id}
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                >
                  🗑️
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if deleteConfirm}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
      <h3 class="text-xl font-bold mb-4">Konfirmasi Hapus</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div class="flex justify-end space-x-4">
        <button 
          on:click={() => deleteConfirm = null}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Batal
        </button>
        <button 
          on:click={() => deleteBlog(deleteConfirm!)}
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
{/if}