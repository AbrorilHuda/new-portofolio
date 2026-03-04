<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageData, ActionData } from "./$types";
    import type { NowItem } from "$lib/supabase/supabase";
    import ConfirmDialog from "$lib/../components/ConfirmDialog.svelte";

    export let data: PageData;
    export let form: ActionData;

    $: nowItems = data.nowItems as NowItem[];

    let editingItem: NowItem | null = null;
    let showCreateForm = false;
    let pendingDeleteItem: NowItem | null = null;
    let deleteForm: HTMLFormElement;
    let deleting = false;
    let saving = false;
    let updating = false;

    function startEdit(item: NowItem) {
        editingItem = { ...item };
        showCreateForm = false;
    }

    function cancelEdit() {
        editingItem = null;
    }

    function tasksToText(tasks: string[]): string {
        return tasks.join("\n");
    }

    const priorityConfig = {
        high: {
            label: "High",
            color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
        medium: {
            label: "Medium",
            color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        },
        low: {
            label: "Low",
            color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        },
    };

    const statusConfig = {
        active: {
            label: "Active",
            color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        },
        completed: {
            label: "Completed",
            color: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
        },
    };
</script>

<div class="space-y-8">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Now — Focus Items
            </h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
                Manage what appears on the public <a
                    href="/now"
                    target="_blank"
                    class="text-blue-500 hover:underline">/now</a
                > page.
            </p>
        </div>
        <button
            on:click={() => {
                showCreateForm = !showCreateForm;
                editingItem = null;
            }}
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
            {showCreateForm ? "Cancel" : "+ Add Item"}
        </button>
    </div>

    <!-- Form feedback -->
    {#if form?.error}
        <div
            class="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 text-sm"
        >
            {form.error}
        </div>
    {/if}
    {#if form?.success}
        <div
            class="px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 text-sm"
        >
            Saved successfully!
        </div>
    {/if}

    <!-- ── Create Form ── -->
    {#if showCreateForm}
        <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
            <h2
                class="text-lg font-semibold text-gray-900 dark:text-white mb-5"
            >
                New Item
            </h2>
            <form
                method="POST"
                action="?/create"
                use:enhance={() => {
                    saving = true;
                    return async ({ update }) => {
                        await update();
                        saving = false;
                        showCreateForm = false;
                    };
                }}
                class="space-y-4"
            >
                <div class="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            for="create_name">Project Name *</label
                        >
                        <input
                            id="create_name"
                            name="project_name"
                            type="text"
                            required
                            placeholder="Mobile Apps"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            for="create_github">GitHub URL *</label
                        >
                        <input
                            id="create_github"
                            name="github_url"
                            type="url"
                            required
                            value="https://"
                            placeholder="https://github.com/abrorilhuda/..."
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <!-- Priority + Status row -->
                <div class="grid sm:grid-cols-3 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            for="create_priority">Priority</label
                        >
                        <select
                            id="create_priority"
                            name="priority"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="high">🔴 High</option>
                            <option value="medium" selected>🟡 Medium</option>
                            <option value="low">🔵 Low</option>
                        </select>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            for="create_status">Status</label
                        >
                        <select
                            id="create_status"
                            name="status"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="active" selected>Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            for="create_order">Sort Order</label
                        >
                        <input
                            id="create_order"
                            name="sort_order"
                            type="number"
                            value="0"
                            min="0"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        for="create_tasks"
                    >
                        Tasks <span class="text-gray-400 font-normal"
                            >(one per line)</span
                        >
                    </label>
                    <textarea
                        id="create_tasks"
                        name="tasks"
                        rows="4"
                        placeholder="Redesign navigation UI&#10;Implement dark mode&#10;Fix performance issues"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y font-mono"
                    ></textarea>
                </div>

                <div class="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {#if saving}
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
                            Saving...
                        {:else}
                            Save
                        {/if}
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        on:click={() => (showCreateForm = false)}
                        class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all text-sm disabled:opacity-60"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    {/if}

    <!-- ── Items list ── -->
    {#if nowItems.length === 0}
        <div class="text-center py-16 text-gray-400 dark:text-gray-500">
            <p class="text-lg">No items yet.</p>
            <p class="text-sm mt-1">Click "Add Item" to get started.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each nowItems as item}
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 {item.status ===
                    'completed'
                        ? 'opacity-70'
                        : ''}"
                >
                    {#if editingItem?.id === item.id}
                        <!-- Edit form -->
                        <form
                            method="POST"
                            action="?/update"
                            use:enhance={() => {
                                updating = true;
                                return async ({ update }) => {
                                    await update();
                                    updating = false;
                                    editingItem = null;
                                };
                            }}
                            class="space-y-4"
                        >
                            <input type="hidden" name="id" value={item.id} />
                            <div class="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        for="edit_name_{item.id}"
                                        >Project Name *</label
                                    >
                                    <input
                                        id="edit_name_{item.id}"
                                        name="project_name"
                                        type="text"
                                        required
                                        bind:value={editingItem.project_name}
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        for="edit_github_{item.id}"
                                        >GitHub URL *</label
                                    >
                                    <input
                                        id="edit_github_{item.id}"
                                        name="github_url"
                                        type="url"
                                        required
                                        bind:value={editingItem.github_url}
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <!-- Priority + Status row -->
                            <div class="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        for="edit_priority_{item.id}"
                                        >Priority</label
                                    >
                                    <select
                                        id="edit_priority_{item.id}"
                                        name="priority"
                                        bind:value={editingItem.priority}
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="high">🔴 High</option>
                                        <option value="medium">🟡 Medium</option
                                        >
                                        <option value="low">🔵 Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        for="edit_status_{item.id}"
                                        >Status</label
                                    >
                                    <select
                                        id="edit_status_{item.id}"
                                        name="status"
                                        bind:value={editingItem.status}
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed"
                                            >Completed</option
                                        >
                                    </select>
                                </div>
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        for="edit_order_{item.id}"
                                        >Sort Order</label
                                    >
                                    <input
                                        id="edit_order_{item.id}"
                                        name="sort_order"
                                        type="number"
                                        bind:value={editingItem.sort_order}
                                        min="0"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    for="edit_tasks_{item.id}"
                                >
                                    Tasks <span
                                        class="text-gray-400 font-normal"
                                        >(one per line)</span
                                    >
                                </label>
                                <textarea
                                    id="edit_tasks_{item.id}"
                                    name="tasks"
                                    rows="4"
                                    value={tasksToText(editingItem.tasks)}
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y font-mono"
                                ></textarea>
                            </div>

                            <div class="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {#if updating}
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
                                        Updating...
                                    {:else}
                                        Update
                                    {/if}
                                </button>
                                <button
                                    type="button"
                                    disabled={updating}
                                    on:click={cancelEdit}
                                    class="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all text-sm disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    {:else}
                        <!-- Display mode -->
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1 min-w-0">
                                <div
                                    class="flex items-center gap-2 flex-wrap mb-2"
                                >
                                    <h3
                                        class="font-semibold text-gray-900 dark:text-white"
                                    >
                                        {item.project_name}
                                    </h3>
                                    <!-- Priority badge -->
                                    <span
                                        class="text-xs font-medium px-2 py-0.5 rounded-full {priorityConfig[
                                            item.priority ?? 'medium'
                                        ].color}"
                                    >
                                        {priorityConfig[
                                            item.priority ?? "medium"
                                        ].label}
                                    </span>
                                    <!-- Status badge -->
                                    <span
                                        class="text-xs font-medium px-2 py-0.5 rounded-full {statusConfig[
                                            item.status ?? 'active'
                                        ].color}"
                                    >
                                        {statusConfig[item.status ?? "active"]
                                            .label}
                                    </span>
                                    <span
                                        class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded"
                                        >#{item.sort_order}</span
                                    >
                                </div>
                                <a
                                    href={item.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-sm text-blue-500 hover:underline truncate block mb-3"
                                >
                                    {item.github_url}
                                </a>
                                {#if item.tasks.length > 0}
                                    <ul class="space-y-1">
                                        {#each item.tasks as task}
                                            <li
                                                class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                <span
                                                    class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
                                                ></span>
                                                {task}
                                            </li>
                                        {/each}
                                    </ul>
                                {:else}
                                    <p class="text-sm text-gray-400 italic">
                                        No tasks listed.
                                    </p>
                                {/if}
                            </div>

                            <div class="flex gap-2 shrink-0">
                                <button
                                    on:click={() => startEdit(item)}
                                    class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    on:click={() => (pendingDeleteItem = item)}
                                    class="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Hidden delete form, submitted programmatically -->
<form
    method="POST"
    action="?/delete"
    use:enhance
    class="hidden"
    bind:this={deleteForm}
>
    <input type="hidden" name="id" value={pendingDeleteItem?.id ?? ""} />
</form>

<ConfirmDialog
    open={pendingDeleteItem !== null}
    message="Apakah Anda yakin ingin menghapus item ini? Data akan hilang secara permanen."
    loading={deleting}
    on:confirm={() => {
        deleting = true;
        deleteForm.requestSubmit();
        pendingDeleteItem = null;
        deleting = false;
    }}
    on:cancel={() => (pendingDeleteItem = null)}
/>
