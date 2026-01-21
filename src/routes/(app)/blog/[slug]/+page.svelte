<script lang="ts">
  import type { Blog } from '$lib/supabase/supabase';
  import PageViewTracker from '../../../../components/PageViewTracker.svelte';
  import ViewCounter from '../../../../components/ViewCounter.svelte';
  import type { PageData } from '../$types';
  import { JsonLd } from 'svelte-meta-tags';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/atom-one-dark.css';

  export let data: PageData & {
    blog: Blog
    htmlContent: string
  };

  const slug = data.blog.slug;

  $: canonicalUrl = `${data.siteurl}/blog/${data.blog.slug}`;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatDateISO(date: string) {
    return new Date(date).toISOString();
  }

  let linkCopied = false;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      linkCopied = true;
      setTimeout(() => {
        linkCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }

  onMount(() => {
    // Initialize syntax highlighting
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });

    // Add copy functionality to all copy buttons
    document.querySelectorAll('.copy-btn').forEach((button) => {
      button.addEventListener('click', async () => {
        const code = button.getAttribute('data-code');
        if (!code) return;

        try {
          // Decode HTML entities
          const decodedCode = code
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");

          await navigator.clipboard.writeText(decodedCode);

          // Update button UI
          const copyIcon = button.querySelector('.copy-icon');
          const checkIcon = button.querySelector('.check-icon');
          const copyText = button.querySelector('.copy-text');

          if (copyIcon && checkIcon && copyText) {
            copyIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');
            copyText.textContent = 'Copied!';

            // Reset after 2 seconds
            setTimeout(() => {
              copyIcon.classList.remove('hidden');
              checkIcon.classList.add('hidden');
              copyText.textContent = 'Copy';
            }, 2000);
          }
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    });
  });
</script>

<PageViewTracker {slug} />

<JsonLd
  schema={{
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.blog.title,
    description: data.blog.excerpt,
    image: {
      '@type': 'ImageObject',
      url: data.blog.cover_image || data.defaultimage,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Person',
      name: data.blog.author,
      url: `${data.siteurl}/about`
    },
    publisher: {
      '@type': 'Organization',
      name: 'AbrorilHuda.me',
      logo: {
        '@type': 'ImageObject',
        url: `${data.siteurl}/logo.png`,
        width: 600,
        height: 60
      }
    },
    datePublished: formatDateISO(data.blog.created_at),
    dateModified: formatDateISO(data.blog.updated_at),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    wordCount: data.blog.content?.length || 0,
    articleBody: data.blog.content?.substring(0, 200).replace(/"/g, '\\"') + '...',
    inLanguage: 'id-ID'
  }}
/>

<div class="container mx-auto px-4 py-16 max-w-4xl">
  <article itemscope itemtype="https://schema.org/BlogPosting">
    <a href="/blog" class="inline-flex items-center text-blue-600 hover:underline mb-8 p-2">
      ← Kembali ke Blog
    </a>

    <!-- Cover Image -->
    {#if data.blog.cover_image}
      <img 
        src={data.blog.cover_image} 
        alt={data.blog.title}
        itemprop="image"
        class="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
      />
    {/if}

    <!-- Header -->
    <header class="mb-8">
      <h1 itemprop="headline" class="text-4xl md:text-5xl font-bold mb-4">{data.blog.title}</h1>
      
      <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400">
        <span itemprop="author" itemscope itemtype="https://schema.org/Person">
          <span itemprop="name">{data.blog.author}</span>
        </span>
        <span>•</span>
        <time itemprop="datePublished" datetime={formatDateISO(data.blog.created_at)}>
          {formatDate(data.blog.created_at)}
        </time>
        <span>•</span>
        <span itemprop="view">
          <ViewCounter slug={data.blog.slug}/>
        </span>
      </div>

      {#if data.blog.excerpt}
        <p itemprop="description" class="text-xl text-gray-600 dark:text-gray-400 mt-4">
          {data.blog.excerpt}
        </p>
      {/if}
    </header>

    <!-- Content - Pre-rendered dari server! -->
    <div itemprop="articleBody" class="prose prose-lg dark:prose-invert max-w-none">
      {@html data.htmlContent}
    </div>

    <!-- Share Buttons -->
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-blue-100 dark:border-gray-600">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Bagikan Blog
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <!-- Copy Link -->
          <button
            on:click={copyLink}
            class="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
          >
            {#if linkCopied}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-green-600 dark:text-green-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span class="text-xs font-medium text-green-600 dark:text-green-400">Copied!</span>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Copy Link</span>
            {/if}
          </button>

          <!-- Twitter -->
          <a
            href="https://twitter.com/intent/tweet?url={encodeURIComponent(canonicalUrl)}&text={encodeURIComponent(data.blog.title)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-6 h-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#1DA1F2] transition-colors">Twitter</span>
          </a>

          <!-- Facebook -->
          <a
            href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(canonicalUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#1877F2] transition-colors">Facebook</span>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(canonicalUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-6 h-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#0A66C2] transition-colors">LinkedIn</span>
          </a>

          <!-- WhatsApp -->
          <a
            href="https://wa.me/?text={encodeURIComponent(data.blog.title + ' ' + canonicalUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </article>
</div>

<style>
  :global(.prose) { color: inherit; }
  :global(.prose h1) { font-size: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
  :global(.prose h2) { font-size: 1.875rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.875rem; }
  :global(.prose h3) { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  :global(.prose p) { margin-bottom: 1.25rem; line-height: 1.75; }
  :global(.prose a) { color: #3b82f6; text-decoration: underline; }
  :global(.prose a:hover) { color: #2563eb; }
  :global(.prose ul, .prose ol) { margin-bottom: 1.25rem; padding-left: 1.5rem; }
  :global(.prose li) { margin-bottom: 0.5rem; }
  :global(.prose code) { background-color: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; }
  :global(.dark .prose code) { background-color: #374151; }
  :global(.prose pre) { background-color: #282c34; padding: 0; border-radius: 0 0 0.5rem 0.5rem; overflow-x: auto; margin-bottom: 1.25rem; }
  :global(.prose pre code) { background-color: transparent; padding: 1rem; color: #abb2bf; display: block; }
  :global(.prose blockquote) { border-left: 4px solid #3b82f6; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; }
  :global(.prose img) { border-radius: 0.5rem; margin: 1.5rem 0; }
  
  /* Code block wrapper styles */
  :global(.code-block-wrapper) {
    margin: 1.5rem 0;
  }
  
  :global(.code-header) {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  
  :global(.copy-btn) {
    cursor: pointer;
    background: none;
    border: none;
  }
  
  :global(.copy-btn:hover) {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
</style>