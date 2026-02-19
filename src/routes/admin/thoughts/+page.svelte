<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageData, ActionData } from "./$types";
    import { t } from "$lib/i18n";
    import { locale } from "$lib/stores/locale";

    export let data: PageData;
    export let form: ActionData;

    let loading = false;
</script>

<div class="max-w-4xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold mb-2">Celoteh (Thoughts)</h1>
            <p class="text-gray-600 dark:text-gray-400">
                Bagikan pemikiran singkat Anda
            </p>
        </div>
    </div>

    {#if form?.error}
        <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
            {form.error}
        </div>
    {/if}

    <!-- Create Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form
            method="POST"
            action="?/create"
            use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    await update();
                    loading = false;
                };
            }}
            class="space-y-4"
        >
            <div>
                <label for="content" class="block text-sm font-medium mb-2">
                    Apa yang sedang Anda pikirkan?
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 resize-none"
                    placeholder="Tulis sesuatu..."
                ></textarea>
            </div>

            <div>
                <label for="image_url" class="block text-sm font-medium mb-2">
                    Gambar URL (Opsional)
                </label>
                <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="is_public"
                        name="is_public"
                        type="checkbox"
                        checked
                        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label for="is_public" class="ml-2 text-sm font-medium">
                        Public
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 transition-colors"
                >
                    {loading ? "Memposting..." : "Post"}
                </button>
            </div>
        </form>
    </div>

    <!-- List of Thoughts -->
    <div class="space-y-4">
        <h2 class="text-xl font-bold">Riwayat Celoteh</h2>

        {#if data.thoughts.length === 0}
            <div class="text-center py-8 text-gray-500">
                Belum ada celoteh. Mulai tulis sekarang!
            </div>
        {:else}
            {#each data.thoughts as thought (thought.id)}
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all hover:shadow-md"
                >
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-sm text-gray-500">
                            {new Date(thought.created_at).toLocaleString(
                                "id-ID",
                                {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                },
                            )}
                            {#if !thought.is_public}
                                <span
                                    class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                    >Private</span
                                >
                            {/if}
                        </div>

                        <form
                            method="POST"
                            action="?/delete"
                            use:enhance={() => {
                                return async ({ update }) => {
                                    await update();
                                };
                            }}
                        >
                            <input type="hidden" name="id" value={thought.id} />
                            <button
                                type="submit"
                                class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Hapus"
                                on:click={(e) => {
                                    if (
                                        !confirm(
                                            "Yakin ingin menghapus postingan ini?",
                                        )
                                    ) {
                                        e.preventDefault();
                                        e.stopPropagation();
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
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>

                    <p
                        class="whitespace-pre-wrap text-gray-800 dark:text-gray-200 mb-4"
                    >
                        {thought.content}
                    </p>

                    {#if thought.images && thought.images.length > 0}
                        <div class="mb-4">
                            {#each thought.images as image}
                                <img
                                    src={image}
                                    alt="Attachment"
                                    class="rounded-lg max-h-64 object-cover"
                                    loading="lazy"
                                />
                            {/each}
                        </div>
                    {/if}

                    <div
                        class="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-3 mt-2"
                    >
                        <div class="flex gap-4">
                            <div class="flex items-center gap-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-4 h-4"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                    />
                                </svg>
                                <span>{thought.likes_count || 0} Likes</span>
                            </div>
                            <button
                                class="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                on:click={() => {
                                    const el = document.getElementById(
                                        `comments-${thought.id}`,
                                    );
                                    if (el) el.classList.toggle("hidden");
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-4 h-4"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                    />
                                </svg>
                                <span
                                    >{thought.thought_comments?.length || 0} Comments</span
                                >
                            </button>
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <div
                        id="comments-{thought.id}"
                        class="hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 -mx-6 -mb-6 p-6 rounded-b-lg"
                    >
                        <div class="space-y-4 mb-4">
                            {#if thought.thought_comments && thought.thought_comments.length > 0}
                                {#each thought.thought_comments as comment}
                                    <div
                                        class="bg-white dark:bg-gray-800 p-3 rounded shadow-sm text-sm"
                                    >
                                        <div
                                            class="flex justify-between font-medium text-xs text-gray-500 mb-1"
                                        >
                                            <span
                                                class={comment.name ===
                                                "Abroril Huda"
                                                    ? "text-blue-600 font-bold"
                                                    : ""}>{comment.name}</span
                                            >
                                            <span
                                                >{new Date(
                                                    comment.created_at,
                                                ).toLocaleString("id-ID")}</span
                                            >
                                        </div>
                                        <p
                                            class="text-gray-800 dark:text-gray-200"
                                        >
                                            {comment.content}
                                        </p>
                                    </div>
                                {/each}
                            {:else}
                                <p class="text-xs text-gray-500 italic">
                                    Belum ada komentar.
                                </p>
                            {/if}
                        </div>

                        <!-- Reply Form -->
                        <form
                            method="POST"
                            action="?/reply"
                            class="flex gap-2"
                            use:enhance
                        >
                            <input type="hidden" name="id" value={thought.id} />
                            <input
                                type="text"
                                name="content"
                                placeholder="Balas komentar..."
                                required
                                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <button
                                type="submit"
                                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
