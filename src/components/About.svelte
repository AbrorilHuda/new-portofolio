<script lang="ts">
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/i18n';

  const skills = [
    { name: 'JavaScript', category: 'Frontend', color: '#F7DF1E' },
    { name: 'TypeScript', category: 'Language', color: '#3178C6' },
    { name: 'React', category: 'Frontend', color: '#61DAFB' },
    { name: 'Svelte', category: 'Frontend', color: '#FF3E00' },
    { name: 'Node.js', category: 'Backend', color: '#339933' },
    { name: 'Tailwind CSS', category: 'Styling', color: '#06B6D4' },
    { name: 'PostgreSQL', category: 'Database', color: '#336791' },
    { name: 'Git', category: 'Tools', color: '#F05032' },
  ];

  let visible = $state(false);
  let element = $state<HTMLElement>();

  $effect(() => {
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        visible = true;
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  });
</script>

<section id="about" bind:this={element} class="py-20 md:py-32 px-6 lg:px-8 bg-transparent overflow-hidden">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-16 transition-all duration-700 ease-out {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}">
      <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-zinc-100">
        {t($locale, 'about.titlePrefix')} <span class="bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">{t($locale, 'about.titleHighlight')}</span>
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">
        {t($locale, 'about.tagline')}
      </p>
    </div>
    
    <!-- Bento Grid Container -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Bento 1: Main Bio & Philosophy (Span 2 cols on desktop) -->
      <div class="md:col-span-2 p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-gray-200/60 dark:border-white/5 shadow-sm space-y-6 transition-all duration-500 hover:border-blue-500/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Moh. Abroril Huda</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Full-Stack Engineer & Ecosystem Builder</p>
          </div>
        </div>

        <div class="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>{t($locale, 'about.description1')}</p>
          <p>{t($locale, 'about.description2')}</p>
        </div>

        <div class="flex flex-wrap gap-2.5 pt-2">
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
            ⚡ Full-Stack Web Development
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            📱 Cross-Platform Mobile
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">
            🤝 Community Leadership
          </span>
        </div>
      </div>

      <!-- Bento 2: Community Leadership & Impact (Span 1 col) -->
      <div class="p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-gray-200/60 dark:border-white/5 shadow-sm space-y-5 flex flex-col justify-between transition-all duration-500 hover:border-purple-500/20">
        <div>
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Community Builder</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Membangun ekosistem developer lokal dan mengorganisasi komunitas IT di Madura.
          </p>
        </div>

        <div class="space-y-3 pt-3">
          <div class="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">MaduraDev</p>
              <p class="text-[10px] text-gray-500">Founder & Organizer</p>
            </div>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">Active</span>
          </div>

          <div class="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-900 dark:text-white">DCN UNIRA</p>
              <p class="text-[10px] text-gray-500">Co-Founder & Lead</p>
            </div>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">Lead</span>
          </div>
        </div>
      </div>

      <!-- Bento 3: Timezone & Location Widget (Span 1 col) -->
      <div class="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-gray-200/60 dark:border-white/5 shadow-sm flex flex-col justify-between transition-all duration-500 hover:border-emerald-500/20">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</span>
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        <div class="my-4">
          <p class="text-2xl font-bold font-display text-gray-900 dark:text-white">Madura, ID 🇮🇩</p>
          <p class="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">UTC+07:00 • Western Indonesia</p>
        </div>

        <div class="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-400">
          💼 Open for Remote Work & Client Projects
        </div>
      </div>

      <!-- Bento 4: Tech Stack Grid (Span 2 cols) -->
      <div class="md:col-span-2 p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-gray-200/60 dark:border-white/5 shadow-sm space-y-6 transition-all duration-500 hover:border-cyan-500/20">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-gray-900 dark:text-white font-display">Technical Toolkit</h3>
          <span class="text-xs font-mono text-gray-400">Modern Stack</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {#each skills as skill}
            <div class="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-zinc-950/80 border border-gray-100 dark:border-white/5 flex items-center gap-3 hover:border-blue-500/30 transition-all group">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: {skill.color}"></span>
              <div>
                <p class="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{skill.name}</p>
                <p class="text-[10px] font-mono text-gray-400">{skill.category}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

    </div>
  </div>
</section>
