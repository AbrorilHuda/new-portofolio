<script lang="ts">
    import { onMount } from "svelte";
    import { supabase, type FeedbackMessage } from "$lib/supabase/supabase";
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";

    import { invalidateAll } from "$app/navigation";

    export let data: PageData;

    let messages: FeedbackMessage[] = [];
    let loading = false;
    let error = data.error || "";
    let filter: "all" | "unread" | "contact_form" | "quick_feedback" = "all";
    let searchQuery = "";
    let selectedMessage: FeedbackMessage | null = null;
    let showDeleteConfirm = false;
    let messageToDelete: string | null = null;
    let deleteError = "";

    // Reactive statement will handle initial assignment

    async function markAsRead(messageId: string) {
        try {
            const response = await fetch("/admin/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageId, field: "read", value: true }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to mark as read");
            }

            // Reload data from server
            await invalidateAll();
        } catch (err: any) {
            console.error("Error marking as read:", err);
        }
    }

    async function toggleReplied(messageId: string, currentStatus: boolean) {
        try {
            const response = await fetch("/admin/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId,
                    field: "replied",
                    value: !currentStatus,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to toggle replied");
            }

            // Reload data from server
            await invalidateAll();
        } catch (err: any) {
            console.error("Error toggling replied:", err);
        }
    }

    function confirmDelete(messageId: string) {
        messageToDelete = messageId;
        showDeleteConfirm = true;
        deleteError = "";
    }

    async function deleteMessage() {
        if (!messageToDelete) return;

        try {
            const response = await fetch("/admin/messages", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageId: messageToDelete }),
            });

            const data = await response.json();

            if (!response.ok) {
                deleteError = `Failed to delete: ${data.error}`;
                return;
            }

            selectedMessage = null;
            showDeleteConfirm = false;
            messageToDelete = null;
            deleteError = "";

            // Reload data from server
            await invalidateAll();
        } catch (err: any) {
            console.error("Error deleting message:", err);
            deleteError = err.message || "Failed to delete message";
        }
    }

    function openMessage(message: FeedbackMessage) {
        selectedMessage = message;
        // Auto mark as read when opening
        if (!message.read) {
            markAsRead(message.id);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString();
    }

    // Filter messages from server data based on current filter
    $: {
        let filtered = data.messages || [];

        if (filter === "unread") {
            filtered = filtered.filter((m: FeedbackMessage) => !m.read);
        } else if (filter === "contact_form" || filter === "quick_feedback") {
            filtered = filtered.filter(
                (m: FeedbackMessage) => m.type === filter,
            );
        }

        messages = filtered;
    }

    $: filteredMessages = messages.filter((msg) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            msg.name.toLowerCase().includes(query) ||
            msg.message.toLowerCase().includes(query) ||
            (msg.email && msg.email.toLowerCase().includes(query))
        );
    });

    $: unreadCount = (data.messages || []).filter(
        (m: FeedbackMessage) => !m.read,
    ).length;
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1
                        class="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                        Messages & Feedback
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">
                        {messages.length} total messages
                        {#if unreadCount > 0}
                            <span
                                class="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                            >
                                {unreadCount} unread
                            </span>
                        {/if}
                    </p>
                </div>
                <button
                    on:click={() => goto("/admin")}
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                    Back
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-3 mb-4">
                <button
                    on:click={() => (filter = "all")}
                    class="px-4 py-2 rounded-lg font-medium transition-colors {filter ===
                    'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    All
                </button>
                <button
                    on:click={() => (filter = "unread")}
                    class="px-4 py-2 rounded-lg font-medium transition-colors {filter ===
                    'unread'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    Unread
                </button>
                <button
                    on:click={() => (filter = "contact_form")}
                    class="px-4 py-2 rounded-lg font-medium transition-colors {filter ===
                    'contact_form'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    Contact Form
                </button>
                <button
                    on:click={() => (filter = "quick_feedback")}
                    class="px-4 py-2 rounded-lg font-medium transition-colors {filter ===
                    'quick_feedback'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    Quick Feedback
                </button>
            </div>

            <!-- Search -->
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search messages..."
                class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white"
            />
        </div>

        <!-- Messages List -->
        {#if loading}
            <div class="flex items-center justify-center py-12">
                <svg
                    class="animate-spin h-8 w-8 text-blue-600"
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
            </div>
        {:else if error}
            <div
                class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400"
            >
                {error}
            </div>
        {:else if filteredMessages.length === 0}
            <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <svg
                    class="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <p class="text-gray-600 dark:text-gray-400">
                    No messages found
                </p>
            </div>
        {:else}
            <div class="grid md:grid-cols-2 gap-4">
                {#each filteredMessages as message (message.id)}
                    <button
                        on:click={() => openMessage(message)}
                        class="text-left p-4 bg-white dark:bg-gray-800 rounded-lg border-2 transition-all hover:border-blue-500 {selectedMessage?.id ===
                        message.id
                            ? 'border-blue-500'
                            : 'border-transparent'} {!message.read
                            ? 'bg-blue-50 dark:bg-blue-900/10'
                            : ''}"
                    >
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-lg">
                                    {message.type === "contact_form"
                                        ? "📧"
                                        : "💬"}
                                </span>
                                <div>
                                    <h3
                                        class="font-semibold text-gray-900 dark:text-white"
                                    >
                                        {message.name}
                                    </h3>
                                    {#if message.email}
                                        <p
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {message.email}
                                        </p>
                                    {/if}
                                </div>
                            </div>
                            {#if !message.read}
                                <span class="w-2 h-2 bg-blue-600 rounded-full"
                                ></span>
                            {/if}
                        </div>
                        <p
                            class="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-2"
                        >
                            {message.message}
                        </p>
                        <div
                            class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
                        >
                            <span>{formatDate(message.created_at)}</span>
                            {#if message.replied}
                                <span
                                    class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded"
                                    >Replied</span
                                >
                            {/if}
                        </div>
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

<!-- Message Detail Modal -->
{#if selectedMessage}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        on:click={() => (selectedMessage = null)}
        role="button"
        tabindex="-1"
    >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            on:click|stopPropagation
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabindex="0"
        >
            <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h2
                            id="modal-title"
                            class="text-2xl font-bold text-gray-900 dark:text-white mb-1"
                        >
                            {selectedMessage.name}
                        </h2>
                        {#if selectedMessage.email}
                            <a
                                href="mailto:{selectedMessage.email}"
                                class="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {selectedMessage.email}
                            </a>
                        {/if}
                    </div>
                    <button
                        on:click={() => (selectedMessage = null)}
                        class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        aria-label="Close modal"
                    >
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div class="mb-4">
                    <span
                        class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                        {selectedMessage.type === "contact_form"
                            ? "📧 Contact Form"
                            : "💬 Quick Feedback"}
                    </span>
                    <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(selectedMessage.created_at)}
                    </span>
                </div>

                <div class="mb-6">
                    <h3
                        class="font-semibold text-gray-900 dark:text-white mb-2"
                    >
                        Message:
                    </h3>
                    <p
                        class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    >
                        {selectedMessage.message}
                    </p>
                </div>

                {#if selectedMessage.page_url}
                    <div class="mb-6">
                        <h3
                            class="font-semibold text-gray-900 dark:text-white mb-2"
                        >
                            Page URL:
                        </h3>
                        <a
                            href={selectedMessage.page_url}
                            target="_blank"
                            class="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                        >
                            {selectedMessage.page_url}
                        </a>
                    </div>
                {/if}

                <div class="flex gap-3">
                    <button
                        on:click={() => {
                            if (selectedMessage) {
                                toggleReplied(
                                    selectedMessage.id,
                                    selectedMessage.replied,
                                );
                            }
                        }}
                        class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {selectedMessage?.replied
                            ? "Mark as Not Replied"
                            : "Mark as Replied"}
                    </button>
                    <button
                        on:click={() => {
                            if (selectedMessage) {
                                confirmDelete(selectedMessage.id);
                            }
                        }}
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Delete Confirmation Dialog -->
{#if showDeleteConfirm}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        on:click={() => {
            showDeleteConfirm = false;
            messageToDelete = null;
        }}
        role="button"
        tabindex="-1"
    >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
            on:click|stopPropagation
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            tabindex="0"
        >
            <div class="flex items-center gap-3 mb-4">
                <div
                    class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
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
                        id="delete-dialog-title"
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                        Delete Message
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        This action cannot be undone
                    </p>
                </div>
            </div>

            <p class="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this message? This will
                permanently remove it from the database.
            </p>

            {#if deleteError}
                <div
                    class="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg"
                >
                    <p class="text-sm text-red-700 dark:text-red-400">
                        {deleteError}
                    </p>
                </div>
            {/if}

            <div class="flex gap-3">
                <button
                    on:click={() => {
                        showDeleteConfirm = false;
                        messageToDelete = null;
                        deleteError = "";
                    }}
                    class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    on:click={deleteMessage}
                    class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}
