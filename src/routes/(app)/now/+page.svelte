<script lang="ts">
  import { onMount } from "svelte";
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n";
  import { supabase, type NowItem } from "$lib/supabase/supabase";

  let allItems: NowItem[] = [];
  let githubRepos: any[] = [];
  let totalGithubRepos: number | null = null;
  let loadingItems = true;
  let loadingRepos = true;
  let githubError = false;
  let visible = false;

  // Priority order for sorting
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  $: activeItems = allItems
    .filter((i) => i.status === "active")
    .sort(
      (a, b) =>
        priorityOrder[a.priority ?? "medium"] -
          priorityOrder[b.priority ?? "medium"] || a.sort_order - b.sort_order,
    );

  $: completedItems = allItems.filter((i) => i.status === "completed");

  // Priority badge config
  const priorityBadge: Record<
    string,
    { label: string; classes: string; dot: string }
  > = {
    high: {
      label: "High Priority",
      classes:
        "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200/60 dark:border-red-800/60",
      dot: "bg-red-500",
    },
    medium: {
      label: "Medium Priority",
      classes:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60",
      dot: "bg-amber-500",
    },
    low: {
      label: "Low Priority",
      classes:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60",
      dot: "bg-blue-400",
    },
  };

  // Language color map for GitHub repos
  const langColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Svelte: "#ff3e00",
    Vue: "#42b883",
    Python: "#3572A5",
    Dart: "#00B4AB",
    Rust: "#dea584",
    Go: "#00ADD8",
    CSS: "#563d7c",
    HTML: "#e34c26",
    "C++": "#f34b7d",
    default: "#6b7280",
  };

  function getLangColor(lang: string | null): string {
    if (!lang) return langColors["default"];
    return langColors[lang] ?? langColors["default"];
  }

  function timeAgo(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
    return `${Math.floor(diff / 31536000)}y ago`;
  }

  onMount(async () => {
    setTimeout(() => (visible = true), 100);

    // Load focus items from Supabase
    const { data, error } = await supabase
      .from("now_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) allItems = data;
    loadingItems = false;

    // Load GitHub repos
    try {
      const res = await fetch("/api/github");
      if (res.ok) {
        const data = await res.json();
        githubRepos = data.repos;
        totalGithubRepos = data.total_public_repos;
      } else {
        githubError = true;
      }
    } catch {
      githubError = true;
    }
    loadingRepos = false;
  });
</script>

<div
  class="min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16"
>
  <!-- Hero Section -->
  <header class="space-y-4 {visible ? 'fade-in-up' : 'opacity-0'}">
    <h1
      class="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight"
    >
      {t($locale, "now.titlePrefix")}
      <span
        class="bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine"
      >
        {t($locale, "now.titleHighlight")}
      </span>
    </h1>

    <p
      class="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed"
    >
      {t($locale, "now.tagline")}
    </p>

    <div
      class="pt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
    >
      <svg
        class="w-4 h-4 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 0 0118 0z"
        />
      </svg>
      <span>{t($locale, "now.updatedNote")}</span>
    </div>
  </header>

  <!-- ── SECTION 1: CURRENT FOCUS ── -->
  <section
    class="space-y-8 {visible ? 'fade-in-up' : 'opacity-0'}"
    style="animation-delay: 0.1s"
  >
    <div
      class="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4"
    >
      <h2
        class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3 tracking-tight"
      >
        <span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
        {t($locale, "now.focusSection")}
      </h2>
      <span
        class="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
      >
        {activeItems.length} Active
      </span>
    </div>

    {#if loadingItems}
      <!-- Skeleton Loading Cards -->
      <div class="space-y-4">
        {#each Array(2) as _}
          <div
            class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 p-6 animate-pulse space-y-4"
          >
            <div class="h-6 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
        {/each}
      </div>
    {:else if activeItems.length === 0}
      <div
        class="text-center py-12 px-4 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30"
      >
        <p class="text-zinc-500 dark:text-zinc-400 text-sm">
          {t($locale, "now.noFocus")}
        </p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each activeItems as item (item.id)}
          {@const badge = priorityBadge[item.priority ?? "medium"]}
          <article
            class="group rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 p-6 md:p-8 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-xl"
          >
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
            >
              <div class="flex items-center gap-3 flex-wrap">
                <h3
                  class="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {item.project_name}
                </h3>
                <span
                  class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full {badge.classes}"
                >
                  <span class="w-1.5 h-1.5 rounded-full {badge.dot}"></span>
                  {badge.label}
                </span>
              </div>

              {#if item.github_url}
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all border border-zinc-200/60 dark:border-zinc-700/60 shrink-0"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                  {t($locale, "now.viewOnGitHub")}
                </a>
              {/if}
            </div>

            {#if item.tasks && item.tasks.length > 0}
              <ul class="space-y-2.5 pt-2">
                {#each item.tasks as task}
                  <li
                    class="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed"
                  >
                    <span
                      class="mt-2 w-1.5 h-1.5 rounded-full {badge.dot} shrink-0"
                    ></span>
                    <span>{task}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          </article>
        {/each}
      </div>
    {/if}
  </section>

  <!-- ── SECTION 2: COMPLETED / HISTORY ── -->
  {#if !loadingItems && completedItems.length > 0}
    <section
      class="space-y-6 {visible ? 'fade-in-up' : 'opacity-0'}"
      style="animation-delay: 0.15s"
    >
      <div
        class="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4"
      >
        <h2
          class="text-2xl font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-3 tracking-tight"
        >
          <svg
            class="w-5 h-5 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 0 0118 0z"
            />
          </svg>
          {t($locale, "now.historySection")}
        </h2>
        <span
          class="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
        >
          {completedItems.length} Completed
        </span>
      </div>

      <div class="space-y-4">
        {#each completedItems as item (item.id)}
          <div
            class="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 space-y-3"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <h3
                  class="text-base font-semibold text-zinc-400 dark:text-zinc-500 line-through"
                >
                  {item.project_name}
                </h3>
                <span
                  class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 font-semibold"
                >
                  Done
                </span>
              </div>
              {#if item.github_url}
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1 font-medium"
                >
                  GitHub →
                </a>
              {/if}
            </div>

            {#if item.tasks && item.tasks.length > 0}
              <ul class="space-y-1.5 pl-1">
                {#each item.tasks as task}
                  <li
                    class="flex items-start gap-2 text-xs text-zinc-400 dark:text-zinc-500 line-through"
                  >
                    <svg
                      class="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span>{task}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- ── SECTION 3: ACTIVE GITHUB REPOS ── -->
  <section
    class="space-y-8 {visible ? 'fade-in-up' : 'opacity-0'}"
    style="animation-delay: 0.2s"
  >
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4"
    >
      <h2
        class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3 tracking-tight"
      >
        <svg
          class="w-6 h-6 text-zinc-700 dark:text-zinc-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        {t($locale, "now.githubSection")}
      </h2>

      {#if totalGithubRepos !== null}
        <div
          class="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-2"
        >
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          {totalGithubRepos} Public Repos
        </div>
      {/if}
    </div>

    {#if loadingRepos}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Array(6) as _}
          <div
            class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 p-5 animate-pulse space-y-3"
          >
            <div class="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div class="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
        {/each}
      </div>
    {:else if githubError}
      <p class="text-red-500 dark:text-red-400 text-sm">
        {t($locale, "now.githubError")}
      </p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each githubRepos as repo (repo.id || repo.name)}
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 p-6 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div class="space-y-2 mb-6">
              <div class="flex items-center justify-between gap-2">
                <h3
                  class="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate"
                >
                  {repo.name}
                </h3>
                <svg
                  class="w-4 h-4 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>

              <p
                class="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed"
              >
                {repo.description ?? "No description provided."}
              </p>
            </div>

            <!-- Card Footer -->
            <div
              class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400"
            >
              <div class="flex items-center gap-1.5">
                {#if repo.language}
                  <span
                    class="w-2.5 h-2.5 rounded-full shrink-0"
                    style="background-color: {getLangColor(repo.language)}"
                  ></span>
                  <span class="font-medium">{repo.language}</span>
                {/if}
              </div>

              <div class="flex items-center gap-3 text-[11px]">
                {#if repo.stargazers_count > 0}
                  <span
                    class="flex items-center gap-1 font-semibold text-amber-500"
                  >
                    ★ {repo.stargazers_count}
                  </span>
                {/if}
                <span>{timeAgo(repo.pushed_at)}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </section>
</div>
