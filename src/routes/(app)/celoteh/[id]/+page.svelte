<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageData } from "./$types";
    import { MetaTags } from "svelte-meta-tags";

    export let data: PageData;

    let commenting = false;
    let liked = false;
    let likesCount = data.thought.likes_count;
    let showCommentModal = false;
</script>

<div class="container mx-auto px-4 pt-32 pb-12 max-w-2xl">
    <div class="flex items-center justify-between mb-8">
        <a
            href="/celoteh"
            class="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4 mr-2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
            </svg>
            Kembali ke Celoteh
        </a>
    </div>

    <!-- The Thought -->
    <article
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-8"
    >
        <div class="flex items-center gap-3 mb-6">
            <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
            >
                AH
            </div>
            <div>
                <h1 class="font-bold text-xl text-gray-900 dark:text-gray-100">
                    Abroril Huda
                </h1>
                <span class="text-gray-500">
                    {new Date(data.thought.created_at).toLocaleString("id-ID", {
                        dateStyle: "long",
                        timeStyle: "short",
                    })}
                </span>
            </div>
        </div>

        <div class="mb-6">
            <p
                class="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-xl leading-relaxed"
            >
                {data.thought.content}
            </p>
            {#if data.thought.images && data.thought.images.length > 0}
                <div
                    class="mt-6 grid gap-4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    {#each data.thought.images as image}
                        <img
                            src={image}
                            alt="Content"
                            class="w-full h-auto rounded-lg shadow-sm"
                        />
                    {/each}
                </div>
            {/if}
        </div>

        <div
            class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6"
        >
            <div class="flex gap-6">
                <form
                    method="POST"
                    action="?/like"
                    use:enhance={() => {
                        if (!liked) {
                            likesCount++;
                            liked = true;
                        }
                        return async ({ update }) => {
                            await update({ reset: false });
                        };
                    }}
                >
                    <button
                        class="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors {liked
                            ? 'text-red-500'
                            : ''}"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={liked ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                        </svg>
                        <span class="font-medium text-lg">{likesCount}</span>
                    </button>
                </form>

                <div class="flex items-center gap-2 text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                    </svg>
                    <span class="font-medium text-lg"
                        >{data.comments.length}</span
                    >
                </div>
            </div>

            <button
                on:click={() => (showCommentModal = true)}
                class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
                Tulis Komentar
            </button>
        </div>
    </article>

    <!-- Comment Modal -->
    {#if showCommentModal}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            on:click|self={() => (showCommentModal = false)}
        >
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl transform transition-all scale-100 relative"
            >
                <button
                    on:click={() => (showCommentModal = false)}
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Tutup"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h3
                    class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100"
                >
                    Komentar
                </h3>

                <form
                    method="POST"
                    action="?/comment"
                    use:enhance={() => {
                        commenting = true;
                        return async ({ update }) => {
                            await update();
                            commenting = false;
                            showCommentModal = false; // Close modal on success
                        };
                    }}
                    class="space-y-4"
                >
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                            >Nama</label
                        >
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                            placeholder="Nama kamu"
                        />
                    </div>
                    <div>
                        <label
                            for="content"
                            class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                            >Komentar</label
                        >
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows="4"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow resize-none"
                            placeholder="Tulis pendapatmu..."
                        ></textarea>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            on:click={() => (showCommentModal = false)}
                            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={commenting}
                            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {commenting ? "Mengirim..." : "Kirim"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <!-- Comments List -->
    <div class="space-y-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            Komentar ({data.comments.length})
        </h3>

        {#if data.comments.length === 0}
            <p class="text-gray-500 italic">
                Belum ada komentar. Jadilah yang pertama!
            </p>
        {:else}
            {#each data.comments as comment (comment.id)}
                <div
                    class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-gray-900 dark:text-gray-100"
                            >{comment.name}</span
                        >
                        <span class="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString(
                                "id-ID",
                                { dateStyle: "medium", timeStyle: "short" },
                            )}
                        </span>
                    </div>
                    <p
                        class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    >
                        {comment.content}
                    </p>
                </div>
            {/each}
        {/if}
    </div>
</div>
