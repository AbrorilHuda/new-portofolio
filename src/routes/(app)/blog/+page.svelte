<script lang="ts">
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { supabase, type Blog } from "$lib/supabase/supabase";
  import Pagination from "../../../components/Pagination.svelte";
  import ViewCounter from "../../../components/ViewCounter.svelte";

  let blogs: Blog[] = [];
  let loading = true;
  let currentPage = 1;
  let searchQuery = "";
  const postsPerPage = 6;

  // Sync page from URL query parameter
  $: {
    const pageParam = $page.url.searchParams.get("page");
    currentPage = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  }

  onMount(async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (data) {
      blogs = data;
    }
    loading = false;
  });

  // Client-side search filtering
  $: filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      blog.title.toLowerCase().includes(query) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(query)) ||
      (blog.author && blog.author.toLowerCase().includes(query))
    );
  });

  // Featured post logic (only on page 1 with no search query)
  $: isDefaultView = !searchQuery.trim() && currentPage === 1;
  $: featuredBlog =
    isDefaultView && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  $: listableBlogs =
    isDefaultView && featuredBlog ? filteredBlogs.slice(1) : filteredBlogs;

  // Pagination for listable blogs
  $: totalPages = Math.max(1, Math.ceil(listableBlogs.length / postsPerPage));
  $: paginatedBlogs = listableBlogs.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  function handlePageChange(newPage: number) {
    currentPage = newPage;
    goto(`/blog?page=${newPage}`, { replaceState: false, noScroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(
      $locale === "en" ? "en-US" : "id-ID",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  function estimateReadingTime(content?: string, excerpt?: string): number {
    const text = content || excerpt || "";
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 180));
  }
</script>

<div class="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
  <!-- Hero Section -->
  <header class="mb-12 md:mb-16">
    <h1
      class="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 leading-tight"
    >
      {t($locale, "blog.titlePrefix")}
      <span
        class="bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine"
      >
        {t($locale, "blog.titleHighlight")}
      </span>
    </h1>
    <p
      class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed"
    >
      {t($locale, "blog.tagline")}
    </p>

    <!-- Instant Search Bar -->
    <div
      class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-xl"
    >
      <div class="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          bind:value={searchQuery}
          placeholder={t($locale, "blog.searchPlaceholder")}
          class="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-xs"
        />

        {#if searchQuery}
          <button
            on:click={() => (searchQuery = "")}
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            title={t($locale, "blog.clearSearch")}
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  </header>

  {#if loading}
    <!-- Shimmer Skeleton Loading -->
    <div class="space-y-10">
      <!-- Featured Skeleton -->
      <div
        class="rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 md:p-8 bg-zinc-50/50 dark:bg-zinc-900/50 animate-pulse grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
      >
        <div
          class="md:col-span-7 bg-zinc-200 dark:bg-zinc-800 h-64 md:h-80 rounded-2xl"
        ></div>
        <div class="md:col-span-5 space-y-4">
          <div class="w-24 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
          <div class="w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          <div class="w-3/4 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          <div
            class="w-full h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
          ></div>
          <div class="w-32 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
      </div>
      <!-- Cards Grid Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each Array(6) as _}
          <div
            class="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse space-y-4"
          >
            <div class="bg-zinc-200 dark:bg-zinc-800 h-44 rounded-xl"></div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
            <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
          </div>
        {/each}
      </div>
    </div>
  {:else if filteredBlogs.length === 0}
    <!-- Empty State -->
    <div
      class="text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30"
    >
      <div
        class="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400"
      >
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 11.25h.008v.008h-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.008v.008h-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-6 0h.008v.008h-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-1.875-3h.008v.008h-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0-3h.008v.008h-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {searchQuery ? t($locale, "blog.noResults") : "Belum ada artikel"}
      </h3>
      {#if searchQuery}
        <p
          class="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-md mx-auto"
        >
          Coba periksa ejaan atau gunakan kata kunci lain.
        </p>
        <button
          on:click={() => (searchQuery = "")}
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t($locale, "blog.clearSearch")}
        </button>
      {/if}
    </div>
  {:else}
    <!-- FEATURED ARTICLE HERO CARD (Only on Page 1 without active search filter) -->
    {#if featuredBlog}
      <section class="mb-16">
        <a href="/blog/{featuredBlog.slug}" class="group block">
          <article
            class="relative rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-blue-500/10 p-6 md:p-8"
          >
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <!-- Featured Image / Visual -->
              <div
                class="md:col-span-7 overflow-hidden rounded-2xl relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800"
              >
                {#if featuredBlog.cover_image}
                  <img
                    src={featuredBlog.cover_image}
                    alt={featuredBlog.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="eager"
                  />
                {:else}
                  <!-- Typography Graphic Cover Fallback -->
                  <div
                    class="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex flex-col justify-between p-8 relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
                  >
                    <div
                      class="absolute -right-6 -bottom-6 w-48 h-48 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-2xl pointer-events-none"
                    ></div>
                    <span
                      class="text-xs font-mono font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400"
                    >
                      Editorial Post
                    </span>
                    <div class="my-auto">
                      <p
                        class="text-3xl font-extrabold text-zinc-400/40 dark:text-zinc-600/40 line-clamp-2 leading-tight"
                      >
                        {featuredBlog.title}
                      </p>
                    </div>
                    <div
                      class="flex items-center gap-2 text-xs font-mono text-zinc-400"
                    >
                      <span>AbrorilHuda.me</span>
                    </div>
                  </div>
                {/if}

                <!-- Reading time badge -->
                <div
                  class="absolute top-4 right-4 px-3 py-1 rounded-full bg-zinc-900/70 dark:bg-zinc-950/70 backdrop-blur-md text-white text-xs font-medium border border-white/10 flex items-center gap-1.5"
                >
                  <svg
                    class="w-3.5 h-3.5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 0 0118 0z"
                    />
                  </svg>
                  {t($locale, "blog.readingTime", {
                    minutes: estimateReadingTime(
                      featuredBlog.content,
                      featuredBlog.excerpt,
                    ),
                  })}
                </div>
              </div>

              <!-- Featured Content Details -->
              <div class="md:col-span-5 flex flex-col justify-center space-y-4">
                <div class="flex items-center gap-3">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs"
                  >
                    {t($locale, "blog.featuredPost")}
                  </span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(featuredBlog.created_at)}
                  </span>
                </div>

                <h2
                  class="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight"
                >
                  {featuredBlog.title}
                </h2>

                {#if featuredBlog.excerpt}
                  <p
                    class="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3"
                  >
                    {featuredBlog.excerpt}
                  </p>
                {/if}

                <div class="pt-2 flex items-center justify-between">
                  <div
                    class="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium"
                  >
                    <span>{featuredBlog.author}</span>
                    <span>•</span>
                    <ViewCounter slug={featuredBlog.slug} />
                  </div>

                  <span
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                  >
                    {t($locale, "blog.readArticle")}
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </article>
        </a>
      </section>
    {/if}

    <!-- ARTICLES GRID -->
    {#if paginatedBlogs.length > 0}
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <h2
            class="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
          >
            {t($locale, "blog.latestPosts")}
          </h2>
          {#if searchQuery}
            <span class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Hasil untuk "{searchQuery}" ({filteredBlogs.length})
            </span>
          {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each paginatedBlogs as blog (blog.id)}
            <a href="/blog/{blog.slug}" class="group flex">
              <article
                class="w-full flex flex-col rounded-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                <!-- Card Image -->
                <div
                  class="relative overflow-hidden aspect-[16/9] bg-zinc-100 dark:bg-zinc-800"
                >
                  {#if blog.cover_image}
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  {:else}
                    <!-- Minimal Typographic Graphic Cover Fallback -->
                    <div
                      class="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800/90 dark:to-zinc-900 flex flex-col justify-between p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
                    >
                      <div
                        class="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-xl pointer-events-none"
                      ></div>
                      <span
                        class="text-[10px] font-mono font-semibold uppercase tracking-widest text-blue-600/80 dark:text-blue-400/80"
                      >
                        Article
                      </span>
                      <p
                        class="text-base font-bold text-zinc-500/60 dark:text-zinc-400/50 line-clamp-2 leading-snug"
                      >
                        {blog.title}
                      </p>
                    </div>
                  {/if}

                  <!-- Reading time pill -->
                  <div
                    class="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-zinc-900/80 dark:bg-zinc-950/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/10"
                  >
                    {t($locale, "blog.readingTime", {
                      minutes: estimateReadingTime(blog.content, blog.excerpt),
                    })}
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div class="space-y-2">
                    <div
                      class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      <time datetime={blog.created_at}
                        >{formatDate(blog.created_at)}</time
                      >
                      <span>•</span>
                      <span>{blog.author}</span>
                    </div>

                    <h3
                      class="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
                    >
                      {blog.title}
                    </h3>

                    {#if blog.excerpt}
                      <p
                        class="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed"
                      >
                        {blog.excerpt}
                      </p>
                    {/if}
                  </div>

                  <!-- Card Footer -->
                  <div
                    class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    <ViewCounter slug={blog.slug} />
                    <span
                      class="font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                    >
                      {t($locale, "blog.readMore")} →
                    </span>
                  </div>
                </div>
              </article>
            </a>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="mt-12">
        <Pagination
          {currentPage}
          {totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    {/if}
  {/if}
</div>
