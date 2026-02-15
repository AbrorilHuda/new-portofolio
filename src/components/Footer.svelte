<script>
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";
  import { supabase } from "$lib/supabase/supabase";
  import { slide } from "svelte/transition";
  import ChatMessage from "./ChatMessage.svelte";

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

      // Success
      feedbackSuccess = true;
      feedbackName = "";
      feedbackMessage = "";

      // Hide success message after 5 seconds
      setTimeout(() => {
        feedbackSuccess = false;
        isFeedbackOpen = false; // Auto close on success
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      feedbackError = "Failed to send message. Please try again.";

      // Hide error message after 5 seconds
      setTimeout(() => {
        feedbackError = "";
      }, 5000);
    } finally {
      feedbackSubmitting = false;
    }
  }
</script>

<footer class="bg-gray-900 dark:bg-black text-gray-300 py-12 px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <ChatMessage />
    <div class="grid md:grid-cols-4 gap-8 mb-8">
      <div class="md:col-span-2">
        <h3
          class="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
        >
          Abrorilhuda.me
        </h3>

        <!-- Quick Feedback Form -->
        <div class="max-w-md">
          {#if !isFeedbackOpen}
            <button
              on:click={() => (isFeedbackOpen = true)}
              class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <div
                class="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors"
              >
                <svg
                  class="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium"
                >Have feedback? Send me a quick message</span
              >
            </button>
          {:else}
            <div
              transition:slide
              class="bg-gray-800/50 rounded-xl p-4 border border-gray-800"
            >
              <div class="flex items-center justify-between mb-3">
                <h4
                  class="text-white font-semibold flex items-center gap-2 text-sm"
                >
                  <svg
                    class="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Quick Feedback
                </h4>
                <button
                  on:click={() => (isFeedbackOpen = false)}
                  class="text-gray-500 hover:text-white transition-colors"
                  aria-label="Close feedback"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              <form
                on:submit|preventDefault={handleQuickFeedback}
                class="space-y-3"
              >
                <input
                  type="text"
                  bind:value={feedbackName}
                  placeholder="Your name"
                  required
                  minlength="2"
                  class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <textarea
                  bind:value={feedbackMessage}
                  placeholder="Your message..."
                  required
                  minlength="10"
                  rows="2"
                  class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {#if feedbackSubmitting}
                    <svg
                      class="animate-spin h-3 w-3"
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
                    Sending...
                  {:else}
                    Send Message
                  {/if}
                </button>
              </form>

              {#if feedbackSuccess}
                <div
                  class="mt-3 p-2 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-2"
                  transition:slide
                >
                  <svg
                    class="w-4 h-4 text-green-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p class="text-green-400 text-xs">Thanks! Message sent.</p>
                </div>
              {/if}

              {#if feedbackError}
                <div
                  class="mt-3 p-2 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-2"
                  transition:slide
                >
                  <svg
                    class="w-4 h-4 text-red-400 flex-shrink-0"
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
                  <p class="text-red-400 text-xs">{feedbackError}</p>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="font-bold text-white mb-4">
          {t($locale, "footer.quickLinks")}
        </h4>
        <ul class="space-y-2">
          <li>
            <button
              on:click={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })}
              class="hover:text-blue-400 transition-colors"
            >
              About
            </button>
          </li>
          <li>
            <button
              on:click={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })}
              class="hover:text-blue-400 transition-colors"
            >
              Projects
            </button>
          </li>
          <li>
            <button
              on:click={() =>
                document
                  .getElementById("experience")
                  ?.scrollIntoView({ behavior: "smooth" })}
              class="hover:text-blue-400 transition-colors"
            >
              Experience
            </button>
          </li>
          <li>
            <button
              on:click={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })}
              class="hover:text-blue-400 transition-colors"
            >
              Contact
            </button>
          </li>
          <li>
            <a
              href="https://demtimcod.my.id"
              target="_blank"
              class="hover:text-blue-400 transition-colors"
              >{t($locale, "footer.oldWebsite")}</a
            >
          </li>
        </ul>
      </div>

      <!-- Social Links -->
      <div>
        <h4 class="font-bold text-white mb-4">
          {t($locale, "footer.connect")}
        </h4>
        <div class="flex gap-4">
          <a
            href="https://github.com/abrorilhuda"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/moh-abroril-huda"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="LinkedIn"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </a>
          <a
            href="https://x.com/abror_dc"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Twitter"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
      class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <p class="text-gray-400 text-sm">
        {t($locale, "footer.copyright", { year: currentYear })}
      </p>
      <p class="text-gray-400 text-sm">
        {t($locale, "footer.builtWith", { heart: "♥" })}
      </p>
    </div>
  </div>
</footer>
