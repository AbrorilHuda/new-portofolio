<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { supabase } from "$lib/supabase/supabase";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData & {
      isAdmin?: boolean;
      user?: any;
    };
  }
  let { data }: Props = $props();

  // Local state for messages & UI
  let messages = $state<any[]>([]);
  let currentUsername = $state("");
  let inputMessage = $state("");
  let isEditingName = $state(false);
  let tempUsername = $state("");
  let chatContainer: HTMLElement | null = $state(null);
  let isSending = $state(false);
  let notificationToast = $state<{
    show: boolean;
    text: string;
    type: "success" | "error";
  }>({
    show: false,
    text: "",
    type: "success",
  });

  // Sync messages from server data
  $effect(() => {
    if (data.messages) {
      messages = [...data.messages];
      scrollToBottom();
    }
  });

  // Premium colors palette for guest usernames
  const premiumColors = [
    "#3b82f6", // Blue
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
    "#a855f7", // Purple
  ];

  function getUsernameColor(name: string): string {
    if (name === "Abrorilhuda") return "#3b82f6";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % premiumColors.length;
    return premiumColors[index];
  }

  function generateGuestName(): string {
    const prefixes = [
      "Cyber",
      "Pixel",
      "Code",
      "Byte",
      "Echo",
      "Nova",
      "Astro",
      "Dev",
    ];
    const nouns = [
      "Explorer",
      "Coder",
      "Builder",
      "Guest",
      "Creator",
      "Hacker",
      "Maker",
      "Innovator",
    ];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const n = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${p}${n}-${num}`;
  }

  function showToast(text: string, type: "success" | "error" = "success") {
    notificationToast = { show: true, text, type };
    setTimeout(() => {
      notificationToast.show = false;
    }, 3000);
  }

  async function scrollToBottom(behavior: ScrollBehavior = "smooth") {
    await tick();
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior,
      });
    }
  }

  const reservedUsernames = [
    "abrorilhuda",
    "abror",
    "admin",
    "owner",
    "moderator",
  ];

  onMount(() => {
    // If logged in as admin, automatically use owner handle
    if (data.isAdmin) {
      currentUsername = "Abrorilhuda";
      localStorage.setItem("lounge_username", "Abrorilhuda");
    } else {
      const savedName = localStorage.getItem("lounge_username");
      if (
        savedName &&
        !reservedUsernames.includes(savedName.trim().toLowerCase())
      ) {
        currentUsername = savedName;
      } else {
        const defaultName = generateGuestName();
        currentUsername = defaultName;
        localStorage.setItem("lounge_username", defaultName);
      }
    }
    tempUsername = currentUsername;

    // Subscribe to Supabase Postgres Realtime changes
    const channel = supabase
      .channel("lounge-realtime-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMsg = payload.new;
            const exists = messages.find(
              (m) => m.id === newMsg.id || m.tempId === newMsg.id,
            );
            if (!exists) {
              messages = [...messages, newMsg];
              scrollToBottom();
            }
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old?.id;
            if (oldId) {
              messages = messages.filter((m) => m.id !== oldId);
            } else {
              messages = [];
            }
          }
        },
      )
      .subscribe();

    scrollToBottom("auto");

    return () => {
      supabase.removeChannel(channel);
    };
  });

  async function sendMessage(e: Event) {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const messageText = inputMessage.trim();
    inputMessage = "";
    isSending = true;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      tempId: tempId,
      username: currentUsername,
      message: messageText,
      created_at: new Date().toISOString(),
      status: "sending",
    };

    messages = [...messages, optimisticMessage];
    scrollToBottom();

    try {
      const response = await fetch("/api/lounge/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUsername,
          message: messageText,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mengirim pesan");
      }

      messages = messages.map((m) => {
        if (m.tempId === tempId) {
          return {
            ...m,
            id: result.data.id,
            status: "delivered",
          };
        }
        return m;
      });
    } catch (err: any) {
      console.error("Failed to send message:", err);
      showToast(
        err.message || "Gagal mengirim pesan. Silakan coba lagi.",
        "error",
      );
      messages = messages.filter((m) => m.tempId !== tempId);
    } finally {
      isSending = false;
    }
  }

  function saveUsername() {
    const cleanName = tempUsername.trim();
    if (!cleanName) {
      showToast("Nama tidak boleh kosong!", "error");
      return;
    }
    if (cleanName.length > 25) {
      showToast("Nama maksimal 25 karakter!", "error");
      return;
    }
    if (!data.isAdmin && reservedUsernames.includes(cleanName.toLowerCase())) {
      showToast(
        "Nama ini dilindungi dan khusus untuk pemilik website!",
        "error",
      );
      return;
    }
    currentUsername = cleanName;
    localStorage.setItem("lounge_username", cleanName);
    isEditingName = false;
    showToast("Nama berhasil diperbarui!");
  }

  function randomizeUsername() {
    tempUsername = generateGuestName();
  }

  function formatTime(timestamp: string): string {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (e) {
      return "";
    }
  }

  function formatDateDivider(timestamp: string): string {
    if (!timestamp) return "";
    try {
      const d = new Date(timestamp);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return "Hari ini";
      }
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) {
        return "Kemarin";
      }
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  }

  function shouldShowDateDivider(currMsg: any, prevMsg: any): boolean {
    if (!prevMsg) return true;
    if (!currMsg.created_at || !prevMsg.created_at) return false;
    const d1 = new Date(currMsg.created_at).toDateString();
    const d2 = new Date(prevMsg.created_at).toDateString();
    return d1 !== d2;
  }
</script>

<svelte:head>
  <title>Lounge - Moh. Abroril Huda</title>
  <meta
    name="description"
    content="Ruang obrolan komunitas real-time dengan Abroril Huda."
  />
</svelte:head>

<!-- Notification Toast -->
{#if notificationToast.show}
  <div
    transition:fade={{ duration: 150 }}
    class="fixed top-24 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all
    {notificationToast.type === 'error'
      ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'}"
  >
    {#if notificationToast.type === "error"}
      <svg
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    {:else}
      <svg
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 0 0118 0z"
        />
      </svg>
    {/if}
    <span class="text-sm font-semibold">{notificationToast.text}</span>
  </div>
{/if}

<!-- Lounge Container -->
<div
  class="pt-20 pb-12 min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-300"
>
  <!-- Subtle Ambient Glow -->
  <div
    class="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-50"
  >
    <div
      class="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/20 blur-[120px] rounded-full"
    ></div>
  </div>

  <div class="w-full max-w-4xl relative z-10 flex flex-col space-y-6">
    <!-- Hero Header -->
    <header
      class="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 px-2"
    >
      <div>
        <h1
          class="bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine text-4xl"
        >
          Community Lounge
        </h1>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
          Ruang obrolan santai publik. Bertukar pesan, gagasan, atau menyapa
          Abroril Huda & kawan-kawan.
        </p>
      </div>

      <!-- User Identity Quick Bar -->
      <div
        class="flex items-center gap-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 p-2 pl-3 rounded-2xl shadow-xs backdrop-blur-md"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs"
          style="background-color: {getUsernameColor(currentUsername)}"
        >
          {currentUsername ? currentUsername.charAt(0).toUpperCase() : "G"}
        </div>
        <div class="text-left pr-1">
          <div class="flex items-center gap-1">
            <p
              class="text-xs font-bold text-zinc-900 dark:text-zinc-100 max-w-[120px] truncate"
            >
              {currentUsername}
            </p>
            {#if currentUsername === "Abrorilhuda"}
              <span title="Verified Owner">
                <svg
                  class="w-3.5 h-3.5 text-blue-500 fill-current shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.6 9.55.725 10.92.725 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zM10.09 16.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"
                  />
                </svg>
              </span>
            {/if}
          </div>
          <p
            class="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider"
          >
            {#if data.isAdmin}
              👑 Owner Admin Mode
            {:else}
              Identitas Kamu
            {/if}
          </p>
        </div>
        <button
          type="button"
          onclick={() => {
            tempUsername = currentUsername;
            isEditingName = true;
          }}
          class="p-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60"
          title="Ubah Nama Tampilan"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- MAIN CHATROOM FRAME -->
    <div
      class="w-full bg-white/80 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl shadow-blue-500/5 flex flex-col h-[70vh] relative overflow-hidden backdrop-blur-xl"
    >
      <!-- Chat Header Bar -->
      <div
        class="px-6 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md flex items-center justify-between z-20"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
          ></div>
          <span
            class="text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-wide uppercase"
          >
            Obrolan Realtime
          </span>
        </div>

        <div class="flex items-center gap-2">
          {#if data.isAdmin}
            <a
              href="/admin"
              class="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-xs"
            >
              Dashboard Admin →
            </a>
          {/if}
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
          >
            {messages.length} Pesan
          </span>
        </div>
      </div>

      <!-- MESSAGES FEED CONTAINER -->
      <div
        bind:this={chatContainer}
        class="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
        style="scroll-behavior: smooth;"
      >
        {#if messages.length === 0}
          <div
            class="flex flex-col items-center justify-center h-full text-center p-8"
            transition:fade
          >
            <div
              class="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400"
            >
              <svg
                class="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <h3 class="font-bold text-zinc-900 dark:text-zinc-100 text-lg">
              Belum Ada Obrolan
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
              Jadilah yang pertama mengirimkan pesan di Lounge! Kirim ide,
              pertanyaan, atau sapaan santai.
            </p>
          </div>
        {:else}
          {#each messages as msg, idx (msg.id)}
            <!-- Date Divider -->
            {#if shouldShowDateDivider(msg, messages[idx - 1])}
              <div class="flex items-center justify-center my-4">
                <span
                  class="px-3 py-1 rounded-full text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60"
                >
                  {formatDateDivider(msg.created_at)}
                </span>
              </div>
            {/if}

            <div
              class="flex flex-col {msg.username === currentUsername
                ? 'items-end'
                : 'items-start'} group"
            >
              <!-- WhatsApp-Style Message Bubble -->
              <div
                class="max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-xs border transition-all relative
                {msg.username === currentUsername
                  ? 'bg-blue-600 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-600 rounded-tr-xs shadow-md shadow-blue-500/10'
                  : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200/80 dark:border-zinc-700/80 rounded-tl-xs'}"
              >
                <!-- Sender Username Header (Only for others) -->
                {#if msg.username !== currentUsername}
                  <div
                    class="flex items-center gap-1.5 mb-1 text-xs font-bold leading-none select-none"
                  >
                    <span style="color: {getUsernameColor(msg.username)}">
                      {msg.username}
                    </span>

                    <!-- Owner Verified Badge with Blue Checkmark -->
                    {#if msg.username === "Abrorilhuda"}
                      <span
                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold border border-blue-500/20"
                      >
                        <svg
                          class="w-3 h-3 text-blue-500 fill-current shrink-0"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.6 9.55.725 10.92.725 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zM10.09 16.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"
                          />
                        </svg>
                      </span>
                    {/if}
                  </div>
                {/if}

                <!-- WhatsApp Inline Flow: Message Text & Embedded Timestamp -->
                <div class="relative">
                  <span
                    class="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap"
                  >
                    {msg.message}
                  </span>

                  <!-- Inline Right-aligned WhatsApp Timestamp & Double Ticks -->
                  <span
                    class="float-right ml-3 mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium leading-none select-none opacity-80 translate-y-0.5
                    {msg.username === currentUsername
                      ? 'text-blue-100'
                      : 'text-zinc-400 dark:text-zinc-500'}"
                  >
                    <span>{formatTime(msg.created_at)}</span>

                    <!-- Delivery Status for own messages -->
                    {#if msg.username === currentUsername}
                      {#if msg.status === "sending"}
                        <svg
                          class="w-3 h-3 text-blue-200 animate-pulse"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      {:else}
                        <!-- Blue double checkmarks like WhatsApp -->
                        <svg
                          class="w-3.5 h-3.5 text-sky-200"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M1.75 12a.75.75 0 011.28-.53l5.47 5.47L19.97 5.47a.75.75 0 111.06 1.06l-12.5 12.5a.75.75 0 01-1.06 0L1.75 13.06A.75.75 0 011.75 12z"
                          />
                          <path
                            d="M8.25 12a.75.75 0 011.28-.53l5.47 5.47L26.47 5.47a.75.75 0 111.06 1.06l-12.5 12.5a.75.75 0 01-1.06 0L8.25 13.06A.75.75 0 018.25 12z"
                          />
                        </svg>
                      {/if}
                    {/if}
                  </span>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <!-- INPUT BAR DOCK -->
      <form
        onsubmit={sendMessage}
        class="px-4 md:px-6 py-4 bg-white/90 dark:bg-zinc-900/90 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3 z-20 backdrop-blur-md"
      >
        <input
          type="text"
          bind:value={inputMessage}
          placeholder={data.isAdmin
            ? "Balas obrolan sebagai Abrorilhuda..."
            : "Tulis pesan obrolan..."}
          maxlength="500"
          class="flex-1 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-2xl px-4 py-3 text-sm border border-zinc-200/80 dark:border-zinc-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-150 shadow-xs"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          class="w-11 h-11 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-40 disabled:hover:scale-100 disabled:active:scale-100 disabled:cursor-not-allowed transition-all"
          aria-label="Kirim Pesan"
        >
          <svg
            class="w-5 h-5 ml-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>

      <!-- USERNAME EDIT MODAL -->
      {#if isEditingName}
        <div
          transition:fade={{ duration: 150 }}
          class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        >
          <div
            transition:slide={{ duration: 200 }}
            class="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col relative"
          >
            <!-- Close Button -->
            <button
              type="button"
              onclick={() => (isEditingName = false)}
              class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
              aria-label="Tutup"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2
              class="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Ubah Nama Tampilan
            </h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Nama ini akan terlihat oleh semua pengguna lain di Lounge Chat.
            </p>

            <div class="mt-4 flex flex-col gap-3">
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  bind:value={tempUsername}
                  placeholder="Masukkan nama tampilan..."
                  maxlength="25"
                  class="flex-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 rounded-xl px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />

                <button
                  type="button"
                  onclick={randomizeUsername}
                  class="px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-all border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer"
                  title="Generate Nama Acak"
                >
                  🎲 Acak
                </button>
              </div>

              <div class="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onclick={() => (isEditingName = false)}
                  class="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onclick={saveUsername}
                  class="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-all cursor-pointer shadow-md shadow-blue-500/15"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
