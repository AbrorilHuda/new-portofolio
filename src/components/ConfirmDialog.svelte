<script lang="ts">
    // Props
    export let open = false;
    export let title = "Konfirmasi Hapus";
    export let description = "Tindakan ini tidak dapat dibatalkan";
    export let message =
        "Apakah Anda yakin ingin menghapus item ini? Data akan hilang secara permanen.";
    export let confirmLabel = "Hapus";
    export let cancelLabel = "Batal";
    export let loading = false;

    // Events
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();
</script>

{#if open}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        on:click|self={() => !loading && dispatch("cancel")}
        on:keydown={(e) => e.key === "Escape" && !loading && dispatch("cancel")}
        tabindex="-1"
    >
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700"
        >
            <!-- Header -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                    <div
                        class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-6 h-6 text-red-600 dark:text-red-400"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3
                            id="confirm-dialog-title"
                            class="text-xl font-bold text-gray-900 dark:text-white"
                        >
                            {title}
                        </h3>
                        <p
                            class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        >
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Body -->
            <div class="p-6">
                <p class="text-gray-700 dark:text-gray-300">{message}</p>
            </div>

            <!-- Footer -->
            <div
                class="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl flex justify-end gap-3"
            >
                <button
                    type="button"
                    on:click={() => dispatch("cancel")}
                    disabled={loading}
                    class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    on:click={() => dispatch("confirm")}
                    disabled={loading}
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {#if loading}
                        <svg
                            class="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Menghapus...
                    {:else}
                        {confirmLabel}
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}
