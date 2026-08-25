<script lang="ts">
  import { enhance } from "$app/forms";

  export let form: { error?: string } | null = null;

  let isSubmitting = false;
  let showPassword = false;
</script>

<svelte:head>
  <title>Admin Login - Moh. Abroril Huda</title>
</svelte:head>

<div
  class="min-h-screen relative flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-300"
>
  <!-- Background Glow & Grid Overlay -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      class="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/15 rounded-full blur-3xl animate-float"
    ></div>
    <div
      class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/15 dark:bg-purple-600/15 rounded-full blur-3xl animate-float"
      style="animation-delay: 2s;"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
    ></div>

    <!-- Background Grid Pattern -->
    <div
      class="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.15] dark:opacity-[0.07]"
    ></div>
  </div>

  <div class="w-full max-w-md relative z-10 fade-in-up">
    <!-- Quick Back to Website Link -->
    <div class="mb-6 flex justify-between items-center px-1">
      <a
        href="/"
        class="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <span>Kembali ke Website</span>
      </a>

      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        Admin Area
      </span>
    </div>

    <!-- Login Card -->
    <div
      class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25 group"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 blur opacity-40 group-hover:opacity-75 transition-opacity"
          ></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            stroke="currentColor"
            class="w-8 h-8 text-white relative z-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h1
          class="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          Selamat Datang
        </h1>
        <p
          class="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          Silakan masuk dengan akun admin Anda untuk mengelola dashboard
        </p>
      </div>

      <!-- Form -->
      <form
        method="POST"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ update }) => {
            await update();
            isSubmitting = false;
          };
        }}
        class="space-y-5"
      >
        <!-- Error Message -->
        {#if form?.error}
          <div
            class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-3 animate-shake"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5 flex-shrink-0"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span class="font-medium">{form.error}</span>
          </div>
        {/if}

        <!-- Email Field -->
        <div>
          <label
            for="email"
            class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Admin
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.75"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isSubmitting}
              class="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/80 dark:border-gray-700/80 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label
              for="password"
              class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Kata Sandi
            </label>
          </div>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.75"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={isSubmitting}
              class="w-full pl-11 pr-11 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-300/80 dark:border-gray-700/80 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              on:click={() => (showPassword = !showPassword)}
              tabindex="-1"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              aria-label={showPassword
                ? "Sembunyikan password"
                : "Tampilkan password"}
            >
              {#if showPassword}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.75"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.75"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12c1.349-3.938 5.064-7 9.544-7s8.195 3.062 9.544 7c-1.349 3.938-5.064 7-9.544 7s-8.195-3.062-9.544-7z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {#if isSubmitting}
            <svg
              class="animate-spin h-5 w-5 text-white"
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
            <span>Memproses...</span>
          {:else}
            <span>Masuk ke Dashboard</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          {/if}
        </button>
      </form>
    </div>

    <!-- Footer Copyright/Security Note -->
    <div class="mt-8 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Moh. Abroril Huda. Encrypted & Secure Access.
      </p>
    </div>
  </div>
</div>
