<script lang="ts">
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
  import { enhance } from '$app/forms';

  export let data: LayoutData;
</script>

<svelte:head>
  <title>Admin Dashboard</title>
</svelte:head>

{#if $page.url.pathname === '/admin/login'}
  <slot />
{:else}
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
    <!-- Professional Navbar -->
    <nav class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <a href="/admin" class="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Admin Dashboard
            </a>
            <div class="hidden md:flex space-x-1">
              <a 
                href="/admin" 
                class="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all {$page.url.pathname === '/admin' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : ''}"
              >
                Dashboard
              </a>
              <a 
                href="/admin/blogs" 
                class="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all {$page.url.pathname.startsWith('/admin/blogs') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : ''}"
              >
                Blogs
              </a>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <a href="/" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">View Site</a>
            {#if data.session}
              <span class="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">{data.session.email}</span>
            {/if}
            <form method="POST" action="/admin/logout" use:enhance>
              <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
{/if}