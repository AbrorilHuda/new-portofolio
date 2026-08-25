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
    { href: "/admin/projects", label: "Projects", match: (p: string) => p.startsWith("/admin/projects") }
  ];

  $: isActive = (item: (typeof nav)[number]) => item.match($page.url.pathname);
</script>

<svelte:head>
  <title>Admin Dashboard</title>
</svelte:head>

{#if $page.url.pathname === "/admin/login"}
  <slot />
{:else}
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header
      class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <!-- Baris atas: brand + aksi -->
        <div class="flex items-center justify-between h-14">
          <a
            href="/admin"
            class="font-semibold text-gray-900 dark:text-white tracking-tight"
          >
            Admin<span class="text-gray-400 font-normal"> / Moh.AbrorilHuda</span>
          </a>

          <div class="flex items-center gap-3 sm:gap-5">
            <a
              href="/"
              class="hidden sm:inline text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Lihat situs ↗
            </a>
            {#if data.session}
              <span class="hidden md:inline text-sm text-gray-400 truncate max-w-[180px]">
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
                class="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loggingOut ? "Keluar..." : "Keluar"}
              </button>
            </form>
          </div>
        </div>

        <!-- Nav: underline tabs, scrollable di mobile -->
        <nav class="flex gap-1 -mb-px overflow-x-auto" aria-label="Navigasi admin">
          {#each nav as item}
            <a
              href={item.href}
              class="whitespace-nowrap px-3 py-2.5 text-sm border-b-2 transition-colors
                {isActive(item)
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white font-medium'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
              aria-current={isActive(item) ? "page" : undefined}
            >
              {item.label}
            </a>
          {/each}
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <slot />
    </main>
  </div>
{/if}
