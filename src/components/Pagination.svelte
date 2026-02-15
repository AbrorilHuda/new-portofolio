<script lang="ts">
    export let currentPage: number = 1;
    export let totalPages: number = 1;
    export let onPageChange: (page: number) => void;

    $: pages = generatePageNumbers(currentPage, totalPages);

    function generatePageNumbers(
        current: number,
        total: number,
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
    class="flex items-center justify-center gap-2 mt-12"
    aria-label="Pagination"
>
    <!-- Previous Button -->
    <button
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
           hover:bg-gray-100 dark:hover:bg-gray-800
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all duration-200 font-medium"
        aria-label="Previous page"
    >
        ← Previous
    </button>

    <!-- Page Numbers -->
    <div class="hidden sm:flex items-center gap-2">
        {#each pages as page}
            {#if page === "..."}
                <span class="px-3 py-2 text-gray-500 dark:text-gray-400"
                    >...</span
                >
            {:else}
                <button
                    on:click={() => typeof page === "number" && goToPage(page)}
                    class="min-w-[40px] px-3 py-2 rounded-lg border transition-all duration-200 font-medium
                 {currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'}"
                    aria-label="Page {page}"
                    aria-current={currentPage === page ? "page" : undefined}
                >
                    {page}
                </button>
            {/if}
        {/each}
    </div>

    <!-- Mobile: Current Page Indicator -->
    <div
        class="sm:hidden px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
        Page {currentPage} of {totalPages}
    </div>

    <!-- Next Button -->
    <button
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
           hover:bg-gray-100 dark:hover:bg-gray-800
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all duration-200 font-medium"
        aria-label="Next page"
    >
        Next →
    </button>
</nav>
