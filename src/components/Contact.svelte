<script lang="ts">
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";
  import { supabase } from "$lib/supabase/supabase";

  let formData = {
    name: "",
    email: "",
    message: "",
  };

  let submitted = false;
  let submitting = false;
  let error = "";

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (submitting) return;

    submitting = true;
    error = "";

    try {
      const { error: submitError } = await supabase
        .from("feedback_messages")
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          type: "contact_form",
          page_url: typeof window !== "undefined" ? window.location.href : null,
        });

      if (submitError) throw submitError;

      // Success
      submitted = true;
      formData = { name: "", email: "", message: "" };

      setTimeout(() => {
        submitted = false;
      }, 5000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      error = "Failed to send message. Please try again or email me directly.";

      setTimeout(() => {
        error = "";
      }, 5000);
    } finally {
      submitting = false;
    }
  }
</script>

<section id="contact" class="py-24 px-6 lg:px-8">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        {t($locale, "contact.titlePrefix")}
        <span
          class="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine"
          >{t($locale, "contact.titleHighlight")}</span
        >
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        {t($locale, "contact.tagline")}
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-12">
      <!-- Contact Info -->
      <div class="space-y-8">
        <div>
          <h3 class="text-2xl font-bold mb-6">
            {t($locale, "contact.getInTouch")}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {t($locale, "contact.description")}
          </p>
        </div>

        <!-- Contact Methods -->
        <div class="space-y-4">
          <a
            href="mailto:moh.abrorilhuda@gmail.com"
            class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <div
              class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p class="font-medium text-gray-900 dark:text-white">
                moh.abrorilhuda@gmail.com
              </p>
            </div>
          </a>

          <a
            href="tel:+62"
            class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <div
              class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p class="font-medium text-gray-900 dark:text-white">+62</p>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/moh-abroril-huda"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <div
              class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
              <p class="font-medium text-gray-900 dark:text-white">
                linkedin.com/in/moh-abroril-huda
              </p>
            </div>
          </a>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
        {#if submitted}
          <div class="text-center py-12">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600 dark:text-green-400"
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
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t($locale, "contact.success")}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Thank you for reaching out. I'll get back to you soon.
            </p>
          </div>
        {:else}
          <form on:submit={handleSubmit} class="space-y-6">
            <div class="group">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors"
              >
                {t($locale, "contact.name")}
              </label>
              <input
                type="text"
                id="name"
                bind:value={formData.name}
                required
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white input-spotlight"
                placeholder="Your name"
              />
            </div>

            <div class="group">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors"
              >
                {t($locale, "contact.email")}
              </label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white input-spotlight"
                placeholder="your.email@example.com"
              />
            </div>

            <div class="group">
              <label
                for="message"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors"
              >
                {t($locale, "contact.message")}
              </label>
              <textarea
                id="message"
                bind:value={formData.message}
                required
                rows="5"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-white input-spotlight"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              class="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {#if submitting}
                <svg
                  class="animate-spin h-5 w-5"
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
                <span class="relative z-10">Sending...</span>
              {:else}
                <span class="relative z-10">{t($locale, "contact.send")}</span>
                <svg
                  class="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                ></div>
              {/if}
            </button>

            {#if error}
              <div
                class="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2"
              >
                <svg
                  class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
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
                <p class="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            {/if}
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>
