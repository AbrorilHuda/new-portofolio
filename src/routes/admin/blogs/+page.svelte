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
</script>

<div class="space-y-6">
  <!-- Header -->
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
  >
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Kelola Blog
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{blogs.length} artikel</p>
    </div>
    <a
      href="/admin/blogs/new"
      class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      Artikel Baru
    </a>
  </div>

  <!-- Content -->
  {#if actionError}
    <div class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400">
      {actionError}
    </div>
  {/if}

  {#if blogs.length === 0}
    <div
      class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center"
    >
      <p class="font-medium text-gray-900 dark:text-white mb-1">
        Belum ada artikel
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Mulai dengan membuat artikel pertama Anda
      </p>
      <a
        href="/admin/blogs/new"
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
      >
        Buat artikel pertama
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </a>
    </div>
  {:else}
    <div
      class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px]">
          <thead
            class="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800"
          >
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Judul
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Views
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each blogs as blog}
              <tr
                class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                <td class="px-4 py-3">
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {blog.title}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    /blog/{blog.slug}
                  </div>
                </td>
                <td class="px-4 py-3">
                  {#if blog.published}
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      <span
                        class="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full"
                      ></span>
                      Published
                    </span>
                  {:else}
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    >
                      <span
                        class="w-1.5 h-1.5 bg-yellow-600 dark:bg-yellow-400 rounded-full"
                      ></span>
                      Draft
                    </span>
                  {/if}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(blog.created_at)}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  <ViewCounter slug={blog.slug} />
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <!-- View -->
                    <a
                      href="/blog/{blog.slug}"
                      target="_blank"
                      class="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title="View"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </a>

                    <!-- Edit -->
                    <a
                      href="/admin/blogs/{blog.id}/edit"
                      class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        />
                        <path
                          d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                        />
                      </svg>
                    </a>

                    <!-- Toggle Publish -->
                    <button
                      on:click={() => togglePublish(blog)}
                      disabled={togglingId === blog.id}
                      class="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={blog.published ? "Unpublish" : "Publish"}
                    >
                      {#if togglingId === blog.id}
                        <svg
                          class="animate-spin h-[18px] w-[18px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      {:else if blog.published}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 5.4.5 7.7"
                          />
                          <path d="m17 17-5 5-5-5" />
                          <path d="M12 12v9" />
                        </svg>
                      {:else}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 5.4.5 7.7"
                          />
                          <path d="m17 7 5 5-5 5" />
                          <path d="M12 12h9" />
                        </svg>
                      {/if}
                    </button>

                    <!-- Delete -->
                    <button
                      on:click={() => (deleteConfirm = blog.id)}
                      class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
