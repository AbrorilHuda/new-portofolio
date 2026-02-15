<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  $: stats = data.blogStats;
  $: messageStats = data.messageStats;
</script>

<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      Dashboard
    </h1>
    <p class="text-gray-600 dark:text-gray-400">
      Selamat datang di admin dashboard
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Artikel Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      <div
        class="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-blue-600 dark:text-blue-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h3
        class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2"
      >
        Total Artikel
      </h3>
      <p class="text-4xl font-bold text-gray-900 dark:text-white">
        {stats.total}
      </p>
    </div>

    <!-- Published Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      <div
        class="flex items-center justify-center w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-green-600 dark:text-green-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3
        class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2"
      >
        Published
      </h3>
      <p class="text-4xl font-bold text-gray-900 dark:text-white">
        {stats.published}
      </p>
    </div>

    <!-- Draft Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      <div
        class="flex items-center justify-center w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-amber-600 dark:text-amber-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </div>
      <h3
        class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2"
      >
        Draft
      </h3>
      <p class="text-4xl font-bold text-gray-900 dark:text-white">
        {stats.draft}
      </p>
    </div>

    <!-- Messages Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      <div
        class="flex items-center justify-center w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-purple-600 dark:text-purple-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>
      <h3
        class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2"
      >
        Messages
      </h3>
      <div class="flex items-baseline gap-2">
        <p class="text-4xl font-bold text-gray-900 dark:text-white">
          {messageStats.total}
        </p>
        {#if messageStats.unread > 0}
          <span
            class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold"
          >
            {messageStats.unread} new
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div
    class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
  >
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Quick Actions
    </h2>
    <div class="flex flex-wrap gap-3">
      <a
        href="/admin/blogs/new"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
      >
        Tulis Artikel Baru
      </a>
      <a
        href="/admin/blogs"
        class="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
      >
        Kelola Artikel
      </a>
      <a
        href="/admin/messages"
        class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
        Messages & Feedback
        {#if messageStats.unread > 0}
          <span
            class="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold"
          >
            {messageStats.unread}
          </span>
        {/if}
      </a>
      <a
        href="/blog"
        class="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
      >
        Lihat Blog
      </a>
    </div>
  </div>
</div>
