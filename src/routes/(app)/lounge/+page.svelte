<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { supabase } from "$lib/supabase/supabase";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  // Local state for messages
  let messages = $state<any[]>([]);
  let currentUsername = $state("");
  let inputMessage = $state("");
  let isEditingName = $state(false);
  let tempUsername = $state("");
  let chatContainer: HTMLElement | null = $state(null);
  let isSending = $state(false);
  let notificationToast = $state<{ show: boolean; text: string; type: "success" | "error" }>({
    show: false,
    text: "",
    type: "success"
  });

  // Load messages from page load data
  $effect(() => {
    if (data.messages) {
      messages = [...data.messages];
      scrollToBottom();
    }
  });

  // List of gorgeous colors for guest usernames
  const premiumColors = [
    "#6366f1", // Indigo
    "#3b82f6", // Blue
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
    "#a855f7"  // Purple
  ];

  // Deterministically hash usernames to get a premium color
  function getUsernameColor(name: string): string {
    if (name === "Abrorilhuda") return "#a855f7"; // Admin gets a distinct rich violet/purple
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % premiumColors.length;
    return premiumColors[index];
  }

  // Generate random cool guest names on first load
  function generateGuestName(): string {
    const nouns = ["Explorer", "Coder", "Builder", "Tamu", "Creator", "Hacker", "Designer", "Innovator"];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${randomNoun}-${randomNum}`;
  }

  // Handle toast notifications
  function showToast(text: string, type: "success" | "error" = "success") {
    notificationToast = { show: true, text, type };
    setTimeout(() => {
      notificationToast.show = false;
    }, 3000);
  }

  // Scroll to bottom helper
  async function scrollToBottom(behavior: ScrollBehavior = "smooth") {
    await tick();
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior
      });
    }
  }

  onMount(() => {
    // 1. Get or generate username from localStorage
    const savedName = localStorage.getItem("lounge_username");
    if (savedName) {
      currentUsername = savedName;
    } else {
      const defaultName = generateGuestName();
      currentUsername = defaultName;
      localStorage.setItem("lounge_username", defaultName);
    }
    tempUsername = currentUsername;

    // 2. Subscribe to Supabase Postgres changes for the 'messages' table
    const channel = supabase
      .channel("lounge-realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new;
          // Check if message is already in state (e.g. from optimistic UI update)
          const exists = messages.find((m) => m.id === newMsg.id || m.tempId === newMsg.id);
          if (!exists) {
            messages = [...messages, newMsg];
            scrollToBottom();
          }
        }
      )
      .subscribe();

    scrollToBottom("auto");

    return () => {
      supabase.removeChannel(channel);
    };
  });

  // Submit message handler
  async function sendMessage(e: Event) {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const messageText = inputMessage.trim();
    inputMessage = ""; // Reset input quickly for responsive typing
    isSending = true;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      tempId: tempId,
      username: currentUsername,
      message: messageText,
      created_at: new Date().toISOString(),
      status: "sending" // Single Gray tick status
    };

    // Optimistically add to local feed
    messages = [...messages, optimisticMessage];
    scrollToBottom();

    try {
      const response = await fetch("/api/lounge/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUsername,
          message: messageText
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mengirim pesan");
      }

      // Update optimistic message with real DB ID and change tick to double
      messages = messages.map((m) => {
        if (m.tempId === tempId) {
          return {
            ...m,
            id: result.data.id,
            status: "delivered" // Double zinc tick status
          };
        }
        return m;
      });

    } catch (err: any) {
      console.error("Failed to send message:", err);
      showToast(err.message || "Gagal mengirim pesan. Silakan coba lagi.", "error");
      
      // Remove optimistic message on failure
      messages = messages.filter((m) => m.tempId !== tempId);
    } finally {
      isSending = false;
    }
  }

  // Change username handler
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
    currentUsername = cleanName;
    localStorage.setItem("lounge_username", cleanName);
    isEditingName = false;
    showToast("Nama berhasil diperbarui!");
  }

  // Format message time (e.g. 14:32)
  function formatTime(timestamp: string): string {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (e) {
      return "";
    }
  }
</script>

<svelte:head>
  <title>Lounge - Moh. Abroril Huda</title>
  <meta name="description" content="Halaman obrolan grup komunitas real-time dengan Abroril Huda." />
</svelte:head>

<!-- Global Toast Notification -->
{#if notificationToast.show}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed top-24 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all
    {notificationToast.type === 'error' 
      ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'}"
  >
    {#if notificationToast.type === 'error'}
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    {:else}
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    {/if}
    <span class="text-sm font-semibold">{notificationToast.text}</span>
  </div>
{/if}

<!-- Lounge Layout Container -->
<div class="pt-24 pb-6 min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-300">
  
  <!-- Subtle Web Grid Wallpaper Pattern -->
  <div class="absolute inset-0 opacity-100 pointer-events-none" 
       style="background-image: radial-gradient(var(--pattern-color, rgba(0, 0, 0, 0.05)) 1px, transparent 0); background-size: 24px 24px;"></div>
  
  <style>
    :global(.dark) .absolute {
      --pattern-color: rgba(255, 255, 255, 0.02);
    }
  </style>

  <div class="w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-2xl shadow-xl flex flex-col h-[78vh] relative overflow-hidden transition-all duration-300 z-10">
    
    <!-- HEADER -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-20">
      <div class="flex items-center gap-3">
        <!-- Pulse Glow Icon -->
        <div class="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md relative">
          <svg class="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <!-- Active Pulse Dot -->
          <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
        </div>
        
        <div>
          <h1 class="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Live Lounge Chat
            <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse border border-emerald-500/15">
              Online
            </span>
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Komunitas Developer & Tamu Umum
          </p>
        </div>
      </div>

      <!-- Quick Action / Stats Badge -->
      <div class="flex items-center gap-2">
        <span class="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold border border-gray-200 dark:border-gray-700/60 shadow-xs">
          {messages.length} Pesan
        </span>
      </div>
    </header>

    <!-- CHAT CONTAINER -->
    <div
      bind:this={chatContainer}
      class="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
      style="scroll-behavior: smooth;"
    >
      {#if messages.length === 0}
        <div class="flex flex-col items-center justify-center h-full text-center p-6" transition:fade>
          <div class="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-4 text-indigo-500">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-800 dark:text-gray-200 text-base">Belum ada obrolan</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Jadilah yang pertama mengirimkan pesan di Lounge! Yuk kenalan atau sekadar menyapa.
          </p>
        </div>
      {:else}
        {#each messages as msg (msg.id)}
          <div class="flex flex-col {msg.username === currentUsername ? 'items-end' : 'items-start'} group">
            
            <!-- Message Bubble -->
            <div
              class="max-w-[75%] rounded-2xl px-4 py-3 shadow-xs border transition-all duration-150 relative
              {msg.username === currentUsername
                ? 'bg-indigo-600 dark:bg-indigo-600 text-white border-indigo-600 dark:border-indigo-600 rounded-tr-none'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-100 dark:border-gray-800/80 rounded-tl-none'}"
            >
              
              <!-- Sender Username Label (Only for others) -->
              {#if msg.username !== currentUsername}
                <div class="flex items-center gap-1.5 mb-1 text-xs font-bold leading-none select-none">
                  <span style="color: {getUsernameColor(msg.username)}">
                    {msg.username}
                  </span>
                  
                  <!-- Developer Crown Badge -->
                  {#if msg.username === "Abrorilhuda"}
                    <span class="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-extrabold tracking-wider border border-purple-500/15 uppercase">
                      <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                      Owner
                    </span>
                  {/if}
                </div>
              {/if}

              <!-- Message Text -->
              <p class="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">
                {msg.message}
              </p>

              <!-- Timestamp & Delivery Centang Status -->
              <div class="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] leading-none select-none opacity-85
                {msg.username === currentUsername ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'}">
                
                <span>{formatTime(msg.created_at)}</span>

                <!-- Double Tick marks for own messages -->
                {#if msg.username === currentUsername}
                  {#if msg.status === "sending"}
                    <!-- Single Tick (Gray) -->
                    <svg class="w-3.5 h-3.5 text-indigo-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  {:else}
                    <!-- Double Ticks (Zinc/Neutral colored centang) -->
                    <svg class="w-4 h-4 text-zinc-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1.75 12a.75.75 0 011.28-.53l5.47 5.47L19.97 5.47a.75.75 0 111.06 1.06l-12.5 12.5a.75.75 0 01-1.06 0L1.75 13.06A.75.75 0 011.75 12z" />
                      <path d="M8.25 12a.75.75 0 011.28-.53l5.47 5.47L26.47 5.47a.75.75 0 111.06 1.06l-12.5 12.5a.75.75 0 01-1.06 0L8.25 13.06A.75.75 0 018.25 12z" />
                    </svg>
                  {/if}
                {/if}
              </div>

            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- USERNAME EDITOR INLINE BANNER -->
    <div class="px-6 py-2 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-150 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
        <span>Mengirim sebagai:</span>
        <strong class="text-gray-800 dark:text-gray-200 font-bold">{currentUsername}</strong>
        {#if currentUsername === "Abrorilhuda"}
          <span class="text-[9px] px-1 rounded-sm bg-purple-500/10 text-purple-500 font-extrabold uppercase border border-purple-500/10">Admin</span>
        {/if}
      </div>
      <button
        type="button"
        onclick={() => { tempUsername = currentUsername; isEditingName = true; }}
        class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Ubah Nama
      </button>
    </div>

    <!-- INPUT BAR -->
    <form
      onsubmit={sendMessage}
      class="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-150 dark:border-gray-800 flex items-center gap-3 z-20"
    >
      <input
        type="text"
        bind:value={inputMessage}
        placeholder="Tulis pesan..."
        maxlength="500"
        class="flex-1 bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-sm border border-gray-200 dark:border-gray-700/80 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-150"
      />
      
      <button
        type="submit"
        disabled={!inputMessage.trim() || isSending}
        class="w-11 h-11 rounded-xl bg-indigo-600 dark:bg-indigo-600 text-white hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:scale-105 active:scale-95 flex items-center justify-center shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-40 disabled:hover:scale-100 disabled:active:scale-100 disabled:cursor-not-allowed transition-all"
        aria-label="Kirim"
      >
        <svg class="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>

    <!-- USERNAME POPUP MODAL DRAWER -->
    {#if isEditingName}
      <div
        transition:fade={{ duration: 150 }}
        class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-40"
      >
        <div
          transition:slide={{ duration: 200 }}
          class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-750 p-6 flex flex-col relative"
        >
          <!-- Close Button -->
          <button
            type="button"
            onclick={() => isEditingName = false}
            class="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Tutup"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 class="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Ubah Nama Tampilan
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Nama ini akan tampil di gelembung obrolan saat Anda mengirim pesan.
          </p>

          <div class="mt-4 flex flex-col gap-3">
            <input
              type="text"
              bind:value={tempUsername}
              placeholder="Masukkan nama tampilan..."
              maxlength="25"
              class="w-full bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-xl px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all"
            />
            
            <div class="flex items-center gap-2 mt-1">
              <button
                type="button"
                onclick={() => isEditingName = false}
                class="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all cursor-pointer"
              >
                Batal
              </button>
              
              <button
                type="button"
                onclick={saveUsername}
                class="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
              >
                Simpan Nama
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}

  </div>
</div>
