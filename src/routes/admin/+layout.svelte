<script lang="ts">
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';
   import { enhance } from '$app/forms';
  import "../../app.css"

  export let data: LayoutData;

</script>

{#if $page.url.pathname === '/admin/login'}
  <slot />
{:else}
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <a href="/admin" class="text-xl font-bold">Admin Dashboard</a>
            <div class="hidden md:flex space-x-4">
              <a 
                href="/admin" 
                class="px-3 py-2 rounded-md {$page.url.pathname === '/admin' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
              >
                Dashboard
              </a>
              <a 
                href="/admin/blogs" 
                class="px-3 py-2 rounded-md {$page.url.pathname.startsWith('/admin/blogs') ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
              >
                Blogs
              </a>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <a href="/" class="text-sm hover:underline">View Site</a>
            {#if data.session }
              <span class="text-sm text-gray-600 dark:text-gray-400">{data.session.email}</span>
            {/if}
            <form method="POST" action="/admin/logout" use:enhance>
               <button 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
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