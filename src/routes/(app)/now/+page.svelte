<script lang="ts">
    import { onMount } from "svelte";
    import { locale } from "$lib/stores/locale";
    import { t } from "$lib/i18n";
    import { supabase, type NowItem } from "$lib/supabase/supabase";

    let allItems: NowItem[] = [];
    let githubRepos: any[] = [];
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
                    priorityOrder[b.priority ?? "medium"] ||
                a.sort_order - b.sort_order,
        );

    $: completedItems = allItems.filter((i) => i.status === "completed");

    // Priority badge config
    const priorityBadge: Record<
        string,
        { label: string; classes: string; dot: string }
    > = {
        high: {
            label: "High",
            classes:
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            dot: "bg-red-500",
        },
        medium: {
            label: "Medium",
            classes:
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            dot: "bg-yellow-500",
        },
        low: {
            label: "Low",
            classes:
                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
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
                githubRepos = await res.json();
            } else {
                githubError = true;
            }
        } catch {
            githubError = true;
        }
        loadingRepos = false;
    });
</script>

<section class="min-h-screen py-24 px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-16 {visible ? 'fade-in-up' : 'opacity-0'}">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                {t($locale, "now.titlePrefix")}
                <span
                    class="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shine"
                >
                    {t($locale, "now.titleHighlight")}
                </span>
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                {t($locale, "now.tagline")}
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-500 italic">
                {t($locale, "now.updatedNote")}
            </p>
        </div>

        <!-- ── Section 1: Current Focus ── -->
        <div
            class="mb-20 {visible ? 'fade-in-up' : 'opacity-0'}"
            style="animation-delay: 0.1s"
        >
            <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
                <span
                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"
                ></span>
                {t($locale, "now.focusSection")}
            </h2>

            {#if loadingItems}
                <!-- Skeleton cards -->
                <div class="space-y-4">
                    {#each Array(2) as _}
                        <div
                            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6 animate-pulse"
                        >
                            <div
                                class="h-5 w-40 rounded bg-gray-300 dark:bg-gray-600 mb-4"
                            ></div>
                            <div
                                class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 mb-2"
                            ></div>
                            <div
                                class="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"
                            ></div>
                        </div>
                    {/each}
                </div>
            {:else if activeItems.length === 0}
                <p class="text-gray-500 dark:text-gray-400 italic">
                    {t($locale, "now.noFocus")}
                </p>
            {:else}
                <div class="space-y-5">
                    {#each activeItems as item}
                        {@const badge =
                            priorityBadge[item.priority ?? "medium"]}
                        <div
                            class="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-6 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                        >
                            <div
                                class="flex items-start justify-between gap-4 mb-4"
                            >
                                <div class="flex items-center gap-3 flex-wrap">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                    >
                                        {item.project_name}
                                    </h3>
                                    <!-- Priority badge -->
                                    <span
                                        class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full {badge.classes}"
                                    >
                                        <span
                                            class="w-1.5 h-1.5 rounded-full {badge.dot}"
                                        ></span>
                                        {badge.label}
                                    </span>
                                </div>
                                <a
                                    href={item.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                    aria-label="View on GitHub"
                                >
                                    <svg
                                        class="w-3.5 h-3.5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                        />
                                    </svg>
                                    {t($locale, "now.viewOnGitHub")}
                                </a>
                            </div>

                            <!-- Task bullet list -->
                            {#if item.tasks && item.tasks.length > 0}
                                <ul class="space-y-2">
                                    {#each item.tasks as task}
                                        <li
                                            class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300"
                                        >
                                            <span
                                                class="mt-1.5 w-1.5 h-1.5 rounded-full {badge.dot} shrink-0"
                                            ></span>
                                            {task}
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- ── Section 2: History (Completed) ── -->
        {#if !loadingItems && completedItems.length > 0}
            <div
                class="mb-20 {visible ? 'fade-in-up' : 'opacity-0'}"
                style="animation-delay: 0.15s"
            >
                <h2
                    class="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-500 dark:text-gray-400"
                >
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {t($locale, "now.historySection")}
                </h2>

                <div class="space-y-3">
                    {#each completedItems as item}
                        <div
                            class="group rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30 p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex items-center gap-3 flex-wrap">
                                    <!-- Strikethrough title to signal "done" -->
                                    <h3
                                        class="text-base font-medium text-gray-400 dark:text-gray-500 line-through"
                                    >
                                        {item.project_name}
                                    </h3>
                                    <span
                                        class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-green-400 dark:text-green-500"
                                    >
                                        Done
                                    </span>
                                </div>
                                <a
                                    href={item.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                >
                                    <svg
                                        class="w-3.5 h-3.5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                        />
                                    </svg>
                                    GitHub
                                </a>
                            </div>

                            {#if item.tasks && item.tasks.length > 0}
                                <ul class="mt-3 space-y-1">
                                    {#each item.tasks as task}
                                        <li
                                            class="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-500 line-through"
                                        >
                                            <svg
                                                class="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-500 no-underline"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="2.5"
                                                stroke="currentColor"
                                                style="text-decoration: none"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                            {task}
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- ── Section 3: Active GitHub Repos ── -->
        <div
            class={visible ? "fade-in-up" : "opacity-0"}
            style="animation-delay: 0.2s"
        >
            <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
                <svg
                    class="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                </svg>
                {t($locale, "now.githubSection")}
            </h2>

            {#if loadingRepos}
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each Array(6) as _}
                        <div
                            class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-5 animate-pulse"
                        >
                            <div
                                class="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600 mb-3"
                            ></div>
                            <div
                                class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 mb-2"
                            ></div>
                            <div
                                class="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700"
                            ></div>
                        </div>
                    {/each}
                </div>
            {:else if githubError}
                <p class="text-red-500 dark:text-red-400">
                    {t($locale, "now.githubError")}
                </p>
            {:else}
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each githubRepos as repo}
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                        >
                            <!-- Repo name -->
                            <p
                                class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 transition-colors truncate"
                            >
                                {repo.name}
                            </p>

                            <!-- Description -->
                            <p
                                class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-4"
                            >
                                {repo.description ?? "—"}
                            </p>

                            <!-- Footer: language + stars + last push -->
                            <div
                                class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto"
                            >
                                <div class="flex items-center gap-1.5">
                                    {#if repo.language}
                                        <span
                                            class="w-2.5 h-2.5 rounded-full shrink-0"
                                            style="background-color: {getLangColor(
                                                repo.language,
                                            )}"
                                        ></span>
                                        <span>{repo.language}</span>
                                    {/if}
                                </div>
                                <div class="flex items-center gap-3">
                                    {#if repo.stargazers_count > 0}
                                        <span class="flex items-center gap-1">
                                            <svg
                                                class="w-3.5 h-3.5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                                />
                                            </svg>
                                            {repo.stargazers_count}
                                        </span>
                                    {/if}
                                    <span>{timeAgo(repo.pushed_at)}</span>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</section>
