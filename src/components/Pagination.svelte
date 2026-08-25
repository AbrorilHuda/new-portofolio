<script lang="ts">
  export let currentPage: number = 1;
  export let totalPages: number = 1;
  export let onPageChange: (page: number) => void;

  $: pages = generatePageNumbers(currentPage, totalPages);

  function generatePageNumbers(
    current: number,
    total: number
  ): (number | string)[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    // Show pages around current
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("...");
    }

    // Always show last page
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  }
</script>

<nav
  class="flex items-center justify-center gap-2 sm:gap-3 mt-12 py-4"
  aria-label="Pagination"
>
  <!-- Previous Button -->
  <button
    on:click={() => goToPage(currentPage - 1)}
    disabled={currentPage === 1}
    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
           bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 
           text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 
           hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5
           disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none"
    aria-label="Previous page"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    <span class="hidden sm:inline">Prev</span>
  </button>

  <!-- Page Numbers -->
  <div class="hidden sm:flex items-center gap-2">
    {#each pages as page}
      {#if page === "..."}
        <span class="w-10 h-10 flex items-center justify-center text-xs font-mono text-zinc-400 dark:text-zinc-500">
          •••
        </span>
      {:else}
        <button
          on:click={() => typeof page === "number" && goToPage(page)}
          class="w-10 h-10 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center
                 {currentPage === page
                   ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-105'
                   : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105'}"
          aria-label="Page {page}"
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      {/if}
    {/each}
  </div>

  <!-- Mobile: Current Page Indicator Pill -->
  <div
    class="sm:hidden px-3.5 py-2 rounded-xl border text-xs font-semibold bg-zinc-100/80 dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300"
  >
    {currentPage} / {totalPages}
  </div>

  <!-- Next Button -->
  <button
    on:click={() => goToPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
           bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80 
           text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 
           hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5
           disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none"
    aria-label="Next page"
  >
    <span class="hidden sm:inline">Next</span>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</nav>
