<script lang="ts">
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";
  import type { Blog } from "$lib/supabase/supabase";
  import PageViewTracker from "../../../../components/PageViewTracker.svelte";
  import ViewCounter from "../../../../components/ViewCounter.svelte";
  import type { PageData } from "../$types";
  import { JsonLd } from "svelte-meta-tags";
  import { onMount } from "svelte";
  import hljs from "highlight.js";
  import "highlight.js/styles/atom-one-dark.css";

  export let data: PageData & {
    blog: Blog;
    htmlContent: string;
    htmlContentEn?: string;
  };

  const slug = data.blog.slug;
  $: canonicalUrl = `${data.siteurl}/blog/${data.blog.slug}`;

  $: displayTitle = ($locale === "en" && data.blog.title_en) ? data.blog.title_en : data.blog.title;
  $: displayExcerpt = ($locale === "en" && data.blog.excerpt_en) ? data.blog.excerpt_en : (data.blog.excerpt || "");
  $: activeHtmlContent = ($locale === "en" && data.htmlContentEn) ? data.htmlContentEn : data.htmlContent;

  let linkCopied = false;
  let scrollProgress = 0;
  let toc: { id: string; text: string; level: number }[] = [];
  let isTocOpen = true;

  $: readingTimeMinutes = Math.max(
    1,
    Math.ceil(((data.blog.content || data.blog.excerpt || "").trim().split(/\s+/).filter(Boolean).length) / 180)
  );

  function formatDate(date: string) {
    if (!date) return "";
    return new Date(date).toLocaleDateString($locale === "en" ? "en-US" : "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatDateISO(date: string) {
    if (!date) return "";
    return new Date(date).toISOString();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      linkCopied = true;
      setTimeout(() => {
        linkCopied = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  onMount(() => {
    // Reading scroll progress
    function handleScroll() {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      scrollProgress = height > 0 ? (winScroll / height) * 100 : 0;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Syntax highlighting
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });

    // Copy buttons inside code snippets
    document.querySelectorAll(".copy-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const code = button.getAttribute("data-code");
        if (!code) return;

        try {
          const decodedCode = code
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");

          await navigator.clipboard.writeText(decodedCode);

          const copyIcon = button.querySelector(".copy-icon");
          const checkIcon = button.querySelector(".check-icon");
          const copyText = button.querySelector(".copy-text");

          if (copyIcon && checkIcon && copyText) {
            copyIcon.classList.add("hidden");
            checkIcon.classList.remove("hidden");
            copyText.textContent = "Copied!";

            setTimeout(() => {
              copyIcon.classList.remove("hidden");
              checkIcon.classList.add("hidden");
              copyText.textContent = "Copy";
            }, 2000);
          }
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      });
    });

    // Generate Table of Contents (TOC)
    const headings = document.querySelectorAll("[itemprop='articleBody'] h2, [itemprop='articleBody'] h3");
    const items: { id: string; text: string; level: number }[] = [];
    headings.forEach((heading, idx) => {
      let id = heading.id;
      if (!id) {
        id = `heading-${idx + 1}`;
        heading.id = id;
      }
      items.push({
        id,
        text: heading.textContent || "",
        level: heading.tagName.toLowerCase() === "h2" ? 2 : 3,
      });
    });
    toc = items;

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<!-- Top Reading Progress Indicator -->
<div 
  class="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 z-50 transition-all duration-150 ease-out" 
  style="width: {scrollProgress}%;"
></div>

<PageViewTracker {slug} />

<JsonLd
  schema={{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.blog.title,
    description: data.blog.excerpt,
    image: {
      "@type": "ImageObject",
      url: data.blog.cover_image || data.defaultimage,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Person",
      name: data.blog.author,
      url: `${data.siteurl}#about`,
    },
    publisher: {
      "@type": "Organization",
      name: "AbrorilHuda.me",
      logo: {
        "@type": "ImageObject",
        url: `${data.siteurl}/logo.png`,
        width: 600,
        height: 60,
      },
    },
    datePublished: formatDateISO(data.blog.created_at),
    dateModified: formatDateISO(data.blog.updated_at),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    wordCount: data.blog.content?.length || 0,
    articleBody:
      data.blog.content?.substring(0, 200).replace(/"/g, '\\"') + "...",
    inLanguage: $locale === "en" ? "en-US" : "id-ID",
  }}
/>

<div class="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
  <article itemscope itemtype="https://schema.org/BlogPosting" class="space-y-8">
    
    <!-- Floating / Sticky Navigation Back Link -->
    <nav class="flex items-center justify-between">
      <a
        href="/blog"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 transition-all shadow-xs group"
      >
        <svg class="w-4 h-4 text-zinc-500 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{t($locale, "blog.backToBlog")}</span>
      </a>

      <!-- Quick Share Pill -->
      <button
        on:click={copyLink}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        {#if linkCopied}
          <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-green-600 dark:text-green-400 font-semibold">{t($locale, "blog.copied")}</span>
        {:else}
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{t($locale, "blog.copyLink")}</span>
        {/if}
      </button>
    </nav>

    <!-- Header Section -->
    <header class="space-y-6 pt-4">
      <div class="flex flex-wrap items-center gap-3 text-xs">
        <span class="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
          Article
        </span>
        <span class="text-zinc-400 dark:text-zinc-500">•</span>
        <span class="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
          <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 0 0118 0z" />
          </svg>
          {t($locale, "blog.readingTime", { minutes: readingTimeMinutes })}
        </span>
      </div>

      <h1 
        itemprop="headline" 
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight"
      >
        {displayTitle}
      </h1>

      {#if displayExcerpt}
        <p
          itemprop="description"
          class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal border-l-2 border-blue-500 pl-4 py-1"
        >
          {displayExcerpt}
        </p>
      {/if}

      <!-- Author & Metadata Bar -->
      <div class="pt-4 border-t border-b border-zinc-200/80 dark:border-zinc-800/80 py-4 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {data.blog.author ? data.blog.author.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div itemprop="author" itemscope itemtype="https://schema.org/Person" class="font-bold text-zinc-900 dark:text-zinc-100">
              <span itemprop="name">{data.blog.author}</span>
            </div>
            <time
              itemprop="datePublished"
              datetime={formatDateISO(data.blog.created_at)}
              class="text-xs text-zinc-500 dark:text-zinc-400"
            >
              {formatDate(data.blog.created_at)}
            </time>
          </div>
        </div>

        <div class="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span itemprop="view" class="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1.5 rounded-full">
            <ViewCounter slug={data.blog.slug} />
          </span>
        </div>
      </div>
    </header>

    <!-- Hero Cover Image -->
    {#if data.blog.cover_image}
      <div class="rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl">
        <img
          src={data.blog.cover_image}
          alt={data.blog.title}
          itemprop="image"
          class="w-full max-h-[500px] object-cover"
        />
      </div>
    {/if}

    <!-- Table of Contents (TOC) Widget -->
    {#if toc.length > 1}
      <div class="my-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-3">
        <button 
          on:click={() => (isTocOpen = !isTocOpen)} 
          class="w-full flex items-center justify-between text-left font-bold text-sm text-zinc-900 dark:text-zinc-100"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h10" />
            </svg>
            {t($locale, "blog.tableOfContents")}
          </span>
          <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200 {isTocOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {#if isTocOpen}
          <nav class="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1 text-sm">
            {#each toc as item}
              <button
                on:click={() => scrollToSection(item.id)}
                class="block w-full text-left py-1 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 {item.level === 3 ? 'pl-4 text-xs' : 'font-medium'}"
              >
                • {item.text}
              </button>
            {/each}
          </nav>
        {/if}
      </div>
    {/if}

    <!-- Content - Pre-rendered server HTML -->
    <div
      itemprop="articleBody"
      class="prose prose-zinc lg:prose-lg dark:prose-invert max-w-none py-4 leading-relaxed"
    >
      {@html activeHtmlContent}
    </div>

    <!-- Redesigned Modern Share Box -->
    <div class="mt-16 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div class="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-zinc-50 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t($locale, "blog.shareArticle")}
            </h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Bagikan artikel ini kepada teman atau rekan tim Anda.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <!-- Copy Link -->
          <button
            on:click={copyLink}
            class="flex flex-col items-center justify-center gap-2 p-3.5 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
          >
            {#if linkCopied}
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-xs font-semibold text-green-600 dark:text-green-400">{t($locale, "blog.copied")}</span>
            {:else}
              <svg class="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{t($locale, "blog.copyLink")}</span>
            {/if}
          </button>

          <!-- Twitter / X -->
          <a
            href="https://twitter.com/intent/tweet?url={encodeURIComponent(canonicalUrl)}&text={encodeURIComponent(data.blog.title)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-3.5 bg-white dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-[#1DA1F2] transition-colors">Twitter</span>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(canonicalUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-3.5 bg-white dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-[#0A66C2] transition-colors">LinkedIn</span>
          </a>

          <!-- WhatsApp -->
          <a
            href="https://wa.me/?text={encodeURIComponent(data.blog.title + ' ' + canonicalUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-3.5 bg-white dark:bg-zinc-800/80 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
          </a>

          <!-- Facebook -->
          <a
            href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(canonicalUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center justify-center gap-2 p-3.5 bg-white dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-[#1877F2] transition-colors">Facebook</span>
          </a>
        </div>
      </div>
    </div>
  </article>
</div>

<style>
  :global(.prose) {
    color: inherit;
  }
  :global(.prose h1) {
    font-size: 2rem;
    font-weight: 800;
    margin-top: 2rem;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }
  :global(.prose h2) {
    font-size: 1.65rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    letter-spacing: -0.015em;
    scroll-margin-top: 5rem;
  }
  :global(.prose h3) {
    font-size: 1.35rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    scroll-margin-top: 5rem;
  }
  :global(.prose p) {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
  :global(.prose a) {
    color: #3b82f6;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 500;
    transition: color 0.15s ease;
  }
  :global(.prose a:hover) {
    color: #2563eb;
  }
  :global(.prose ul, .prose ol) {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }
  :global(.prose li) {
    margin-bottom: 0.5rem;
    line-height: 1.7;
  }
  :global(.prose code) {
    background-color: rgba(228, 228, 231, 0.6);
    padding: 0.2rem 0.4rem;
    border-radius: 0.375rem;
    font-size: 0.875em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  :global(.dark .prose code) {
    background-color: rgba(39, 39, 42, 0.8);
    color: #38bdf8;
  }
  :global(.prose pre) {
    background-color: #1e1e24;
    padding: 0;
    border-radius: 0.75rem;
    overflow-x: auto;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  :global(.prose pre code) {
    background-color: transparent;
    padding: 1.25rem;
    color: #e4e4e7;
    display: block;
  }
  :global(.prose blockquote) {
    border-left: 3px solid #3b82f6;
    padding-left: 1.25rem;
    font-style: italic;
    margin: 1.75rem 0;
    color: inherit;
    opacity: 0.9;
  }
  :global(.prose img) {
    border-radius: 1rem;
    margin: 2rem 0;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
  :global(.code-block-wrapper) {
    margin: 1.75rem 0;
    border-radius: 0.75rem;
    overflow: hidden;
  }
  :global(.code-header) {
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
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
  :global(.prose table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }
  :global(.prose thead) {
    background-color: rgba(244, 244, 245, 0.8);
  }
  :global(.dark .prose thead) {
    background-color: rgba(39, 39, 42, 0.8);
  }
  :global(.prose th) {
    text-align: left;
    padding: 0.75rem 1rem;
    font-weight: 600;
    border-bottom: 1px solid #e4e4e7;
  }
  :global(.dark .prose th) {
    border-bottom-color: #3f3f46;
  }
  :global(.prose td) {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e4e4e7;
  }
  :global(.dark .prose td) {
    border-bottom-color: #27272a;
  }
</style>
