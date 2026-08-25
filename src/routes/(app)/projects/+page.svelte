<script lang="ts">
  import ProjectCard from '$lib/../components/ProjectCard.svelte';
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/i18n';
  import type { PageData } from './$types';

  export let data: PageData;

  $: allProjects = data.projects;

  let searchQuery = '';
  let selectedTech = 'All';

  // Extract unique technology tags across all projects
  $: availableTechs = [
    'All',
    ...Array.from(
      new Set(
        allProjects.flatMap((p) => p.technologies || [])
      )
    )
  ];

  // Filter projects dynamically by search query and selected technology filter
  $: filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTech =
      selectedTech === 'All' ||
      project.technologies.includes(selectedTech);

    return matchesSearch && matchesTech;
  });
</script>

<svelte:head>
  <title>{$locale === 'en' ? 'My Projects' : 'Proyek Saya'} - Moh.AbrorilHuda</title>
  <meta
    name="description"
    content="Kumpulan proyek web, aplikasi mobile, dan solusi digital karya Moh.AbrorilHuda."
  />
</svelte:head>

<div class="min-h-screen pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
  <!-- Page Header -->
  <div class="text-center mb-12 space-y-4">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
      <span>Portfolio Showcase</span>
      <span>•</span>
      <span>{allProjects.length} {$locale === 'en' ? 'Projects' : 'Proyek'}</span>
    </div>

    <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
      {t($locale, 'projects.titlePrefix')} <span class="bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">{t($locale, 'projects.titleHighlight')}</span>
    </h1>

    <p class="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
      {$locale === 'en'
        ? 'A showcase of digital products, full-stack web applications, and community platforms built with modern tools.'
        : 'Kumpulan produk digital, aplikasi web full-stack, dan platform komunitas yang saya bangun.'}
    </p>
  </div>

  <!-- Search & Technology Filter Bar -->
  <div class="mb-12 space-y-6">
    <!-- Search Bar -->
    <div class="max-w-xl mx-auto relative">
      <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder={$locale === 'en' ? 'Search project by name or tech...' : 'Cari proyek berdasarkan nama atau teknologi...'}
        class="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
      />
      {#if searchQuery}
        <button
          type="button"
          on:click={() => (searchQuery = '')}
          class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
      {/if}
    </div>

    <!-- Tech Filter Pills -->
    {#if availableTechs.length > 1}
      <div class="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {#each availableTechs as tech}
          <button
            type="button"
            on:click={() => (selectedTech = tech)}
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border
              {selectedTech === tech
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white/60 dark:bg-zinc-900/60 text-gray-600 dark:text-gray-400 border-gray-200/60 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-zinc-800'}"
          >
            {tech === 'All' ? ($locale === 'en' ? 'All Projects' : 'Semua Proyek') : tech}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Projects Grid -->
  {#if filteredProjects.length === 0}
    <div class="py-20 text-center bg-gray-50/50 dark:bg-zinc-900/30 rounded-3xl border border-gray-200/50 dark:border-white/5 max-w-xl mx-auto space-y-3">
      <svg class="w-12 h-12 text-gray-400 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-base font-semibold text-gray-900 dark:text-white">
        {$locale === 'en' ? 'No projects found' : 'Proyek tidak ditemukan'}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {$locale === 'en' ? 'Try adjusting your search query or technology filter.' : 'Coba ubah kata kunci pencarian atau filter teknologi.'}
      </p>
      <button
        type="button"
        on:click={() => { searchQuery = ''; selectedTech = 'All'; }}
        class="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        {$locale === 'en' ? 'Reset Filters' : 'Reset Filter'}
      </button>
    </div>
  {:else}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each filteredProjects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>
  {/if}
</div>
