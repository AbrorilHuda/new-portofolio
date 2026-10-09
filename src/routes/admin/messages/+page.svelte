<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import type { FeedbackMessage } from "$lib/supabase/supabase";
  import type { PageData } from "./$types";
  import ConfirmDialog from "$lib/../components/ConfirmDialog.svelte";

  export let data: PageData;

  $: messages = (data.messages ?? []) as FeedbackMessage[];

  type Filter = "all" | "unread" | "replied" | "contact_form" | "quick_feedback";
  let filter: Filter = "all";

  const filters: [Filter, string][] = [
    ["all", "Semua"],
    ["unread", "Belum Dibaca"],
    ["replied", "Sudah Dibalas"],
    ["contact_form", "Contact Form"],
    ["quick_feedback", "Quick Feedback"],
  ];

  let searchQuery = "";
  let selectedMessage: FeedbackMessage | null = null;
  let pendingDeleteId: string | null = null;
  let deleting = false;
  let actionLoading = false;
  let errorMessage = data.error || "";

  $: unreadCount = messages.filter((m) => !m.read).length;
  $: repliedCount = messages.filter((m) => m.replied).length;
  $: contactCount = messages.filter((m) => m.type === "contact_form").length;
  $: quickCount = messages.filter((m) => m.type === "quick_feedback").length;

  $: filteredMessages = messages.filter((msg) => {
    if (filter === "unread" && msg.read) return false;
    if (filter === "replied" && !msg.replied) return false;
    if (filter === "contact_form" && msg.type !== "contact_form") return false;
    if (filter === "quick_feedback" && msg.type !== "quick_feedback") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.name?.toLowerCase().includes(q);
      const matchMsg = msg.message?.toLowerCase().includes(q);
      const matchEmail = msg.email?.toLowerCase().includes(q);
      const matchUrl = msg.page_url?.toLowerCase().includes(q);
      return matchName || matchMsg || matchEmail || matchUrl;
    }
    return true;
  });

  async function markAsRead(messageId: string) {
    try {
      actionLoading = true;
      const res = await fetch("/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, field: "read", value: true }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menandai telah dibaca");
      }

      await invalidateAll();
    } catch (err: any) {
      console.error("Error markAsRead:", err);
      errorMessage = err.message;
    } finally {
      actionLoading = false;
    }
  }

  async function toggleReplied(messageId: string, currentStatus: boolean) {
    try {
      actionLoading = true;
      const res = await fetch("/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          field: "replied",
          value: !currentStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengubah status balasan");
      }

      if (selectedMessage && selectedMessage.id === messageId) {
        selectedMessage = { ...selectedMessage, replied: !currentStatus };
      }

      await invalidateAll();
    } catch (err: any) {
      console.error("Error toggleReplied:", err);
      errorMessage = err.message;
    } finally {
      actionLoading = false;
    }
  }

  async function deleteMessage() {
    if (!pendingDeleteId) return;

    try {
      deleting = true;
      const res = await fetch("/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: pendingDeleteId }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Gagal menghapus pesan");
      }

      if (selectedMessage?.id === pendingDeleteId) {
        selectedMessage = null;
      }

      pendingDeleteId = null;
      await invalidateAll();
    } catch (err: any) {
      console.error("Error deleteMessage:", err);
      errorMessage = err.message;
    } finally {
      deleting = false;
    }
  }

  function openMessage(message: FeedbackMessage) {
    selectedMessage = message;
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

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getInitials(name: string) {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
</script>

<div class="max-w-6xl mx-auto space-y-5 sm:space-y-6 pb-20 sm:pb-12 min-w-0 max-w-full">
  <!-- Top Command Bar & Statistics Header -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
    <div>
      <div class="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
        <span>Admin</span>
        <span>/</span>
        <span class="text-blue-600 dark:text-blue-400">Pesan</span>
      </div>
      <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Pesan & Feedback
      </h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
        Kelola pesan formulir kontak dan feedback dari pengunjung situs
      </p>
    </div>

    <!-- Metric Badges -->
    <div class="flex items-center gap-2 flex-wrap self-start sm:self-center">
      <span class="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-zinc-200/60 dark:border-zinc-700/60">
        {messages.length} Total
      </span>
      <span class="px-2.5 py-1 rounded-xl text-xs font-bold border {unreadCount > 0 ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-extrabold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700/60'}">
        {unreadCount} Belum Dibaca
      </span>
      <span class="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
        {repliedCount} Dibalas
      </span>
    </div>
  </div>

  <!-- Form Alert Feedback -->
  {#if errorMessage}
    <div class="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2.5">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{errorMessage}</span>
      </div>
      <button type="button" on:click={() => (errorMessage = "")} class="text-xs font-bold hover:underline">
        ✕
      </button>
    </div>
  {/if}

  <!-- Search & Filter Controls Toolbar -->
  <div class="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs space-y-3">
    <!-- Search Bar -->
    <div class="relative w-full">
      <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari nama pengirim, isi pesan, email, atau URL..."
        class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      {#if searchQuery}
        <button
          type="button"
          aria-label="Hapus pencarian"
          on:click={() => (searchQuery = "")}
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
        >
          ✕
        </button>
      {/if}
    </div>

    <!-- Filter Pills (Touch Scrollable) -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {#each filters as [value, label]}
        <button
          type="button"
          on:click={() => (filter = value)}
          class="whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 {filter === value
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
            : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}"
        >
          <span>{label}</span>
          {#if value === "unread" && unreadCount > 0}
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold {filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}">
              {unreadCount}
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Messages List -->
  {#if filteredMessages.length === 0}
    <div class="text-center py-16 px-4 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 text-xs sm:text-sm">
      <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p class="font-bold text-zinc-700 dark:text-zinc-300">Tidak ada pesan yang ditemukan.</p>
      <p class="text-zinc-400 text-xs mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
      {#each filteredMessages as message (message.id)}
        <div
          class="rounded-2xl sm:rounded-3xl border transition-all text-left flex flex-col justify-between overflow-hidden shadow-xs hover:border-blue-500/50 hover:shadow-md backdrop-blur-xl group {selectedMessage?.id === message.id
            ? 'border-blue-500 bg-white dark:bg-zinc-900 ring-2 ring-blue-500/20'
            : !message.read
              ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/30 dark:border-blue-500/20'
              : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800/80'}"
        >
          <!-- Card Header & Sender -->
          <div class="p-4 sm:p-5 flex-1 cursor-pointer" on:click={() => openMessage(message)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openMessage(message)}>
            <div class="flex items-start justify-between gap-3 mb-2.5">
              <div class="flex items-center gap-2.5 min-w-0">
                <!-- Avatar Initials -->
                <div class="w-9 h-9 rounded-full bg-gradient-to-tr {message.type === 'contact_form' ? 'from-indigo-600 to-blue-600' : 'from-purple-600 to-pink-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {getInitials(message.name)}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <h3 class="font-bold text-sm text-zinc-900 dark:text-white truncate">
                      {message.name}
                    </h3>
                    {#if !message.read}
                      <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 animate-pulse" title="Belum dibaca"></span>
                    {/if}
                  </div>
                  {#if message.email}
                    <p class="text-[11px] text-zinc-400 truncate font-mono">
                      {message.email}
                    </p>
                  {/if}
                </div>
              </div>

              <!-- Date -->
              <span class="text-[10px] font-mono text-zinc-400 shrink-0">
                {formatDate(message.created_at)}
              </span>
            </div>

            <!-- Badges Row -->
            <div class="flex items-center gap-1.5 flex-wrap mb-2.5">
              <!-- Type Badge -->
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border {message.type === 'contact_form' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'}">
                {message.type === 'contact_form' ? '📧 Kontak' : '💬 Feedback'}
              </span>

              <!-- Status Replied -->
              {#if message.replied}
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ✓ Dibalas
                </span>
              {:else}
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  ○ Menunggu
                </span>
              {/if}
            </div>

            <!-- Message Snippet -->
            <p class="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
              {message.message}
            </p>
          </div>

          <!-- Card Actions Footer -->
          <div class="px-4 py-2.5 sm:px-5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 flex items-center justify-between gap-2">
            <button
              type="button"
              on:click={() => openMessage(message)}
              class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 py-1 cursor-pointer"
            >
              <span>Baca Detail</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div class="flex items-center gap-1.5">
              <!-- Quick Toggle Replied Button -->
              <button
                type="button"
                on:click={() => toggleReplied(message.id, message.replied)}
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer {message.replied ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'}"
                title={message.replied ? 'Tandai belum dibalas' : 'Tandai sudah dibalas'}
              >
                {message.replied ? 'Batal Balas' : 'Tandai Balas'}
              </button>

              <!-- Quick Delete Button -->
              <button
                type="button"
                on:click={() => (pendingDeleteId = message.id)}
                class="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                title="Hapus Pesan"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Message Detail Modal / Bottom Sheet on Mobile -->
{#if selectedMessage}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center sm:p-4 transition-all"
    on:click={() => (selectedMessage = null)}
    role="button"
    tabindex="-1"
    on:keydown={(e) => e.key === 'Escape' && (selectedMessage = null)}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-7 space-y-5"
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
      tabindex="0"
    >
      <!-- Mobile Drag Handle Bar -->
      <div class="sm:hidden w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-1 mb-2"></div>

      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr {selectedMessage.type === 'contact_form' ? 'from-indigo-600 to-blue-600' : 'from-purple-600 to-pink-600'} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
            {getInitials(selectedMessage.name)}
          </div>
          <div class="min-w-0">
            <h2 class="text-base sm:text-xl font-bold text-zinc-900 dark:text-white truncate">
              {selectedMessage.name}
            </h2>
            {#if selectedMessage.email}
              <a
                href="mailto:{selectedMessage.email}"
                class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono truncate block"
              >
                {selectedMessage.email}
              </a>
            {/if}
          </div>
        </div>

        <button
          type="button"
          on:click={() => (selectedMessage = null)}
          class="p-2 -mr-1 -mt-1 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Tutup modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Badges & Timestamp -->
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold border border-zinc-200/60 dark:border-zinc-700/60">
            {selectedMessage.type === "contact_form" ? "📧 Contact Form" : "💬 Quick Feedback"}
          </span>
          {#if selectedMessage.replied}
            <span class="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/20">
              ✓ Sudah Dibalas
            </span>
          {:else}
            <span class="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-500/20">
              ○ Menunggu Tindakan
            </span>
          {/if}
        </div>
        <span class="text-xs text-zinc-400 font-mono">
          {new Date(selectedMessage.created_at).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      <!-- Message Content -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Isi Pesan:
        </h4>
        <div class="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] select-text">
          {selectedMessage.message}
        </div>
      </div>

      <!-- Page URL (if provided) -->
      {#if selectedMessage.page_url}
        <div class="space-y-1.5 min-w-0 max-w-full">
          <h4 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Halaman Asal Feedback:
          </h4>
          <a
            href={selectedMessage.page_url}
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 font-mono min-w-0 max-w-full"
            title={selectedMessage.page_url}
          >
            <svg class="w-4 h-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span class="truncate min-w-0 flex-1">{selectedMessage.page_url}</span>
          </a>
        </div>
      {/if}

      <!-- Modal Action Buttons -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        {#if selectedMessage.email}
          <a
            href="mailto:{selectedMessage.email}?subject=Balasan%20Pesan%20dari%20Abroril%20Huda"
            class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Balas via Email</span>
          </a>
        {/if}

        <div class="flex items-center gap-2 justify-end">
          <button
            type="button"
            on:click={() => {
              if (selectedMessage) {
                toggleReplied(selectedMessage.id, selectedMessage.replied);
              }
            }}
            class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer {selectedMessage.replied
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}"
          >
            <span>{selectedMessage.replied ? 'Batalkan Dibalas' : '✓ Tandai Dibalas'}</span>
          </button>

          <button
            type="button"
            on:click={() => {
              if (selectedMessage) {
                pendingDeleteId = selectedMessage.id;
              }
            }}
            class="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Confirmation Dialog for Delete -->
<ConfirmDialog
  open={pendingDeleteId !== null}
  message="Apakah Anda yakin ingin menghapus pesan ini? Data akan dihapus secara permanen dari basis data."
  loading={deleting}
  on:confirm={deleteMessage}
  on:cancel={() => (pendingDeleteId = null)}
/>
