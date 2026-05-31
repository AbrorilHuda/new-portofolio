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
        <span>🛠️</span>
        <span class="text-xs">{$locale === 'en' ? 'Design Only' : 'Tahap Pengembangan'}</span>
      </div>
    {/if}
  </div>
  
  <div class="p-6 space-y-4 relative z-10">
    <h3 class="font-display text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
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