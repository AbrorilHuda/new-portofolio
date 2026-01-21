<script>
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  
  let visible = false;
  
  onMount(() => {
    setTimeout(() => {
      visible = true;
    }, 100);
  });
</script>

<section id="hero" class="min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20 relative overflow-hidden">
  <!-- Ripple Background Effect -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    {#each Array(6) as _, i}
      <div
        class="absolute rounded-full border border-blue-500/10 dark:border-blue-400/10 animate-ripple"
        style="
          width: {200 + i * 120}px;
          height: {200 + i * 120}px;
          animation-delay: {i * 0.4}s;
          opacity: {0.3 - i * 0.04};
        "
      ></div>
    {/each}
  </div>

  <div class="max-w-7xl mx-auto w-full relative z-10">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <!-- Left Content -->
      <div class="space-y-8">
        <div class="space-y-4">
          <h1 class="text-5xl md:text-7xl font-bold leading-tight {visible ? 'fade-in-up' : 'opacity-0'}">
            {t($locale, 'hero.titlePrefix')} <span class="inline-block bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">{t($locale, 'hero.titleHighlight')}</span>
          </h1>
          <p class="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 {visible ? 'fade-in-up delay-100' : 'opacity-0'}">
            {t($locale, 'hero.subtitle')}
          </p>
        </div>
        
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-xl {visible ? 'fade-in-up delay-200' : 'opacity-0'}">
          {t($locale, 'hero.description')}
        </p>
        
        <div class="flex flex-wrap gap-4 {visible ? 'fade-in-up delay-300' : 'opacity-0'}">
          <button
            on:click={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            class="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all overflow-hidden"
          >
            <span class="relative z-10">{t($locale, 'hero.viewProjects')}</span>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          <button
            on:click={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            class="px-8 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-all hover:scale-105"
          >
            {t($locale, 'hero.contactMe')}
          </button>
        </div>
        
        <!-- Social Links -->
        <div class="flex gap-4 {visible ? 'fade-in-up delay-400' : 'opacity-0'}">
          <a href="https://github.com/abrorilhuda" target="_blank" rel="noopener noreferrer" class="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110 hover:-translate-y-1" aria-label="GitHub">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/moh-abroril-huda" target="_blank" rel="noopener noreferrer" class="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110 hover:-translate-y-1" aria-label="LinkedIn">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="https://x.com/abror_dc" target="_blank" rel="noopener noreferrer" class="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110 hover:-translate-y-1" aria-label="Twitter">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <!-- Right Content - Profile Image -->
      <div class="relative {visible ? 'fade-in-up delay-200' : 'opacity-0'}">
        <div class="relative w-full aspect-square max-w-md mx-auto">
          <!-- Decorative elements with animation -->
          <div class="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl animate-float"></div>
          <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl animate-float" style="animation-delay: 1s;"></div>
          
          <!-- Profile Image with glow -->
          <div class="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl animate-glow">
            <img
              src="https://avatars.githubusercontent.com/u/114936122?v=4"
              alt="Profile"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <!-- Floating badge with animation -->
          <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-float" style="animation-delay: 0.5s;">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {t($locale, 'hero.availableForWork')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
