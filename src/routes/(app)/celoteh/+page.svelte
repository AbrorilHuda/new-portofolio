<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageData } from "./$types";
    import { t } from "$lib/i18n";
    import { locale } from "$lib/stores/locale";

    export let data: PageData;

    // Optimistic UI for likes
    let localLikes: Record<string, number> = {};
    let likedThoughts: Set<string> = new Set();
</script>

<svelte:head>
    <title>Celoteh - Moh.AbrorilHuda</title>
    <meta
        name="description"
        content="Kumpulan pemikiran singkat (Celoteh) dari Moh.AbrorilHuda."
    />
</svelte:head>

<div class="container mx-auto px-4 pt-32 pb-12 max-w-2xl">
    <div class="text-center mb-12">
        <h1
            class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
            Celoteh
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
            Sekadar pemikiran, ide, dan catatan singkat sehari-hari.
        </p>
    </div>

    <div class="space-y-6">
        {#if data.thoughts.length === 0}
            <div
                class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl"
            >
                <p class="text-gray-500">
                    Belum ada celoteh. Kembali lagi nanti!
                </p>
            </div>
        {:else}
            {#each data.thoughts as thought (thought.id)}
                <article
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm"
                            >
                                AH
                            </div>
                            <div>
                                <h3
                                    class="font-bold text-gray-900 dark:text-gray-100"
                                >
                                    Abroril Huda
                                </h3>
                                <span class="text-xs text-gray-500">
                                    {new Date(
                                        thought.created_at,
                                    ).toLocaleString("id-ID", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="mb-4">
                        <p
                            class="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-lg leading-relaxed"
                        >
                            {thought.content}
                        </p>
                        {#if thought.images && thought.images.length > 0}
                            <div
                                class="mt-4 grid gap-2 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                {#each thought.images as image}
                                    <img
                                        src={image}
                                        alt="Content"
                                        class="w-full h-auto max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-500"
                                        loading="lazy"
                                    />
                                {/each}
                            </div>
                        {/if}
                    </div>

                    <!-- Actions -->
                    <div
                        class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-2"
                    >
                        <div class="flex items-center gap-6">
                            <!-- Comment Button (Link to Detail) -->
                            <a
                                href="/celoteh/{thought.id}"
                                class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group"
                                aria-label="Lihat komentar"
                            >
                                <div
                                    class="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-5 h-5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                        />
                                    </svg>
                                </div>
                                <span class="text-sm font-medium"
                                    >{thought.comments_count || 0}</span
                                >
                            </a>

                            <!-- Like Button -->
                            <form
                                method="POST"
                                action="?/like"
                                use:enhance={() => {
                                    // Optimistic update
                                    if (!likedThoughts.has(thought.id)) {
                                        localLikes[thought.id] =
                                            (localLikes[thought.id] ||
                                                thought.likes_count) + 1;
                                        likedThoughts.add(thought.id);
                                    }
                                    return async ({ update }) => {
                                        await update({ reset: false });
                                    };
                                }}
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={thought.id}
                                />
                                <button
                                    type="submit"
                                    disabled={likedThoughts.has(thought.id)}
                                    class="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group {likedThoughts.has(
                                        thought.id,
                                    )
                                        ? 'text-red-500'
                                        : ''}"
                                    aria-label="Suka"
                                >
                                    <div
                                        class="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill={likedThoughts.has(thought.id)
                                                ? "currentColor"
                                                : "none"}
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-5 h-5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium">
                                        {localLikes[thought.id] !== undefined
                                            ? localLikes[thought.id]
                                            : thought.likes_count || 0}
                                    </span>
                                </button>
                            </form>
                        </div>

                        <!-- Share Button -->
                        <button
                            type="button"
                            aria-label="Bagikan"
                            class="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            on:click={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: "Celoteh Abroril Huda",
                                        text: thought.content,
                                        url: `${window.location.origin}/celoteh/${thought.id}`,
                                    });
                                } else {
                                    navigator.clipboard.writeText(
                                        `${window.location.origin}/celoteh/${thought.id}`,
                                    );
                                    alert("Link copied to clipboard!");
                                }
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                                />
                            </svg>
                        </button>
                    </div>
                </article>
            {/each}
        {/if}
    </div>
</div>
