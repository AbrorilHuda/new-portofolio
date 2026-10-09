<script lang="ts">
  import { page } from "$app/stores";
  import type { LayoutData } from "./$types";
  import { enhance } from "$app/forms";

  export let data: LayoutData;

  let loggingOut = false;

  const nav = [
    { href: "/admin", label: "Dashboard", match: (p: string) => p === "/admin" },
    { href: "/admin/blogs", label: "Blogs", match: (p: string) => p.startsWith("/admin/blogs") },
    { href: "/admin/thoughts", label: "Celoteh", match: (p: string) => p.startsWith("/admin/thoughts") },
    { href: "/admin/now", label: "Now", match: (p: string) => p.startsWith("/admin/now") },
    { href: "/admin/projects", label: "Projects", match: (p: string) => p.startsWith("/admin/projects") },
    { href: "/admin/messages", label: "Pesan", match: (p: string) => p.startsWith("/admin/messages"), badge: true }
  ];

  $: isActive = (item: (typeof nav)[number]) => item.match($page.url.pathname);
  $: unreadCount = data?.unreadMessages || 0;
</script>

<svelte:head>
  <title>Admin Dashboard</title>
</svelte:head>

{#if $page.url.pathname === "/admin/login"}
  <slot />
{:else}
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-blue-500 selection:text-white">
    <header
      class="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 transition-colors"
    >
      <div class="max-w-6xl mx-auto px-3.5 sm:px-6">
        <!-- Baris atas: brand + status + aksi -->
        <div class="flex items-center justify-between h-14 sm:h-16 gap-3">
          <a
            href="/admin"
            class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white tracking-tight shrink-0 group"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-500/20 group-hover:scale-110 transition-transform"></span>
            <span class="text-base sm:text-lg">Admin<span class="text-gray-400 font-normal text-xs sm:text-sm"> / Moh.AbrorilHuda</span></span>
          </a>

          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Lihat situs (icon di mobile, icon+teks di desktop) -->
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Buka situs utama di tab baru"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span class="hidden sm:inline">Lihat situs</span>
            </a>

            {#if data.session}
              <span class="hidden md:inline text-xs text-gray-400 truncate max-w-[150px]" title={data.session.email}>
                {data.session.email}
              </span>
            {/if}

            <form
              method="POST"
              action="/admin/logout"
              use:enhance={() => {
                loggingOut = true;
                return async ({ update }) => {
                  await update();
                  loggingOut = false;
                };
              }}
            >
              <button
                disabled={loggingOut}
                class="text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                title="Keluar dari akun admin"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span class="hidden xs:inline">{loggingOut ? "..." : "Keluar"}</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Nav: Horizontal Scrollable Segmented Tabs with Touch Comfort -->
        <nav
          class="flex items-center gap-1 sm:gap-2 -mb-px overflow-x-auto pb-2 sm:pb-2.5 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Navigasi admin"
        >
          {#each nav as item}
            <a
              href={item.href}
              class="relative whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-md transition-all flex items-center gap-1.5 select-none
                {isActive(item)
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/80'}"
              aria-current={isActive(item) ? "page" : undefined}
            >
              <span>{item.label}</span>
              {#if item.badge && unreadCount > 0}
                <span
                  class="px-1.5 py-0.2 rounded-full text-[10px] font-bold {isActive(item)
                    ? 'bg-blue-500 text-white dark:bg-blue-600'
                    : 'bg-blue-600 text-white dark:bg-blue-500'}"
                >
                  {unreadCount}
                </span>
              {/if}
            </a>
          {/each}
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8">
      <slot />
    </main>
  </div>
{/if}
