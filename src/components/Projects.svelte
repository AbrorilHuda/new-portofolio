<script>
  import ProjectCard from './ProjectCard.svelte';
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/i18n';
  import { projects } from '$lib/data/projects';
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
      {#each projects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </div>
</section>
