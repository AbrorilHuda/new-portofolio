<script lang="ts">
  export let darkMode = false;
  export let toggleDarkMode;
  
  let mobileMenuOpen = false;
  let scrolled = false;

  function handleScroll() {
    scrolled = window.scrollY > 20;
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      mobileMenuOpen = false;
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
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
        on:click={() => window.location.href = '/'}
        class="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer"
      >
        Abrorilhuda.me
      </button>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-8">
        <button on:click={() => scrollToSection('about')} class="nav-link">About</button>
        <button on:click={() => scrollToSection('projects')} class="nav-link">Projects</button>
        <button on:click={() => scrollToSection('experience')} class="nav-link">Experience</button>
        <button on:click={() => scrollToSection('contact')} class="nav-link">Contact</button>
        <button on:click={() => window.location.href = "/blog"} class="nav-link">Blog</button>
        
        <!-- Dark Mode Toggle -->
        <button
          on:click={toggleDarkMode}
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {#if darkMode}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
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
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div class="px-6 py-4 space-y-3">
        <button on:click={() => scrollToSection('about')} class="block w-full text-left py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</button>
        <button on:click={() => scrollToSection('projects')} class="block w-full text-left py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</button>
        <button on:click={() => scrollToSection('experience')} class="block w-full text-left py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Experience</button>
        <button on:click={() => scrollToSection('contact')} class="block w-full text-left py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</button>
        <button on:click={() => window.location.href = "/blog"} class="block w-full text-left py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</button>
        <button on:click={toggleDarkMode} class="flex items-center gap-2 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <span>Dark Mode</span>
          <div class="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative transition-colors">
            <div class="absolute top-1 {darkMode ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full transition-all"></div>
          </div>
        </button>
      </div>
    </div>
  {/if}
</nav>

<style>
  .nav-link {
    color: #374151; 
    font-weight: 500; 
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .nav-link:hover {
    color: #2563EB; 
  }

  
  :global(.dark) .nav-link {
    color: #D1D5DB;
  }

  :global(.dark) .nav-link:hover {
    color: #60A5FA;
  }
</style>
