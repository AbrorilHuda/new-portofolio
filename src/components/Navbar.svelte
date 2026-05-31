<script lang="ts">
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import { openCommandPalette } from "$lib/stores/command-palette";
  import { page } from "$app/stores";
  import { fade, fly } from "svelte/transition";
  import { openAiAssistant } from "$lib/stores/ai-assistant";
  import { mobileMenuOpenStore } from "$lib/stores/mobile-menu";

  $: currentPath = $page.url.pathname;

  export let darkMode = false;
  export let toggleDarkMode;

  let mobileMenuOpen = false;
  let scrolled = false;

  $: mobileMenuOpenStore.set(mobileMenuOpen);

  function handleScroll() {
    scrolled = window.scrollY > 20;
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      mobileMenuOpen = false;
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll);
  }

  // Lock body scroll when drawer is open
  $: if (typeof document !== "undefined") {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md'
    : 'bg-transparent'}"
>
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <!-- Logo -->
      <button
        on:click={() => (window.location.href = "/")}
        class="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer"
      >
        Abrorilhuda.me
      </button>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-8">
        <button on:click={() => scrollToSection("about")} class="nav-link"
          >{t($locale, "nav.about")}</button
        >
        <button on:click={() => scrollToSection("projects")} class="nav-link"
          >{t($locale, "nav.projects")}</button
        >
        <button on:click={() => scrollToSection("experience")} class="nav-link"
          >{t($locale, "nav.experience")}</button
        >
        <button on:click={() => scrollToSection("contact")} class="nav-link"
          >{t($locale, "nav.contact")}</button
        >
        <button
          on:click={() => (window.location.href = "/blog")}
          class="nav-link {currentPath.startsWith('/blog')
            ? 'nav-link--active'
            : ''}">{t($locale, "nav.blog")}</button
        >

        <button
          on:click={() => (window.location.href = "/celoteh")}
          class="nav-link {currentPath.startsWith('/celoteh')
            ? 'nav-link--active'
            : ''}">Celoteh</button
        >

        <button
          on:click={() => (window.location.href = "/lounge")}
          class="nav-link {currentPath.startsWith('/lounge')
            ? 'nav-link--active'
            : ''}">Lounge</button
        >

        <button
          on:click={() => (window.location.href = "/now")}
          class="nav-link {currentPath.startsWith('/now')
            ? 'nav-link--active'
            : ''}">{t($locale, "nav.now")}</button
        >

        <!-- Command Palette Button -->
        <button
          on:click={openCommandPalette}
          class="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group cursor-pointer"
          title="Quick search (Ctrl+K)"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <kbd
            class="hidden lg:inline-block px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
          >
            Ctrl K
          </kbd>
        </button>

        <!-- Language Switcher -->
        <LanguageSwitcher />

        <!-- Dark Mode Toggle -->
        <button
          on:click={toggleDarkMode}
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {#if darkMode}
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          {:else}
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          {/if}
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
        class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {#if mobileMenuOpen}
          <svg
            class="w-6 h-6"
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
        {:else}
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Menu Drawer -->
  {#if mobileMenuOpen}
    <!-- Backdrop Overlay -->
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
      on:click={() => (mobileMenuOpen = false)}
      transition:fade={{ duration: 200 }}
      role="presentation"
    ></div>

    <!-- Side Drawer -->
    <div
      class="fixed top-0 right-0 h-full w-[80%] max-w-[340px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-white/10 shadow-2xl z-50 p-6 flex flex-col justify-between md:hidden"
      transition:fly={{ x: 300, duration: 300, opacity: 1 }}
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div class="flex flex-col h-full justify-between overflow-y-auto pr-1">
        <div class="space-y-8">
          <!-- Header -->
          <div
            class="flex items-center justify-between pb-4 border-b border-gray-150/50 dark:border-white/5"
          >
            <span
              class="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Navigation
            </span>
            <button
              on:click={() => (mobileMenuOpen = false)}
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 border border-transparent hover:border-gray-200/50 dark:hover:border-white/5 transition-all text-gray-500 dark:text-gray-400"
              aria-label="Close menu"
            >
              <svg
                class="w-5 h-5"
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
            </button>
          </div>

          <!-- Section 1: Main Pages -->
          <div class="space-y-3">
            <span
              class="block text-[11px] font-semibold text-gray-450 dark:text-gray-500 uppercase tracking-wider pl-2"
              >Menu</span
            >
            <div class="space-y-1">
              <button
                on:click={() => scrollToSection("about")}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm"
              >
                <span class="text-base leading-none">👤</span>
                {t($locale, "nav.about")}
              </button>
              <button
                on:click={() => scrollToSection("projects")}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm"
              >
                <span class="text-base leading-none">💼</span>
                {t($locale, "nav.projects")}
              </button>
              <button
                on:click={() => scrollToSection("experience")}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm"
              >
                <span class="text-base leading-none">📊</span>
                {t($locale, "nav.experience")}
              </button>
              <button
                on:click={() => scrollToSection("contact")}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm"
              >
                <span class="text-base leading-none">📧</span>
                {t($locale, "nav.contact")}
              </button>
            </div>
          </div>

          <!-- Section 2: Explore -->
          <div class="space-y-3">
            <span
              class="block text-[11px] font-semibold text-gray-450 dark:text-gray-500 uppercase tracking-wider pl-2"
              >Explore</span
            >
            <div class="space-y-1">
              <button
                on:click={() => {
                  mobileMenuOpen = false;
                  window.location.href = "/blog";
                }}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm {currentPath.startsWith(
                  '/blog',
                )
                  ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-semibold'
                  : ''}"
              >
                <span class="text-base leading-none">📝</span>
                {t($locale, "nav.blog")}
              </button>
              <button
                on:click={() => {
                  mobileMenuOpen = false;
                  window.location.href = "/celoteh";
                }}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm {currentPath.startsWith(
                  '/celoteh',
                )
                  ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-semibold'
                  : ''}"
              >
                <span class="text-base leading-none">🔥</span> Celoteh
              </button>
              <button
                on:click={() => {
                  mobileMenuOpen = false;
                  window.location.href = "/lounge";
                }}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm {currentPath.startsWith(
                  '/lounge',
                )
                  ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-semibold'
                  : ''}"
              >
                <span class="text-base leading-none">💬</span> Lounge
              </button>
              <button
                on:click={() => {
                  mobileMenuOpen = false;
                  window.location.href = "/now";
                }}
                class="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all font-medium text-sm {currentPath.startsWith(
                  '/now',
                )
                  ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-semibold'
                  : ''}"
              >
                <span class="text-base leading-none">📍</span>
                {t($locale, "nav.now")}
              </button>
            </div>
          </div>
        </div>

        <!-- Section 3: Settings -->
        <div
          class="space-y-4 pt-6 border-t border-gray-150/50 dark:border-white/5 mt-8"
        >
          <!-- Command Palette -->
          <button
            on:click={() => {
              mobileMenuOpen = false;
              openCommandPalette();
            }}
            class="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-zinc-900/40 hover:bg-gray-100 dark:hover:bg-zinc-900 border border-gray-200/50 dark:border-white/5 rounded-xl transition-all shadow-xs"
          >
            <span
              class="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300"
            >
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Quick Search
            </span>
            <kbd
              class="px-2 py-0.5 text-[9px] font-semibold text-gray-400 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-white/5 shadow-xs"
              >Ctrl K</kbd
            >
          </button>

          <!-- Toggle Theme switch -->
          <div
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/40 border border-gray-200/50 dark:border-white/5 rounded-xl shadow-xs"
          >
            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300"
              >Theme Mode</span
            >
            <button
              on:click={toggleDarkMode}
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none {darkMode
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-zinc-700'}"
              aria-label="Toggle dark mode"
            >
              <span
                class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out {darkMode
                  ? 'translate-x-5'
                  : 'translate-x-0'}"
              >
                <span
                  class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity {darkMode
                    ? 'opacity-0 duration-100'
                    : 'opacity-100 duration-200'}"
                >
                  <svg
                    class="h-3 w-3 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    ><path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05L5.753 4.343a1 1 0 10-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"
                    /></svg
                  >
                </span>
                <span
                  class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity {darkMode
                    ? 'opacity-100 duration-200'
                    : 'opacity-0 duration-100'}"
                >
                  <svg
                    class="h-3 w-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    ><path
                      d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                    /></svg
                  >
                </span>
              </span>
            </button>
          </div>

          <!-- Language Selector Segment -->
          <div
            class="p-3 bg-gray-50 dark:bg-zinc-900/40 border border-gray-200/50 dark:border-white/5 rounded-xl flex flex-col gap-2 shadow-xs"
          >
            <span
              class="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1"
              >Language</span
            >
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  {/if}
</nav>

<style>
  .nav-link {
    color: #374151;
    font-weight: 500;
    transition-property: color, background-color, border-color,
      text-decoration-color, fill, stroke;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .nav-link:hover {
    color: #2563eb;
  }

  .nav-link--active {
    color: #2563eb;
    font-weight: 600;
    position: relative;
  }

  .nav-link--active::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, #2563eb, #9333ea);
    border-radius: 9999px;
  }

  :global(.dark) .nav-link {
    color: #d1d5db;
  }

  :global(.dark) .nav-link:hover {
    color: #60a5fa;
  }

  :global(.dark) .nav-link--active {
    color: #60a5fa;
  }
</style>
