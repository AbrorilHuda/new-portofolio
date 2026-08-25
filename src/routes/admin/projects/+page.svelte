<script lang="ts">
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { PUBLIC_UPLOADCARE_PUBLIC_KEY } from "$env/static/public";
    import ConfirmDialog from "$lib/../components/ConfirmDialog.svelte";

    type Project = {
        id: number;
        title: string;
        description: string;
        image: string;
        technologies: string[];
        link: string;
        created_at: string;
    };

    export let data;
    export let form;

    $: projects = data.projects as Project[];

    let editingItem: Project | null = null;
    let showCreateForm = false;
    let pendingDeleteId: number | null = null;
    let deleteForm: HTMLFormElement;

    let image = "";
    let submittingProject = false;

    // Uploadcare File Uploader v1 (web components) via CDN, Regular mode
    const UC_JS = "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-inline.min.js";
    const UC_CSS = "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-regular.min.css";

    let ucReady = false;

    onMount(async () => {
        if (!window.customElements.get("uc-config")) {
            const UC = await import(/* @vite-ignore */ UC_JS);
            UC.defineComponents(UC);
        }
        ucReady = true;
    });

    // ponytail: ambil hasil upload dari ctx provider, simpan URL CDN ke state `image`
    function handleUploadSuccess(e: Event) {
        const detail = (e as CustomEvent).detail;
        if (!detail?.uuid) return;
        image = detail.cdnUrl || `https://${PUBLIC_UPLOADCARE_PUBLIC_KEY}.ucarecd.net/${detail.uuid}/`;
    }

    function startCreate() {
        editingItem = null;
        showCreateForm = true;
        image = "";
    }

    function startEdit(item: Project) {
        editingItem = { ...item };
        showCreateForm = false;
        image = item.image;
    }

    function cancelForm() {
        showCreateForm = false;
        editingItem = null;
        image = "";
    }
</script>

<svelte:head>
    <link rel="stylesheet" href={UC_CSS} />
</svelte:head>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">My Projects</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{projects.length} project · tampil di halaman depan</p>
        </div>
        <button
            on:click={() => (showCreateForm ? cancelForm() : startCreate())}
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-sm self-start sm:self-auto"
        >
            {showCreateForm ? "Batal" : "+ Project Baru"}
        </button>
    </div>

    {#if form?.error}
        <div class="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800 text-sm">
            {form.error}
        </div>
    {/if}
    {#if form?.success}
        <div class="px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800 text-sm">
            Berhasil disimpan!
        </div>
    {/if}

    <!-- Form create/edit -->
    {#if showCreateForm || editingItem}
        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                {editingItem ? "Edit Project" : "Project Baru"}
            </h2>

            <form
                method="POST"
                action={editingItem ? "?/update" : "?/create"}
                use:enhance={() => {
                    submittingProject = true;
                    return async ({ update }) => {
                        await update();
                        invalidateAll();
                        submittingProject = false;
                        cancelForm();
                    };
                }}
                class="space-y-4"
            >
                {#if editingItem}
                    <input type="hidden" name="id" value={editingItem.id} />
                {/if}
                <input type="hidden" name="image" value={image} />

                <div class="grid lg:grid-cols-[1fr_280px] gap-6">
                    <!-- Kolom kiri: detail -->
                    <div class="space-y-4 min-w-0">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="f_title">Judul *</label>
                            <input
                                id="f_title"
                                name="title"
                                required
                                value={editingItem?.title ?? ""}
                                placeholder="Nama project"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="f_desc">Deskripsi</label>
                            <textarea
                                id="f_desc"
                                name="description"
                                rows="3"
                                value={editingItem?.description ?? ""}
                                placeholder="Satu-dua kalimat tentang project ini"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            ></textarea>
                        </div>

                        <div class="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="f_tech">Teknologi</label>
                                <input
                                    id="f_tech"
                                    name="technologies"
                                    value={editingItem?.technologies.join(", ") ?? ""}
                                    placeholder="Next.js, Tailwind, ..."
                                    class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p class="text-xs text-gray-400 mt-1">Pisahkan dengan koma</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="f_link">Link</label>
                                <input
                                    id="f_link"
                                    name="link"
                                    type="url"
                                    value={editingItem?.link ?? ""}
                                    placeholder="https://..."
                                    class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Kolom kanan: gambar (Uploadcare File Uploader v1, Regular mode) -->
                    <div>
                        <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar *</span>

                        {#if image}
                            <div class="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative group">
                                <img src={image} alt="Preview gambar project" class="aspect-video w-full object-cover bg-gray-100 dark:bg-gray-800" />
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        on:click={() => (image = "")}
                                        class="px-3 py-1.5 bg-white text-gray-900 rounded-md text-xs font-medium"
                                    >
                                        Ganti gambar
                                    </button>
                                </div>
                            </div>
                        {:else if ucReady}
                            <uc-config
                                ctx-name="project-uploader"
                                pubkey={PUBLIC_UPLOADCARE_PUBLIC_KEY}
                                source-list="local, camera, gdrive, facebook"
                                files-view-mode="grid"
                                userAgentIntegration="svelte-admin"
                            >
                            </uc-config>

                            <!-- Hasil upload -->
                            <uc-upload-ctx-provider
                                ctx-name="project-uploader"
                                on:file-upload-success={handleUploadSuccess}
                            ></uc-upload-ctx-provider>

                            <uc-file-uploader-regular
                                ctx-name="project-uploader"
                                class="uc-light uc-purple block"
                            >
                            </uc-file-uploader-regular>
                        {/if}
                    </div>
                </div>

                <div class="flex gap-3 pt-2 flex-wrap border-t border-gray-200 dark:border-gray-800">
                    <button
                        type="submit"
                        disabled={!image || submittingProject}
                        class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center gap-2"
                    >
                        {#if submittingProject}
                            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Menyimpan...</span>
                        {:else}
                            <span>{editingItem ? "Simpan Perubahan" : "Tambah Project"}</span>
                        {/if}
                    </button>
                    <button
                        type="button"
                        on:click={cancelForm}
                        class="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md font-medium transition-colors text-sm mt-4"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    {/if}

    <!-- Daftar project -->
    {#if projects.length === 0}
        <div class="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
            Belum ada project. Klik "+ Project Baru" untuk menambah.
        </div>
    {:else}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each projects as item (item.id)}
                <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                    <img src={item.image} alt={item.title} class="aspect-video w-full object-cover" loading="lazy" />
                    <div class="p-4 flex-1 flex flex-col gap-2">
                        <div class="flex items-start justify-between gap-2">
                            <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                                {item.title}
                            </h3>
                            <span class="text-xs text-gray-400 shrink-0">{new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">{item.description}</p>
                        {#if item.technologies.length > 0}
                            <div class="flex flex-wrap gap-1">
                                {#each item.technologies.slice(0, 3) as tech}
                                    <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded text-[11px]">{tech}</span>
                                {/each}
                            </div>
                        {/if}
                        <div class="flex gap-2 pt-2 mt-auto">
                            <a
                                href={item.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex-1 text-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Lihat
                            </a>
                            <button
                                on:click={() => startEdit(item)}
                                class="flex-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                on:click={() => (pendingDeleteId = item.id)}
                                class="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-md transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<form
    method="POST"
    action="?/delete"
    use:enhance
    class="hidden"
    bind:this={deleteForm}
>
    <input type="hidden" name="id" value={pendingDeleteId ?? ""} />
</form>

<ConfirmDialog
    open={pendingDeleteId !== null}
    message="Yakin ingin menghapus project ini? Data akan hilang secara permanen."
    on:confirm={() => {
        deleteForm.requestSubmit();
        pendingDeleteId = null;
    }}
    on:cancel={() => (pendingDeleteId = null)}
/>
