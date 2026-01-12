<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase, type Blog } from '$lib/supabase/supabase';
  import ViewCounter from '../../../components/ViewCounter.svelte';

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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
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
             <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Views
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
              <td class="px-6 py-4 text-sm text-gray-500">
                <ViewCounter slug={blog.slug}/>
              </td>
              <td class="px-6 py-4 text-right text-sm space-x-2">
                <a 
                  href="/blog/{blog.slug}" 
                  target="_blank"
                  class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="view blog"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-click-icon lucide-mouse-pointer-click"><path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/></svg>
                </a>
                <a 
                  href="/admin/blogs/{blog.id}/edit"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                  aria-label="edit blogs"
                >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
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
                  aria-label="delete blogs"
                >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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