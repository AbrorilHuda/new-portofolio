<script lang="ts">
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import { PUBLIC_UPLOADCARE_PUBLIC_KEY } from '$env/static/public';

  export let data: PageData;
  export let form: ActionData;

  let title = (form as any)?.title || data.blog.title || '';
  let title_en = (form as any)?.title_en || data.blog.title_en || '';
  let slug = (form as any)?.slug || data.blog.slug || '';
  let content = (form as any)?.content || data.blog.content || '';
  let content_en = (form as any)?.content_en || data.blog.content_en || '';
  let excerpt = (form as any)?.excerpt || data.blog.excerpt || '';
  let excerpt_en = (form as any)?.excerpt_en || data.blog.excerpt_en || '';
  let coverImage = (form as any)?.coverImage || data.blog.cover_image || '';
  let author = (form as any)?.author || data.blog.author || 'Abrordc';
  let published = data.blog.published || false;
  let previewMode = false;
  let previewHtml = '';
  let submitting = false;

  // Language tab state (id or en)
  let activeLangTab: 'id' | 'en' = 'id';
  let translating = false;
  let translateStatus = '';

  // Textarea DOM reference for quick markdown insertion
  let idContentTextarea: HTMLTextAreaElement;
  let enContentTextarea: HTMLTextAreaElement;

  // Uploadcare File Uploader CDN
  const UC_JS = "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-inline.min.js";
  const UC_CSS = "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-regular.min.css";
  let ucReady = false;

  onMount(async () => {
    if (typeof window !== 'undefined' && !window.customElements.get('uc-config')) {
      const UC = await import(/* @vite-ignore */ UC_JS);
      UC.defineComponents(UC);
    }
    ucReady = true;
  });

  function handleUploadSuccess(e: Event) {
    const detail = (e as CustomEvent).detail;
    if (!detail?.uuid) return;
    coverImage = detail.cdnUrl || `https://${PUBLIC_UPLOADCARE_PUBLIC_KEY}.ucarecdn.net/${detail.uuid}/`;
  }

  function generateSlug() {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async function updatePreview() {
    const textToRender = activeLangTab === 'en' ? (content_en || content) : content;
    if (textToRender) {
      const rawHtml = await marked(textToRender);
      previewHtml = DOMPurify.sanitize(rawHtml);
    }
  }

  function insertMarkdown(prefix: string, suffix: string = '') {
    const targetTextarea = activeLangTab === 'id' ? idContentTextarea : enContentTextarea;
    if (!targetTextarea) return;

    const start = targetTextarea.selectionStart;
    const end = targetTextarea.selectionEnd;
    const currentVal = activeLangTab === 'id' ? content : content_en;
    const selectedText = currentVal.substring(start, end) || 'teks';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    if (activeLangTab === 'id') {
      content = newVal;
    } else {
      content_en = newVal;
    }

    setTimeout(() => {
      targetTextarea.focus();
      targetTextarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  }

  async function handleAutoTranslate() {
    if (!title && !content) {
      alert('Silakan isi Judul atau Konten Bahasa Indonesia terlebih dahulu!');
      return;
    }

    translating = true;
    translateStatus = 'Menerjemahkan artikel ke Bahasa Inggris...';

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, content })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        title_en = result.data.title_en || title_en;
        excerpt_en = result.data.excerpt_en || excerpt_en;
        content_en = result.data.content_en || content_en;
        
        activeLangTab = 'en';
        translateStatus = result.data.engine === 'ai' 
          ? 'Berhasil diterjemahkan dengan AI!' 
          : 'Berhasil diterjemahkan dengan Google Translate!';
      } else {
        alert(result.error || 'Gagal menerjemahkan artikel');
        translateStatus = '';
      }
    } catch (err: any) {
      console.error('Translation error:', err);
      alert('Terjadi kesalahan saat menerjemahkan artikel.');
      translateStatus = '';
    } finally {
      translating = false;
      setTimeout(() => {
        translateStatus = '';
      }, 4000);
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href={UC_CSS} />
</svelte:head>

<div class="max-w-7xl mx-auto space-y-6 pb-20">
  <!-- Top Command Bar & Breadcrumbs -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xs">
    <div class="flex items-center gap-3">
      <a 
        href="/admin/blogs" 
        class="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        title="Kembali ke Daftar Artikel"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <span>Admin</span>
          <span>/</span>
          <span>Articles</span>
          <span>/</span>
          <span class="text-blue-600 dark:text-blue-400">Edit</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Artikel</h1>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
      <!-- Status Badge -->
      <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border {published ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}">
        {published ? '● Published' : '○ Draft Mode'}
      </span>

      <!-- Auto-Translate Action Button -->
      <button
        type="button"
        on:click={handleAutoTranslate}
        disabled={translating || (!title && !content)}
        class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
      >
        {#if translating}
          <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Menerjemahkan...</span>
        {:else}
          <svg class="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          <span>Auto-Translate (ID → EN)</span>
        {/if}
      </button>
    </div>
  </div>

  <!-- Form Alert States -->
  {#if form?.error}
    <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-3">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{form.error}</span>
    </div>
  {/if}

  {#if translateStatus}
    <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center gap-3 animate-fade-in">
      <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      <span>{translateStatus}</span>
    </div>
  {/if}

  <!-- Main Editor Container -->
  <div class="rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xl overflow-hidden">
    
    <!-- Top Mode & Language Switcher Sub-Header -->
    <div class="border-b border-zinc-200/80 dark:border-zinc-800/80 px-6 py-3 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
      <!-- Edit / Preview Segment -->
      <div class="flex items-center p-1 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl text-xs font-semibold">
        <button
          type="button"
          on:click={() => (previewMode = false)}
          class="px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 {!previewMode ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          <span>Editor Mode</span>
        </button>
        <button
          type="button"
          on:click={() => { previewMode = true; updatePreview(); }}
          class="px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 {previewMode ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'}"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c1.07-3.291 4.201-5.75 7.964-5.75s6.894 2.459 7.964 5.75c-1.07 3.291-4.201 5.75-7.964 5.75s-6.894-2.459-7.964-5.75z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Live Preview</span>
        </button>
      </div>

      <!-- Language Selector Tabs -->
      <div class="flex items-center gap-2 p-1 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl">
        <button
          type="button"
          on:click={() => (activeLangTab = 'id')}
          class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 {activeLangTab === 'id' ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
        >
          <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">ID</span>
          <span>Indonesia</span>
        </button>
        <button
          type="button"
          on:click={() => (activeLangTab = 'en')}
          class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 {activeLangTab === 'en' ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}"
        >
          <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-500 border border-purple-500/20">EN</span>
          <span>English</span>
          {#if title_en || content_en}
            <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Form Content Area -->
    <div class="p-6 md:p-8">
      {#if !previewMode}
        <form
          method="POST"
          action="?/update"
          use:enhance={() => {
            submitting = true;
            return async ({ update }) => {
              await update();
              submitting = false;
            };
          }}
          class="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <!-- LEFT COLUMN: Main Writing Editor (7 Cols) -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- INDONESIAN INPUTS (DOM persistent via CSS hidden) -->
            <div class="space-y-6 {activeLangTab === 'id' ? '' : 'hidden'}">
              <div>
                <label for="title" class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Judul Artikel (ID) *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  bind:value={title}
                  on:input={generateSlug}
                  class="w-full px-4 py-3 text-lg md:text-xl font-extrabold rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                  placeholder="Ketik judul artikel di sini..."
                />
              </div>

              <div>
                <label for="excerpt" class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Ringkasan / Excerpt (ID)
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  bind:value={excerpt}
                  rows="2"
                  class="w-full px-4 py-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all leading-relaxed"
                  placeholder="Ringkasan singkat untuk tampilan kartu blog..."
                ></textarea>
              </div>

              <!-- Quick Markdown Toolbar & Content Area -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label for="content" class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Konten Artikel (ID - Markdown) *
                  </label>
                  
                  <!-- Markdown Toolbar Hints -->
                  <div class="flex items-center gap-1">
                    <button type="button" on:click={() => insertMarkdown('# ')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white transition-colors" title="Heading 1"># H1</button>
                    <button type="button" on:click={() => insertMarkdown('## ')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white transition-colors" title="Heading 2">## H2</button>
                    <button type="button" on:click={() => insertMarkdown('**', '**')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white transition-colors" title="Bold">**B**</button>
                    <button type="button" on:click={() => insertMarkdown('*', '*')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white transition-colors" title="Italic">*I*</button>
                    <button type="button" on:click={() => insertMarkdown('\n```javascript\n', '\n```\n')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white transition-colors" title="Code Block">``` Code</button>
                    <button type="button" on:click={() => insertMarkdown('\n- ')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500 hover:text-white transition-colors" title="List">- List</button>
                  </div>
                </div>

                <textarea
                  id="content"
                  name="content"
                  bind:this={idContentTextarea}
                  bind:value={content}
                  rows="18"
                  class="w-full px-4 py-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm leading-relaxed placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                ></textarea>
              </div>
            </div>

            <!-- ENGLISH INPUTS (DOM persistent via CSS hidden) -->
            <div class="space-y-6 {activeLangTab === 'en' ? '' : 'hidden'}">
              <div class="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
                <span>Versi Bahasa Inggris dapat ditulis manual atau dibuat otomatis dengan AI Translate.</span>
                <button
                  type="button"
                  on:click={handleAutoTranslate}
                  disabled={translating}
                  class="font-bold underline hover:text-purple-900 dark:hover:text-white cursor-pointer flex items-center gap-1"
                >
                  <span>Generate Ulang</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>

              <div>
                <label for="title_en_input" class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Judul Artikel (English)
                </label>
                <input
                  id="title_en_input"
                  name="title_en"
                  type="text"
                  bind:value={title_en}
                  class="w-full px-4 py-3 text-lg md:text-xl font-extrabold rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
                  placeholder="English title..."
                />
              </div>

              <div>
                <label for="excerpt_en_input" class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Summary / Excerpt (English)
                </label>
                <textarea
                  id="excerpt_en_input"
                  name="excerpt_en"
                  bind:value={excerpt_en}
                  rows="2"
                  class="w-full px-4 py-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all leading-relaxed"
                  placeholder="English short summary..."
                ></textarea>
              </div>

              <!-- Quick Markdown Toolbar & Content Area (EN) -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label for="content_en_input" class="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Article Content (English - Markdown)
                  </label>
                  
                  <!-- Markdown Toolbar Hints -->
                  <div class="flex items-center gap-1">
                    <button type="button" on:click={() => insertMarkdown('# ')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-500 hover:text-white transition-colors"># H1</button>
                    <button type="button" on:click={() => insertMarkdown('## ')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-500 hover:text-white transition-colors">## H2</button>
                    <button type="button" on:click={() => insertMarkdown('**', '**')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-500 hover:text-white transition-colors">**B**</button>
                    <button type="button" on:click={() => insertMarkdown('*', '*')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-500 hover:text-white transition-colors">*I*</button>
                    <button type="button" on:click={() => insertMarkdown('\n```javascript\n', '\n```\n')} class="px-2 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-500 hover:text-white transition-colors">``` Code</button>
                  </div>
                </div>

                <textarea
                  id="content_en_input"
                  name="content_en"
                  bind:this={enContentTextarea}
                  bind:value={content_en}
                  rows="18"
                  class="w-full px-4 py-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm leading-relaxed placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
                  placeholder="English markdown content..."
                ></textarea>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Metadata & Publishing Controls Sidebar (5 Cols) -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- URL Slug Card -->
            <div class="p-5 rounded-2xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Permalink / URL Slug
              </h3>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                bind:value={slug}
                class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="artikel-slug"
              />
              <p class="text-[11px] text-zinc-400 font-mono overflow-x-auto whitespace-nowrap">
                Live URL: <span class="text-blue-500">/blog/{slug || 'artikel-slug'}</span>
              </p>
            </div>

            <!-- Cover Image Preview & Uploadcare Widget Card -->
            <div class="p-5 rounded-2xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Cover Image (Uploadcare / URL)
                </h3>
                {#if coverImage}
                  <button
                    type="button"
                    on:click={() => coverImage = ''}
                    class="text-[11px] font-semibold text-red-500 hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                {/if}
              </div>

              <!-- Live Thumbnail Preview Box & Uploadcare Widget -->
              <div class="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 relative flex items-center justify-center group">
                {#if coverImage}
                  <img src={coverImage} alt="Cover Preview" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      on:click={() => coverImage = ''}
                      class="px-3 py-1.5 bg-white text-zinc-900 rounded-lg text-xs font-bold shadow-md cursor-pointer"
                    >
                      Ganti / Upload Ulang
                    </button>
                  </div>
                {:else if ucReady}
                  <div class="p-3 w-full text-center">
                    <uc-config
                      ctx-name="edit-blog-cover"
                      pubkey={PUBLIC_UPLOADCARE_PUBLIC_KEY}
                      source-list="local, camera, gdrive, url"
                      multiple="false"
                    ></uc-config>
                    <uc-file-uploader-regular
                      ctx-name="edit-blog-cover"
                      class="uc-light dark:uc-dark"
                      on:file-upload-success={handleUploadSuccess}
                    ></uc-file-uploader-regular>
                  </div>
                {:else}
                  <div class="text-center p-4 text-zinc-400 text-xs space-y-1">
                    <svg class="w-8 h-8 mx-auto opacity-40 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Memuat Uploadcare widget...</p>
                  </div>
                {/if}
              </div>

              <!-- Manual Input URL Option -->
              <div>
                <label for="cover_image" class="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Atau masukkan URL Gambar secara manual:
                </label>
                <input
                  id="cover_image"
                  name="cover_image"
                  type="url"
                  bind:value={coverImage}
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>

            <!-- Author & Metadata Card -->
            <div class="p-5 rounded-2xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Author & Penulis
              </h3>
              <input
                id="author"
                name="author"
                type="text"
                bind:value={author}
                class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <!-- Publishing Toggle Card -->
            <div class="p-5 rounded-2xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Status Dipublikasikan</h4>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400">Artikel akan langsung dapat dibaca publik.</p>
                </div>
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  bind:checked={published}
                  class="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <!-- Primary Action Buttons -->
            <div class="pt-4 flex items-center justify-end gap-3">
              <a
                href="/admin/blogs"
                class="px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
              >
                Batal
              </a>
              <button
                type="submit"
                disabled={submitting}
                class="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {#if submitting}
                  <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Mempublikasikan...</span>
                {:else}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Simpan Perubahan</span>
                {/if}
              </button>
            </div>

          </div>
        </form>

      {:else}
        <!-- Live Markdown Preview -->
        <div class="prose prose-zinc lg:prose-lg dark:prose-invert max-w-none">
          <h1>{activeLangTab === 'en' ? (title_en || title) : title}</h1>
          {#if activeLangTab === 'en' ? (excerpt_en || excerpt) : excerpt}
            <p class="text-zinc-600 dark:text-zinc-400 text-base italic border-l-2 border-blue-500 pl-4">
              {activeLangTab === 'en' ? (excerpt_en || excerpt) : excerpt}
            </p>
          {/if}
          {@html previewHtml}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.prose) { color: inherit; }
  :global(.prose h1) { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; }
  :global(.prose h2) { font-size: 1.75rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.875rem; }
  :global(.prose h3) { font-size: 1.35rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  :global(.prose p) { margin-bottom: 1.25rem; line-height: 1.75; }
  :global(.prose a) { color: #3b82f6; text-decoration: underline; }
  :global(.prose code) { background-color: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; }
  :global(.dark .prose code) { background-color: #27272a; }
  :global(.prose pre) { background-color: #18181b; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; }
</style>