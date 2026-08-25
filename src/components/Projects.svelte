<script>
  import ProjectCard from './ProjectCard.svelte';
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/i18n';
  import { projects as fallbackProjects } from '$lib/data/projects';

  export let projects = fallbackProjects;
  $: displayedProjects = projects.slice(0, 6);
</script>

<section id="projects" class="py-20 md:py-32 px-6 lg:px-8 bg-transparent">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t($locale, 'projects.titlePrefix')} <span class="bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">{t($locale, 'projects.titleHighlight')}</span>
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
        {t($locale, 'projects.tagline')}
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
      {#each displayedProjects as project}
        <ProjectCard {project} />
      {/each}
    </div>

    {#if projects.length > 0}
      <div class="mt-14 text-center">
        <a
          href="/projects"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl font-semibold hover:scale-[1.02] active:scale-98 transition-all shadow-sm"
        >
          <span>{t($locale, 'projects.viewAll')}</span>
          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    {/if}
  </div>
</section>

