<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { locale } from '$lib/stores/locale';
  import type { Project } from '$lib/data/projects';

  export let project: Project | null = null;
  export let onClose: () => void = () => {};

  $: caseStudy =
    project && ($locale === 'en' ? project.caseStudy_en || project.caseStudy_id : project.caseStudy_id || project.caseStudy_en);

  $: category =
    project && ($locale === 'en' ? project.category_en || project.category_id : project.category_id || project.category_en);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && project) {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if project && caseStudy}
  <div
    class="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/70 backdrop-blur-md"
    on:click={onClose}
    transition:fade={{ duration: 180 }}
    role="presentation"
  >
    <div
      class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 shadow-2xl"
      on:click|stopPropagation
      on:keydown|stopPropagation
      transition:fly={{ y: 20, duration: 220 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      tabindex="-1"
    >
      <!-- Cover Header -->
      <div class="relative aspect-video max-h-64 w-full overflow-hidden border-b border-gray-200/70 dark:border-white/10">
        <img
          src={project.image}
          alt={project.title}
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent"></div>

        <button
          type="button"
          on:click={onClose}
          class="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer"
          aria-label={$locale === 'en' ? 'Close case study' : 'Tutup studi kasus'}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="absolute bottom-4 left-6 right-6 text-white">
          {#if category}
            <span class="inline-block px-2.5 py-0.5 mb-2 rounded-full text-[11px] font-semibold bg-blue-600/90 text-white">
              {category}
            </span>
          {/if}
          <h3 id="case-study-title" class="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            {project.title}
          </h3>
        </div>
      </div>

      <!-- Case Study Body -->
      <div class="p-6 sm:p-8 space-y-6">
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {$locale === 'en' ? 'Problem' : 'Masalah'}
          </h4>
          <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {caseStudy.problem}
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {$locale === 'en' ? 'My Role' : 'Peran Saya'}
          </h4>
          <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {caseStudy.role}
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {$locale === 'en' ? 'Solution' : 'Solusi'}
          </h4>
          <ul class="space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 list-disc pl-5 leading-relaxed">
            {#each caseStudy.solution as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>

        <div class="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 space-y-1.5">
          <h4 class="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            {$locale === 'en' ? 'Result & Impact' : 'Hasil & Dampak'}
          </h4>
          <p class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {caseStudy.impact}
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {$locale === 'en' ? 'Tech Stack' : 'Teknologi'}
          </h4>
          <div class="flex flex-wrap gap-2">
            {#each project.technologies as tech}
              <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200/70 dark:border-white/10">
                {tech}
              </span>
            {/each}
          </div>
        </div>

        <!-- Links Footer -->
        <div class="pt-4 border-t border-gray-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-3">
            {#if project.link}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                <span>{$locale === 'en' ? 'Visit Live Site' : 'Buka Situs Live'}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            {/if}
            {#if project.repoUrl}
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <span>{$locale === 'en' ? 'Source Code' : 'Kode Sumber'}</span>
              </a>
            {/if}
          </div>

          <button
            type="button"
            on:click={onClose}
            class="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            {$locale === 'en' ? 'Close' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
