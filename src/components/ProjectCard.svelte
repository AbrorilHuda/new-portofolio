<script>
  export let project;
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/i18n';
</script>

<div class="group relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 card-shine">
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
    
    {#if project.link}
      <a
        href={project.link}
        target="_blank"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-5 py-2.5 bg-white/90 backdrop-blur-xs text-gray-900 rounded-xl font-semibold hover:bg-white flex items-center gap-2 hover:scale-[1.03] shadow-md cursor-pointer z-30"
      >
        {t($locale, 'projects.viewProject')}
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    {:else}
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-5 py-2.5 bg-zinc-950/80 backdrop-blur-xs text-white rounded-xl font-semibold flex items-center gap-2 border border-white/10 select-none shadow-md z-30"
      >
        <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
        <span class="text-xs">{$locale === 'en' ? 'Design Only' : 'Tahap Pengembangan'}</span>
      </div>
    {/if}
  </div>
  
  <div class="p-6 space-y-4 relative z-10">
    <div class="flex items-center justify-between gap-2">
      <h3 class="font-display text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
      {#if project.link}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          class="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
        >
          Lihat ↗
        </a>
      {/if}
    </div>
    <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-normal">{project.description}</p>
    
    <div class="flex flex-wrap gap-2 pt-2">
      {#each project.technologies as tech}
        <span class="px-2.5 py-0.5 bg-gray-100/50 dark:bg-zinc-900/60 text-gray-600 dark:text-gray-400 border border-gray-200/40 dark:border-white/5 rounded-md text-[11px] font-semibold transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">
          {tech}
        </span>
      {/each}
    </div>
  </div>
</div>