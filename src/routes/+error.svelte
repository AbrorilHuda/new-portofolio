<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  let visible = false;
  
  onMount(() => {
    setTimeout(() => {
      visible = true;
    }, 100);
  });
  
  $: status = $page.status;
  $: message = $page.error?.message || 'Halaman tidak ditemukan';
</script>

<svelte:head>
  <title>{status} - Moh.AbrorilHuda</title>
</svelte:head>

<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex items-center justify-center px-6 relative overflow-hidden">
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

  <!-- Decorative floating elements -->
  <div class="absolute top-20 left-20 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl animate-float"></div>
  <div class="absolute bottom-20 right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl animate-float" style="animation-delay: 1s;"></div>

  <div class="max-w-4xl mx-auto text-center relative z-10">
    <!-- 404 Number with gradient and glow -->
    <div class="mb-8 {visible ? 'fade-in-up' : 'opacity-0'}">
      <h1 class="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine leading-none">
        {status}
      </h1>
      <div class="relative -mt-8">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-64 h-2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div class="space-y-4 mb-12 {visible ? 'fade-in-up delay-100' : 'opacity-0'}">
      <h2 class="text-3xl md:text-4xl font-bold">
        Oops! Halaman Tidak Ditemukan
      </h2>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {message}. Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-4 justify-center mb-12 {visible ? 'fade-in-up delay-200' : 'opacity-0'}">
      <a
        href="/"
        class="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all overflow-hidden"
      >
        <span class="relative z-10 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Kembali ke Beranda
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </a>
      
      <a
        href="/blog"
        class="px-8 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-all hover:scale-105 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        Lihat Blog
      </a>
    </div>

    <!-- Helpful Links -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto {visible ? 'fade-in-up delay-300' : 'opacity-0'}">
      {#each [
        { href: '/#about', label: 'Tentang Saya', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { href: '/#projects', label: 'Proyek', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { href: '/#experience', label: 'Pengalaman', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { href: '/#contact', label: 'Kontak', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
      ] as link}
        <a
          href={link.href}
          class="group p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 hover:-translate-y-1 card-shine"
        >
          <div class="flex flex-col items-center gap-2">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon}/>
            </svg>
            <span class="text-sm font-medium">{link.label}</span>
          </div>
        </a>
      {/each}
    </div>

    <!-- Fun fact -->
    <div class="mt-12 {visible ? 'fade-in-up delay-400' : 'opacity-0'}">
      <p class="text-sm text-gray-500 dark:text-gray-500 italic">
        "Tersesat itu wajar, yang penting tahu jalan pulang 🏠"
      </p>
    </div>
  </div>
</div>
