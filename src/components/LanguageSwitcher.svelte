<script lang="ts">
  import { locale } from '$lib/stores/locale';
  
  function switchLanguage(newLocale: 'id' | 'en') {
    locale.set(newLocale);
  }
</script>

<!-- Desktop Version - Minimalist Segmented Pill -->
<div class="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 p-1 rounded-xl">
  <button
    on:click={() => switchLanguage('id')}
    class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer {$locale === 'id' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-xs border border-zinc-200/60 dark:border-zinc-600/60' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
    aria-label="Switch to Indonesian"
  >
    ID
  </button>
  <button
    on:click={() => switchLanguage('en')}
    class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer {$locale === 'en' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-xs border border-zinc-200/60 dark:border-zinc-600/60' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
    aria-label="Switch to English"
  >
    EN
  </button>
</div>

<!-- Mobile Version - Clean Segmented Switcher -->
<div class="md:hidden w-full">
  <div class="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/50 rounded-xl">
    <button
      on:click={() => switchLanguage('id')}
      class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer {$locale === 'id' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-xs border border-zinc-200/60 dark:border-zinc-600/60' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
    >
      Indonesian
    </button>
    <button
      on:click={() => switchLanguage('en')}
      class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer {$locale === 'en' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-xs border border-zinc-200/60 dark:border-zinc-600/60' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}"
    >
      English
    </button>
  </div>
</div>
