<script lang="ts">
  import { locale } from '$lib/stores/locale';
  
  function switchLanguage(newLocale: 'id' | 'en') {
    locale.set(newLocale);
  }
</script>

<!-- Desktop Version - Minimalist -->
<div class="hidden md:flex items-center gap-1">
  <button
    on:click={() => switchLanguage('id')}
    class="px-2 py-1 text-sm font-medium transition-colors {$locale === 'id' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
    aria-label="Switch to Indonesian"
  >
    ID
  </button>
  <span class="text-gray-300 dark:text-gray-600">|</span>
  <button
    on:click={() => switchLanguage('en')}
    class="px-2 py-1 text-sm font-medium transition-colors {$locale === 'en' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
    aria-label="Switch to English"
  >
    EN
  </button>
</div>

<!-- Mobile Version - Full Width -->
<div class="md:hidden w-full">
  <div class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <button
      on:click={() => switchLanguage('id')}
      class="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all {$locale === 'id' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}"
    >
      Indonesian
    </button>
    <button
      on:click={() => switchLanguage('en')}
      class="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all {$locale === 'en' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}"
    >
      English
    </button>
  </div>
</div>
