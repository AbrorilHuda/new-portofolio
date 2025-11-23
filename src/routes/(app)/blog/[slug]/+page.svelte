<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase, type Blog } from '$lib/supabase/supabase';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  let blog: Blog | null = null;
  let loading = true;
  let htmlContent = '';

  let siteUrl = 'https://yourdomain.com';
  let canonicalUrl = '';
  let metaDescription = '';
  let metaImage = '';

  onMount(async () => {
    const slug = $page.params.slug;
    
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (data) {
      blog = data;
      const rawHtml = await marked(blog!.content);
      htmlContent = DOMPurify.sanitize(rawHtml);

      canonicalUrl = `${siteUrl}/blog/${blog!.slug}`;
      metaDescription = blog!.excerpt || blog!.content.substring(0, 160).replace(/[#*_\[\]]/g, '');
      metaImage = blog!.cover_image || `${siteUrl}/og-default-image.png`;
    }
    
    loading = false;
  });

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

<svelte:head>
  {#if blog}
    <!-- Primary Meta Tags -->
    <title>{blog.title}</title>
    <meta name="title" content={blog.title} />
    <meta name="description" content={metaDescription} />
    <meta name="author" content={blog.author} />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={blog.title} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:image" content={metaImage} />
    <meta property="og:site_name" content="AbrorilHuda.me" />
    <meta property="article:published_time" content={formatDateISO(blog.created_at)} />
    <meta property="article:modified_time" content={formatDateISO(blog.updated_at)} />
    <meta property="article:author" content={blog.author} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={canonicalUrl} />
    <meta name="twitter:title" content={blog.title} />
    <meta name="twitter:description" content={metaDescription} />
    <meta name="twitter:image" content={metaImage} />
    <meta name="twitter:creator" content="@abror_dc" />

    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="blog, artikel, {blog.title}" />

    <!-- Schema.org JSON-LD for Article -->
    {@html `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${blog.title}",
        "description": "${metaDescription.replace(/"/g, '\\"')}",
        "image": "${metaImage}",
        "author": {
          "@type": "Person",
          "name": "${blog.author}"
        },
        "publisher": {
          "@type": "Abrorilhuda",
          "name": "AbrorilHuda.me",
          "logo": {
            "@type": "ImageObject",
            "url": "${siteUrl}/logo.png"
          }
        },
        "datePublished": "${formatDateISO(blog.created_at)}",
        "dateModified": "${formatDateISO(blog.updated_at)}",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${canonicalUrl}"
        }
      }
      <\/script>
    `}
  {:else}
    <title>Loading... | Blog</title>
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<div class="container mx-auto px-4 py-20 max-w-4xl">
  {#if loading}
    <div class="animate-pulse">
      <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
      <div class="h-64 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
      <div class="space-y-3">
        {#each Array(5) as _}
          <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        {/each}
      </div>
    </div>
  {:else if !blog}
    <div class="text-center py-16">
      <h1 class="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">Artikel yang Anda cari tidak ada atau belum dipublikasikan.</p>
      <a href="/blog" class="text-blue-600 hover:underline">← Kembali ke Blog</a>
    </div>
  {:else}
    <article>
      <!-- Back button -->
      <a href="/blog" class="inline-flex items-center text-blue-600 hover:underline mb-8">
        ← Kembali ke Blog
      </a>

      <!-- Cover Image -->
      {#if blog.cover_image}
        <img 
          src={blog.cover_image} 
          alt={blog.title}
          class="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />
      {/if}

      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
        
        <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <span>{blog.author}</span>
          <span>•</span>
          <time datetime={blog.created_at}>{formatDate(blog.created_at)}</time>
        </div>
      </header>

      <!-- Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none">
        {@html htmlContent}
      </div>
    </article>
  {/if}
</div>

<style>
  :global(.prose) {
    color: inherit;
  }
  
  :global(.prose h1) {
    font-size: 2.25rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  :global(.prose h2) {
    font-size: 1.875rem;
    font-weight: 700;
    margin-top: 1.75rem;
    margin-bottom: 0.875rem;
  }
  
  :global(.prose h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  :global(.prose p) {
    margin-bottom: 1.25rem;
    line-height: 1.75;
  }
  
  :global(.prose a) {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  :global(.prose a:hover) {
    color: #2563eb;
  }
  
  :global(.prose ul, .prose ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }
  
  :global(.prose li) {
    margin-bottom: 0.5rem;
  }
  
  :global(.prose code) {
    background-color: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
  
  :global(.dark .prose code) {
    background-color: #374151;
  }
  
  :global(.prose pre) {
    background-color: #1f2937;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1.25rem;
  }
  
  :global(.prose pre code) {
    background-color: transparent;
    padding: 0;
    color: #e5e7eb;
  }
  
  :global(.prose blockquote) {
    border-left: 4px solid #3b82f6;
    padding-left: 1rem;
    font-style: italic;
    margin: 1.5rem 0;
  }
  
  :global(.prose img) {
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }
</style>