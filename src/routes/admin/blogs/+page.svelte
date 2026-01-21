<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase, type Blog } from '$lib/supabase/supabase';
  import ViewCounter from '../../../components/ViewCounter.svelte';

  let blogs: Blog[] = [];
  let loading = true;
  let deleteConfirm: string | null = null;
  let togglingId: string | null = null;
  let deletingId: string | null = null;

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
    togglingId = blog.id;
    const { error } = await supabase
      .from('blogs')
      .update({ published: !blog.published })
      .eq('id', blog.id);

    if (!error) {
      await loadBlogs();
    }
    togglingId = null;
  }

  async function deleteBlog(id: string) {
    deletingId = id;
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (!error) {
      deleteConfirm = null;
      await loadBlogs();
    }
    deletingId = null;
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
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kelola Blog</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage semua artikel blog</p>
    </div>
    <a 
      href="/admin/blogs/new"
      class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Artikel Baru
    </a>
  </div>

  <!-- Content -->
  {#if loading}
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-8 space-y-4">
        {#each Array(5) as _}
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        {/each}
      </div>
    </div>
  {:else if blogs.length === 0}
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <p class="text-xl font-medium text-gray-900 dark:text-white mb-2">Belum ada artikel</p>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan membuat artikel pertama Anda</p>
      <a href="/admin/blogs/new" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
        Buat artikel pertama
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Judul
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Views
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each blogs as blog}
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{blog.title}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">/blog/{blog.slug}</div>
                </td>
                <td class="px-6 py-4">
                  {#if blog.published}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <span class="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full"></span>
                      Published
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <span class="w-1.5 h-1.5 bg-yellow-600 dark:bg-yellow-400 rounded-full"></span>
                      Draft
                    </span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(blog.created_at)}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <ViewCounter slug={blog.slug}/>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <!-- View -->
                    <a 
                      href="/blog/{blog.slug}" 
                      target="_blank"
                      class="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title="View"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </a>
                    
                    <!-- Edit -->
                    <a 
                      href="/admin/blogs/{blog.id}/edit"
                      class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                      </svg>
                    </a>
                    
                    <!-- Toggle Publish -->
                    <button 
                      on:click={() => togglePublish(blog)}
                      disabled={togglingId === blog.id}
                      class="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={blog.published ? 'Unpublish' : 'Publish'}
                    >
                      {#if togglingId === blog.id}
                        <svg class="animate-spin h-[18px] w-[18px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      {:else if blog.published}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 5.4.5 7.7"/>
                          <path d="m17 17-5 5-5-5"/>
                          <path d="M12 12v9"/>
                        </svg>
                      {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 5.4.5 7.7"/>
                          <path d="m17 7 5 5-5 5"/>
                          <path d="M12 12h9"/>
                        </svg>
                      {/if}
                    </button>
                    
                    <!-- Delete -->
                    <button 
                      on:click={() => deleteConfirm = blog.id}
                      class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 11v6"/>
                        <path d="M14 11v6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M3 6h18"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
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

<!-- Delete Confirmation Modal -->
{#if deleteConfirm}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-red-600 dark:text-red-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
      </div>
      
      <!-- Modal Body -->
      <div class="p-6">
        <p class="text-gray-700 dark:text-gray-300">
          Apakah Anda yakin ingin menghapus artikel ini? Semua data akan hilang secara permanen.
        </p>
      </div>
      
      <!-- Modal Footer -->
      <div class="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl flex justify-end gap-3">
        <button 
          on:click={() => deleteConfirm = null}
          disabled={deletingId !== null}
          class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button 
          on:click={() => deleteBlog(deleteConfirm!)}
          disabled={deletingId !== null}
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {#if deletingId}
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Menghapus...
          {:else}
            Hapus
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}