<script lang="ts">
  import type {  Blog } from '$lib/supabase/supabase';
  import PageViewTracker from '../../../../components/PageViewTracker.svelte';
  import ViewCounter from '../../../../components/ViewCounter.svelte';
  import type { PageData } from '../$types';

  export let data: PageData & {
    blog: Blog
    htmlContent: string
  };

  let siteUrl = 'https://abrorilhuda.me';
  const slug = data.blog.slug;

  $: canonicalUrl = `${siteUrl}/blog/${data.blog.slug}`;
  $: metaDescription = data.blog.excerpt || data.blog.content.substring(0, 160).replace(/[#*_\[\]]/g, '');
  $: metaImage = data.blog.cover_image || `${siteUrl}/og-default-image.png`;


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
</script>

<PageViewTracker {slug} />

<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{data.blog.title}</title>
    <meta name="title" content={data.blog.title} />
    <meta name="description" content={metaDescription} />
    <meta name="author" content={data.blog.author} />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={data.blog.title} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:image" content={metaImage} />
    <meta property="og:site_name" content="AbrorilHuda.me" />
    <meta property="article:published_time" content={formatDateISO(data.blog.created_at)} />
    <meta property="article:modified_time" content={formatDateISO(data.blog.updated_at)} />
    <meta property="article:author" content={data.blog.author} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={canonicalUrl} />
    <meta name="twitter:title" content={data.blog.title} />
    <meta name="twitter:description" content={metaDescription} />
    <meta name="twitter:image" content={metaImage} />
    <meta name="twitter:creator" content="@abror_dc" />

    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="blog, artikel, {data.blog.title}" />

    <!-- Schema.org JSON-LD for Article -->
    {@html `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${data.blog.title}",
        "description": "${metaDescription.replace(/"/g, '\\"')}",
        "image": "${metaImage}",
        "author": {
          "@type": "Person",
          "name": "${data.blog.author}"
        },
        "publisher": {
          "@type": "Abrorilhuda",
          "name": "AbrorilHuda.me",
          "logo": {
            "@type": "ImageObject",
            "url": "${siteUrl}/logo.png"
          }
        },
        "datePublished": "${formatDateISO(data.blog.created_at)}",
        "dateModified": "${formatDateISO(data.blog.updated_at)}",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${canonicalUrl}"
        }
      }
      </script>
    `}
</svelte:head>

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
      <h3 class="text-lg font-semibold mb-4">Bagikan Artikel</h3>
      <div class="flex flex-wrap gap-3">
        <a
          href="https://twitter.com/intent/tweet?url={encodeURIComponent(canonicalUrl)}&text={encodeURIComponent(data.blog.title)}"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2"
        >
          🐦 Twitter
        </a>
        <a
          href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(canonicalUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          📘 Facebook
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(canonicalUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
        >
          💼 LinkedIn
        </a>
        <a
          href="https://wa.me/?text={encodeURIComponent(data.blog.title + ' ' + canonicalUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          💬 WhatsApp
        </a>
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
  :global(.prose pre) { background-color: #1f2937; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1.25rem; }
  :global(.prose pre code) { background-color: transparent; padding: 0; color: #e5e7eb; }
  :global(.prose blockquote) { border-left: 4px solid #3b82f6; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; }
  :global(.prose img) { border-radius: 0.5rem; margin: 1.5rem 0; }
</style>