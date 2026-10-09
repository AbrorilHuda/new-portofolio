<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import ConfirmDialog from "$lib/../components/ConfirmDialog.svelte";

  export let data: PageData;
  export let form: ActionData;

  let loading = false;
  let pendingDeleteId: string | null = null;
  let newContent = "";
  let imageUrl = "";
  let isPublic = true;
  let showImageField = false;

  let searchQuery = "";
  let filterStatus: "all" | "public" | "private" = "all";
  let expandedComments: Record<string, boolean> = {};

  let mentionState = {
    show: false,
    query: "",
    index: -1,
    thoughtId: null as any,
    activeInput: null as HTMLInputElement | null,
    filteredNames: [] as string[],
  };

  $: publicCount = (data.thoughts as any[]).filter((t: any) => t.is_public).length;
  $: privateCount = (data.thoughts as any[]).filter((t: any) => !t.is_public).length;

  $: filteredThoughts = (data.thoughts as any[]).filter((t: any) => {
    const matchesSearch =
      !searchQuery ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "public"
          ? t.is_public
          : !t.is_public;
    return matchesSearch && matchesStatus;
  });

  function toggleComments(id: string) {
    expandedComments[id] = !expandedComments[id];
    expandedComments = { ...expandedComments };
  }

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
    const uniqueNames = [...new Set((comments || []).map((c) => c.name))];

    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const escapedContent = escapeHtml(content);

    let formatted = escapedContent;
    uniqueNames.forEach((name) => {
      const htmlEscapedName = escapeHtml(name);
      const regexSafeName = htmlEscapedName.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      const regex = new RegExp(`@${regexSafeName}\\b`, "gi");
      formatted = formatted.replace(regex, () => {
        return `<span class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">@${htmlEscapedName}</span>`;
      });
    });

    return formatted;
  }
</script>

<div class="max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-20 sm:pb-12">
  <!-- Top Command Bar & Statistics Header -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
    <div>
      <div class="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
        <span>Admin</span>
        <span>/</span>
        <span class="text-blue-600 dark:text-blue-400">Celoteh</span>
      </div>
      <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Celoteh & Pemikiran
      </h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
        Catatan pendek dan update cepat untuk pengunjung situs
      </p>
    </div>

    <!-- Metric Badges -->
    <div class="flex items-center gap-2 self-start sm:self-center">
      <span class="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-zinc-200/60 dark:border-zinc-700/60">
        {data.thoughts.length} Total
      </span>
      <span class="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
        {publicCount} Publik
      </span>
      <span class="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
        {privateCount} Privat
      </span>
    </div>
  </div>

  {#if form?.error}
    <div class="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Modern Compose Card (Threads / X Style) -->
  <div class="rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-lg p-4 sm:p-6 transition-all">
    <form
      method="POST"
      action="?/create"
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          await update();
          loading = false;
          newContent = "";
          imageUrl = "";
          showImageField = false;
        };
      }}
      class="space-y-3.5"
    >
      <!-- Author row & Public toggle -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            AH
          </div>
          <div>
            <div class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Abroril Huda</div>
            <div class="text-[10px] text-zinc-400">Admin</div>
          </div>
        </div>

        <!-- Interactive Public / Private switch -->
        <div class="flex items-center">
          <input type="hidden" name="is_public" value={isPublic ? "on" : "off"} />
          <button
            type="button"
            on:click={() => (isPublic = !isPublic)}
            class="px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer {isPublic ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'}"
          >
            <span>{isPublic ? '● Publik' : '○ Privat'}</span>
            <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Textarea Input -->
      <div>
        <textarea
          id="content"
          name="content"
          required
          rows="3"
          bind:value={newContent}
          class="w-full px-3.5 py-3 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm sm:text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          placeholder="Apa yang sedang Anda pikirkan? Tulis di sini..."
        ></textarea>
      </div>

      <!-- Collapsible Image URL Input -->
      {#if showImageField}
        <div class="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Lampirkan URL Gambar</span>
            <button
              type="button"
              on:click={() => { showImageField = false; imageUrl = ''; }}
              class="text-zinc-400 hover:text-red-500 text-[11px]"
            >
              Batal
            </button>
          </div>
          <input
            id="image_url"
            name="image_url"
            type="url"
            bind:value={imageUrl}
            class="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="https://example.com/gambar.jpg"
          />

          {#if imageUrl}
            <div class="relative w-full aspect-video max-h-48 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
              <img src={imageUrl} alt="Preview Attachment" class="w-full h-full object-cover" />
            </div>
          {/if}
        </div>
      {/if}

      <!-- Compose Footer: Media Attach Button + Submit Button -->
      <div class="flex items-center justify-between pt-1">
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            on:click={() => (showImageField = !showImageField)}
            class="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Tambah Gambar"
          >
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="hidden sm:inline">Foto / Gambar</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !newContent.trim()}
          class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {#if loading}
            <svg class="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memposting...</span>
          {:else}
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            <span>Posting</span>
          {/if}
        </button>
      </div>
    </form>
  </div>

  <!-- Search & Filter Controls -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl">
    <div class="relative flex-1">
      <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari dalam celoteh..."
        class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      {#if searchQuery}
        <button
          type="button"
          aria-label="Hapus pencarian"
          on:click={() => (searchQuery = '')}
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          ✕
        </button>
      {/if}
    </div>

    <!-- Filter Pills -->
    <div class="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl shrink-0 self-start sm:self-center">
      <button
        type="button"
        on:click={() => (filterStatus = 'all')}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {filterStatus === 'all' ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
      >
        Semua
      </button>
      <button
        type="button"
        on:click={() => (filterStatus = 'public')}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {filterStatus === 'public' ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
      >
        Publik
      </button>
      <button
        type="button"
        on:click={() => (filterStatus = 'private')}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {filterStatus === 'private' ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
      >
        Privat
      </button>
    </div>
  </div>

  <!-- Feed List -->
  <div class="space-y-4">
    {#if filteredThoughts.length === 0}
      <div class="text-center py-12 px-4 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 text-xs sm:text-sm">
        <p class="font-medium">Tidak ada celoteh yang cocok dengan kriteria pencarian.</p>
        <p class="text-zinc-400 text-xs mt-1">Gunakan kotak di atas untuk membuat celoteh baru.</p>
      </div>
    {:else}
      {#each filteredThoughts as thought (thought.id)}
        <div class="rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          
          <!-- Post Header -->
          <div class="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                AH
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">Abroril Huda</span>
                  <!-- Public/Private badge -->
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border {thought.is_public ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}">
                    {thought.is_public ? '● Publik' : '○ Privat'}
                  </span>
                </div>
                <div class="text-[11px] text-zinc-400 font-medium">
                  {new Date(thought.created_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </div>

            <!-- Delete Action with touch target -->
            <button
              type="button"
              class="p-2 -mr-1 -mt-1 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              title="Hapus Celoteh"
              on:click={() => (pendingDeleteId = thought.id)}
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>

          <!-- Post Content -->
          <div class="px-4 sm:px-5 pb-3">
            <p class="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 break-words">
              {thought.content}
            </p>

            <!-- Attachment Images -->
            {#if thought.images && thought.images.length > 0}
              <div class="mt-3.5 space-y-2">
                {#each thought.images as image}
                  <a href={image} target="_blank" rel="noopener noreferrer" class="block group relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-80 bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={image}
                      alt="Attachment"
                      class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span class="px-3 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
                        Lihat Gambar Penuh
                      </span>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Post Engagement Row -->
          <div class="px-4 sm:px-5 py-3 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/30 flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <div class="flex items-center gap-4">
              <!-- Likes Indicator -->
              <div class="flex items-center gap-1.5 text-zinc-500">
                <svg class="w-4 h-4 text-rose-500 fill-rose-500/20" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span>{thought.likes_count || 0} Suka</span>
              </div>

              <!-- Comments Toggle Button -->
              <button
                type="button"
                on:click={() => toggleComments(thought.id)}
                class="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <span>{thought.thought_comments?.length || 0} Komentar</span>
                <svg class="w-3.5 h-3.5 transition-transform {expandedComments[thought.id] ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Expandable Comments Thread Section -->
          {#if expandedComments[thought.id]}
            <div class="p-3.5 sm:p-5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-950/70 space-y-3.5">
              
              <!-- Existing comments list -->
              <div class="space-y-2.5">
                {#if thought.thought_comments && thought.thought_comments.length > 0}
                  {#each thought.thought_comments as comment}
                    {@const mentions = getMentions(comment.content, thought.thought_comments)}
                    <div class="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs space-y-1.5 text-xs">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5 font-bold {comment.name === 'Abroril Huda' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-200'}">
                          <span>{comment.name}</span>
                          {#if comment.name === "Abroril Huda"}
                            <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                            </svg>
                          {/if}
                        </div>
                        <span class="text-[10px] text-zinc-400">
                          {new Date(comment.created_at).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </span>
                      </div>

                      {#if mentions.length > 0}
                        <div class="text-[11px] text-zinc-400 flex flex-wrap gap-1 items-center">
                          <span>Membalas</span>
                          {#each mentions as mentioned}
                            <span class="text-blue-600 dark:text-blue-400 font-semibold">@{mentioned}</span>
                          {/each}
                        </div>
                      {/if}

                      <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                        {@html formatComment(comment.content, thought.thought_comments)}
                      </p>
                    </div>
                  {/each}
                {:else}
                  <p class="text-xs text-zinc-400 italic text-center py-2">
                    Belum ada komentar untuk celoteh ini.
                  </p>
                {/if}
              </div>

              <!-- Reply Form -->
              <form
                method="POST"
                action="?/reply"
                use:enhance
                class="flex items-center gap-2 relative pt-1"
              >
                <input type="hidden" name="id" value={thought.id} />
                <div class="flex-1 relative">
                  <input
                    type="text"
                    name="content"
                    placeholder="Tulis balasan... (@nama untuk tag)"
                    required
                    class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    on:input={(e) =>
                      handleReplyInput(
                        e,
                        thought.id,
                        thought.thought_comments,
                      )}
                  />

                  <!-- Mentions autocomplete popup -->
                  {#if mentionState.show && mentionState.thoughtId === thought.id && mentionState.filteredNames.length > 0}
                    <div class="absolute bottom-full left-0 mb-1.5 w-full max-w-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-36 overflow-y-auto z-20">
                      {#each mentionState.filteredNames as name}
                        <button
                          type="button"
                          class="w-full text-left px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                          on:click={() => selectReplyMention(name)}
                        >
                          <span class="text-blue-500">@</span>
                          <span>{name}</span>
                        </button>
                      {/each}
                    </div>
                  {/if}
                </div>

                <button
                  type="submit"
                  class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Kirim</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>

            </div>
          {/if}

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
  message="Yakin ingin menghapus celoteh ini? Semua riwayat komentar di dalamnya juga akan terhapus secara permanen."
  on:confirm={() => {
    const f = document.getElementById("thought-delete-form") as HTMLFormElement;
    f?.requestSubmit();
    pendingDeleteId = null;
  }}
  on:cancel={() => (pendingDeleteId = null)}
/>
