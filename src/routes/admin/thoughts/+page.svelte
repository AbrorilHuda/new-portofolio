<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageData, ActionData } from "./$types";
    import { t } from "$lib/i18n";
    import { locale } from "$lib/stores/locale";
    import ConfirmDialog from "$lib/../components/ConfirmDialog.svelte";

    export let data: PageData;
    export let form: ActionData;

    let loading = false;
    let pendingDeleteId: string | null = null;

    let mentionState = {
        show: false,
        query: "",
        index: -1,
        thoughtId: null as any,
        activeInput: null as HTMLInputElement | null,
        filteredNames: [] as string[],
    };

    function handleReplyInput(e: Event, thoughtId: any, comments: any[]) {
        const target = e.target as HTMLInputElement;
        const val = target.value;
        const selStart = target.selectionStart || 0;
        const lastAt = val.lastIndexOf("@", selStart - 1);

        if (lastAt !== -1) {
            const query = val.substring(lastAt + 1, selStart);
            if (!query.includes("\n")) {
                const uniqueNames = [
                    ...new Set((comments || []).map((c) => c.name)),
                ];
                const filtered = uniqueNames.filter((name) =>
                    name.toLowerCase().includes(query.toLowerCase()),
                );

                mentionState = {
                    show: true,
                    query,
                    index: lastAt,
                    thoughtId,
                    activeInput: target,
                    filteredNames: filtered,
                };
                return;
            }
        }
        mentionState.show = false;
    }

    function selectReplyMention(name: string) {
        if (!mentionState.activeInput) return;
        const input = mentionState.activeInput;
        const val = input.value;
        const before = val.substring(0, mentionState.index);
        const after = val.substring(input.selectionStart || 0);

        input.value = `${before}@${name} ${after}`;
        mentionState.show = false;
        input.focus();
    }

    function getMentions(content: string, comments: any[]) {
        const uniqueNames = [...new Set((comments || []).map((c) => c.name))];
        let mentions: string[] = [];

        const escapeHtml = (unsafe: string) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };
        const escapedContent = escapeHtml(content);

        uniqueNames.forEach((name) => {
            const htmlEscapedName = escapeHtml(name);
            const regexSafeName = htmlEscapedName.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
            );
            const regex = new RegExp(`@${regexSafeName}\\b`, "gi");

            if (regex.test(escapedContent)) {
                mentions.push(name);
            }
        });
        return mentions;
    }

    function formatComment(content: string, comments: any[]) {
        // Get unique names from comments in this thread ONLY
        const uniqueNames = [...new Set((comments || []).map((c) => c.name))];

        const escapeHtml = (unsafe: string) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        // Escape HTML content
        const escapedContent = escapeHtml(content);

        let formatted = escapedContent;
        uniqueNames.forEach((name) => {
            // Escape nama agar cocok dengan content yang sudah di-escape HTML-nya
            // Misal: "it'sme" -> "it&#039;sme"
            const htmlEscapedName = escapeHtml(name);

            // Escape untuk regex (agar karakter seperti . * + ? tidak dianggap regex command)
            const regexSafeName = htmlEscapedName.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
            );

            // Ganti @Nama dengan span (Case Insensitive)
            const regex = new RegExp(`@${regexSafeName}\\b`, "gi");
            formatted = formatted.replace(regex, (match) => {
                return `<span class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">@${htmlEscapedName}</span>`;
            });
        });

        return formatted;
    }
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
                                    e.preventDefault();
                                    pendingDeleteId = thought.id;
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
                                class="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
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
                                    {@const mentions = getMentions(
                                        comment.content,
                                        thought.thought_comments,
                                    )}
                                    <div
                                        class="bg-white dark:bg-gray-800 p-3 rounded shadow-sm text-sm"
                                    >
                                        <div
                                            class="flex justify-between font-medium text-xs text-gray-500 mb-1"
                                        >
                                            <span
                                                class="flex items-center gap-1 {comment.name ===
                                                'Abroril Huda'
                                                    ? 'text-blue-600 font-bold'
                                                    : ''}"
                                            >
                                                {comment.name}
                                                {#if comment.name === "Abroril Huda"}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="w-3 h-3"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                                            clip-rule="evenodd"
                                                        />
                                                    </svg>
                                                {/if}
                                            </span>
                                            <span
                                                >{new Date(
                                                    comment.created_at,
                                                ).toLocaleString("id-ID")}</span
                                            >
                                        </div>

                                        {#if mentions.length > 0}
                                            <div
                                                class="text-xs text-gray-500 mb-1 flex flex-wrap gap-1 items-center"
                                            >
                                                <span>Membalas</span>
                                                {#each mentions as mentioned}
                                                    <span
                                                        class="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                                        >@{mentioned}</span
                                                    >
                                                {/each}
                                            </div>
                                        {/if}

                                        <p
                                            class="text-gray-800 dark:text-gray-200"
                                        >
                                            {@html formatComment(
                                                comment.content,
                                                thought.thought_comments,
                                            )}
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
                            <div class="flex-1 relative">
                                <input
                                    type="text"
                                    name="content"
                                    placeholder="Balas komentar... (@user untuk tag)"
                                    required
                                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    on:input={(e) =>
                                        handleReplyInput(
                                            e,
                                            thought.id,
                                            thought.thought_comments,
                                        )}
                                />
                                {#if mentionState.show && mentionState.thoughtId === thought.id && mentionState.filteredNames.length > 0}
                                    <div
                                        class="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg max-h-32 overflow-y-auto z-10"
                                    >
                                        {#each mentionState.filteredNames as name}
                                            <button
                                                type="button"
                                                class="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 text-xs text-gray-700 dark:text-gray-200"
                                                on:click={() =>
                                                    selectReplyMention(name)}
                                            >
                                                {name}
                                            </button>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
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

<!-- Hidden delete form for thoughts -->
<form
    id="thought-delete-form"
    method="POST"
    action="?/delete"
    use:enhance
    class="hidden"
>
    <input type="hidden" name="id" value={pendingDeleteId ?? ""} />
</form>

<ConfirmDialog
    open={pendingDeleteId !== null}
    message="Yakin ingin menghapus postingan ini? Semua data akan hilang secara permanen."
    on:confirm={() => {
        const f = document.getElementById(
            "thought-delete-form",
        ) as HTMLFormElement;
        f?.requestSubmit();
        pendingDeleteId = null;
    }}
    on:cancel={() => (pendingDeleteId = null)}
/>
