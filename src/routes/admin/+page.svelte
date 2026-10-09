<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  $: stats = data.blogStats;
  $: messageStats = data.messageStats;
  $: projectStats = data.projectStats;
  $: thoughtStats = data.thoughtStats;
  $: nowStats = data.nowStats;
</script>

<div class="space-y-6 sm:space-y-8">
  <!-- Header Overview -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <div>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
        Ringkasan konten, metrik, & kontrol cepat
      </p>
    </div>
    {#if messageStats.unread > 0}
      <a
        href="/admin/messages"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-medium hover:bg-blue-500/20 transition-colors self-start sm:self-auto"
      >
        <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
        <span>{messageStats.unread} pesan baru belum dibaca</span>
      </a>
    {/if}
  </div>

  <!-- Metrics Grid (Responsive 2-col on mobile, 3 on sm, 5 on lg) -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
    <!-- Blog Stats Card -->
    <a
      href="/admin/blogs"
      class="group relative bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artikel</span>
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{stats.total}</p>
        <p class="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
          <span class="text-emerald-600 dark:text-emerald-400 font-medium">{stats.published} terbit</span> · {stats.draft} draft
        </p>
      </div>
    </a>

    <!-- Celoteh Stats Card -->
    <a
      href="/admin/thoughts"
      class="group relative bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Celoteh</span>
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{thoughtStats.total}</p>
        <p class="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
          {thoughtStats.public} publik · {thoughtStats.private} privat
        </p>
      </div>
    </a>

    <!-- Now Focus Stats Card -->
    <a
      href="/admin/now"
      class="group relative bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fokus Now</span>
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{nowStats.total}</p>
        <p class="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
          <span class="text-amber-600 dark:text-amber-400 font-medium">{nowStats.active} aktif</span> · {nowStats.completed} selesai
        </p>
      </div>
    </a>

    <!-- Projects Stats Card -->
    <a
      href="/admin/projects"
      class="group relative bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proyek</span>
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{projectStats.published}</p>
        <p class="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
          {projectStats.total} proyek portofolio
        </p>
      </div>
    </a>

    <!-- Messages Stats Card -->
    <a
      href="/admin/messages"
      class="col-span-2 sm:col-span-1 group relative bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pesan</span>
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
      </div>
      <div class="mt-3">
        <div class="flex items-baseline gap-2">
          <p class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{messageStats.total}</p>
          {#if messageStats.unread > 0}
            <span class="text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">
              +{messageStats.unread} baru
            </span>
          {/if}
        </div>
        <p class="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
          Feedback dari pengunjung
        </p>
      </div>
    </a>
  </div>

  <!-- Quick Action Hub (2-col mobile, 4-col desktop) -->
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Aksi Cepat
      </h2>
      <span class="text-[11px] text-gray-400 hidden xs:inline">Pintasan praktis untuk admin</span>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- Write Article Action -->
      <a
        href="/admin/blogs/new"
        class="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white hover:shadow-sm transition-all flex flex-col justify-between"
      >
        <div class="w-9 h-9 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div>
          <h3 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Tulis Artikel
          </h3>
          <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
            Buat konten blog baru
          </p>
        </div>
      </a>

      <!-- Post Celoteh Action -->
      <a
        href="/admin/thoughts"
        class="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white hover:shadow-sm transition-all flex flex-col justify-between"
      >
        <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
        </div>
        <div>
          <h3 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Post Celoteh
          </h3>
          <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
            Catatan singkat / thoughts
          </p>
        </div>
      </a>

      <!-- Focus /now Action -->
      <a
        href="/admin/now"
        class="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white hover:shadow-sm transition-all flex flex-col justify-between"
      >
        <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Update /now
          </h3>
          <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
            Kelola fokus proyek publik
          </p>
        </div>
      </a>

      <!-- Manage Projects Action -->
      <a
        href="/admin/projects"
        class="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white hover:shadow-sm transition-all flex flex-col justify-between"
      >
        <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 flex items-center justify-center shrink-0 mb-3 group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6A2.25 2.25 0 004.83 20.25h14.34a2.25 2.25 0 002.213-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
        </div>
        <div>
          <h3 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            Portofolio
          </h3>
          <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
            Tambah / ubah proyek
          </p>
        </div>
      </a>
    </div>
  </section>
</div>



