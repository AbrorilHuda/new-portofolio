<script lang="ts">
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";
  import { supabase } from "$lib/supabase/supabase";
  import { fly, fade } from "svelte/transition";

  const currentYear = new Date().getFullYear();

  // Quick Feedback Form state
  let feedbackName = "";
  let feedbackMessage = "";
  let feedbackSubmitting = false;
  let feedbackSuccess = false;
  let feedbackError = "";
  let isFeedbackOpen = false;

  async function handleQuickFeedback() {
    if (feedbackSubmitting) return;

    feedbackSubmitting = true;
    feedbackSuccess = false;
    feedbackError = "";

    try {
      const { error } = await supabase.from("feedback_messages").insert({
        name: feedbackName.trim(),
        message: feedbackMessage.trim(),
        type: "quick_feedback",
        page_url: typeof window !== "undefined" ? window.location.href : null,
      });

      if (error) throw error;

      feedbackSuccess = true;
      feedbackName = "";
      feedbackMessage = "";

      setTimeout(() => {
        feedbackSuccess = false;
        isFeedbackOpen = false;
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      feedbackError = "Gagal mengirim pesan. Silakan coba lagi.";

      setTimeout(() => {
        feedbackError = "";
      }, 5000);
    } finally {
      feedbackSubmitting = false;
    }
  }
</script>

<footer
  class="relative bg-zinc-950 text-zinc-400 pt-16 pb-12 border-t border-zinc-800/80 overflow-hidden transition-colors duration-300"
>
  <!-- Subtle Glow Effect -->
  <div class="pointer-events-none absolute inset-0 z-0 opacity-30">
    <div
      class="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-blue-600/20 via-purple-600/15 to-transparent blur-[120px] rounded-full"
    ></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">

      <!-- Brand & Quick Feedback -->
      <div class="md:col-span-6 space-y-6">
        <div>
          <a href="/" class="inline-block">
            <h3
              class="text-2xl font-black tracking-tight text-white flex items-center gap-2"
            >
              <span
                class="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
              >
                Abrorilhuda.me
              </span>
            </h3>
          </a>
          <p
            class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm leading-relaxed"
          >
            Personal website, portfolio, and digital garden of Moh. Abroril
            Huda. Built for high performance & clean design.
          </p>
        </div>

        <!-- Feedback Drawer / Trigger -->
        <div class="max-w-md">
          {#if !isFeedbackOpen}
            <button
              type="button"
              on:click={() => (isFeedbackOpen = true)}
              class="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-blue-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-md shadow-black/20 cursor-pointer"
            >
              <div
                class="p-1.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span>Have feedback or suggestions? Send a quick note →</span>
            </button>
          {:else}
            <div
              transition:fly={{ y: 15, duration: 200 }}
              class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4"
            >
              <div class="flex items-center justify-between">
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Quick Feedback
                </h4>
                <button
                  type="button"
                  on:click={() => (isFeedbackOpen = false)}
                  class="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Tutup feedback"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                on:submit|preventDefault={handleQuickFeedback}
                class="space-y-3"
              >
                <input
                  type="text"
                  bind:value={feedbackName}
                  placeholder="Nama kamu..."
                  required
                  minlength="2"
                  class="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-xs"
                />
                <textarea
                  bind:value={feedbackMessage}
                  placeholder="Pesan atau saran singkat..."
                  required
                  minlength="5"
                  rows="2"
                  class="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-xs resize-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 cursor-pointer"
                >
                  {#if feedbackSubmitting}
                    <svg
                      class="animate-spin h-3.5 w-3.5"
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
                    <span>Sending...</span>
                  {:else}
                    <span>Send Message</span>
                  {/if}
                </button>
              </form>

              {#if feedbackSuccess}
                <div
                  transition:fade
                  class="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-medium"
                >
                  <svg
                    class="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Terima kasih! Pesan kamu berhasil terkirim.</span>
                </div>
              {/if}

              {#if feedbackError}
                <div
                  transition:fade
                  class="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs font-medium"
                >
                  <svg
                    class="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>{feedbackError}</span>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="md:col-span-3 space-y-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-white">
          Navigation
        </h4>
        <ul class="space-y-2.5 text-xs font-medium">
          <li>
            <a
              href="/projects"
              class="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Projects</span>
            </a>
          </li>
          <li>
            <a
              href="/blog"
              class="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Blog Articles</span>
            </a>
          </li>
          <li>
            <a
              href="/lounge"
              class="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Lounge Chat</span>
              <span
                class="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >LIVE</span
              >
            </a>
          </li>
          <li>
            <a
              href="/now"
              class="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Now Page</span>
            </a>
          </li>
          <li>
            <a
              href="/celoteh"
              class="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Celoteh</span>
            </a>
          </li>
          <li>
            <a
              href="/privacy-policy"
              class="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Privacy Policy</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Social & Connect -->
      <div class="md:col-span-3 space-y-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-white">
          {t($locale, "footer.connect")}
        </h4>
        <p class="text-xs text-zinc-400 leading-relaxed">
          Follow my latest code updates & thoughts:
        </p>
        <div class="flex items-center gap-2.5">
          <a
            href="https://github.com/abrorilhuda"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/40 text-zinc-400 hover:text-white rounded-xl transition-all hover:scale-105"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/moh-abroril-huda"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/40 text-zinc-400 hover:text-white rounded-xl transition-all hover:scale-105"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </a>
          <a
            href="https://x.com/abror_dc"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/40 text-zinc-400 hover:text-white rounded-xl transition-all hover:scale-105"
            aria-label="Twitter"
            title="Twitter / X"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div
      class="border-t border-zinc-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500"
    >
      <p>
        {t($locale, "footer.copyright", { year: currentYear })}
      </p>
      <p class="flex items-center gap-1">
        <span>Designed & built with</span>
        <span class="text-red-500">♥</span>
        <span>using SvelteKit & Tailwind CSS</span>
      </p>
    </div>
  </div>
</footer>
