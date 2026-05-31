<script lang="ts">
  import { locale } from '$lib/stores/locale';
  
  function switchLanguage(newLocale: 'id' | 'en') {
    locale.set(newLocale);
  }
</script>

<!-- Desktop Version - Minimalist -->
<div class="hidden md:flex items-center gap-1.5 bg-gray-100/80 dark:bg-zinc-900/60 border border-gray-200/30 dark:border-white/5 p-1 rounded-lg">
  <button
    on:click={() => switchLanguage('id')}
    class="px-2 py-0.5 text-xs font-semibold rounded-md transition-all {$locale === 'id' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}"
    aria-label="Switch to Indonesian"
  >
    ID
  </button>
  <button
    on:click={() => switchLanguage('en')}
    class="px-2 py-0.5 text-xs font-semibold rounded-md transition-all {$locale === 'en' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}"
    aria-label="Switch to English"
  >
    EN
  </button>
</div>

<!-- Mobile Version - Full Width -->
<div class="md:hidden w-full">
  <div class="flex items-center gap-1.5 p-1 bg-gray-200/40 dark:bg-zinc-950/40 border border-gray-250/20 dark:border-white/5 rounded-xl">
    <button
      on:click={() => switchLanguage('id')}
      class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 {$locale === 'id' ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs border border-gray-200/40 dark:border-white/5' : 'text-gray-500 dark:text-gray-400'}"
    >
      Indonesian
    </button>
    <button
      on:click={() => switchLanguage('en')}
      class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 {$locale === 'en' ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs border border-gray-200/40 dark:border-white/5' : 'text-gray-500 dark:text-gray-400'}"
    >
      English
    </button>
  </div>
</div>
