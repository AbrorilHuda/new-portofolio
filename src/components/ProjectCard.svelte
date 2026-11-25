<script lang="ts">
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/i18n';
  import type { Project } from '$lib/data/projects';

  export let project: Project;
  export let onOpenCaseStudy: ((project: Project) => void) | undefined = undefined;

  $: localizedDescription =
    $locale === 'en'
      ? project.description_en || project.description
      : project.description_id || project.description;

  $: localizedCategory =
    $locale === 'en'
      ? project.category_en || project.category_id
      : project.category_id || project.category_en;

  $: hasCaseStudy = Boolean(project.caseStudy_id || project.caseStudy_en);
</script>

<div class="group relative flex flex-col bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 card-shine">
  <!-- Shine overlay -->
  <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-20 pointer-events-none"></div>

  <!-- Animated border gradient -->
  <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style="background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6); background-size: 200% 100%; animation: shine 2s linear infinite; padding: 2px; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude;"></div>

  <div class="relative aspect-video h-52 sm:h-56 w-full overflow-hidden border-b border-gray-200/30 dark:border-white/5">
    <img
      src={project.image}
      alt={project.title}
      class="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
      loading="lazy"
    />
    <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {#if localizedCategory}
      <span class="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-950/80 text-white backdrop-blur-md border border-white/15">
        {localizedCategory}
      </span>
    {/if}

    {#if hasCaseStudy && onOpenCaseStudy}
      <button
        type="button"
        on:click={() => onOpenCaseStudy(project)}
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-5 py-2.5 bg-white/95 backdrop-blur-xs text-gray-900 rounded-xl font-semibold hover:bg-white flex items-center gap-2 hover:scale-[1.03] shadow-md cursor-pointer z-30 whitespace-nowrap"
      >
        <span>{$locale === 'en' ? 'Read Case Study' : 'Baca Studi Kasus'}</span>
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    {:else if project.link}
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-5 py-2.5 bg-white/90 backdrop-blur-xs text-gray-900 rounded-xl font-semibold hover:bg-white flex items-center gap-2 hover:scale-[1.03] shadow-md cursor-pointer z-30 whitespace-nowrap"
      >
        {t($locale, 'projects.viewProject')}
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    {/if}
  </div>

  <div class="p-6 flex flex-col flex-1 justify-between space-y-4 relative z-10">
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-display text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
      </div>
      <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
        {localizedDescription}
      </p>
    </div>

    <div class="space-y-4 pt-2">
      <div class="flex flex-wrap gap-2">
        {#each project.technologies as tech}
          <span class="px-2.5 py-0.5 bg-gray-100/50 dark:bg-zinc-900/60 text-gray-600 dark:text-gray-400 border border-gray-200/40 dark:border-white/5 rounded-md text-[11px] font-semibold transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">
            {tech}
          </span>
        {/each}
      </div>

      <div class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
        {#if hasCaseStudy && onOpenCaseStudy}
          <button
            type="button"
            on:click={() => onOpenCaseStudy(project)}
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>{$locale === 'en' ? 'Case Study' : 'Studi Kasus'}</span>
          </button>
        {/if}

        {#if project.link}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>{$locale === 'en' ? 'Live ↗' : 'Lihat ↗'}</span>
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>
