<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import {
        commandPaletteOpen,
        closeCommandPalette,
    } from "$lib/stores/command-palette";
    import { supabase } from "$lib/supabase/supabase";
    import { fade, fly } from "svelte/transition";
    import { projects as rawProjects } from "$lib/data/projects";

    let searchQuery = "";
    let selectedIndex = 0;
    let searchInput: HTMLInputElement;

    let blogs: Array<{ title: string; slug: string; excerpt: string | null }> =
        [];

    const navigationItems = [
        {
            title: "Home",
            description: "Go to homepage",
            url: "/",
            iconType: "home",
            category: "Navigation",
        },
        {
            title: "About",
            description: "Learn more about me",
            url: "/#about",
            iconType: "user",
            category: "Navigation",
        },
        {
            title: "Projects",
            description: "View my projects",
            url: "/#projects",
            iconType: "briefcase",
            category: "Navigation",
        },
        {
            title: "Experience",
            description: "My work experience",
            url: "/#experience",
            iconType: "chart",
            category: "Navigation",
        },
        {
            title: "Contact",
            description: "Get in touch",
            url: "/#contact",
            iconType: "mail",
            category: "Navigation",
        },
        {
            title: "Celoteh",
            description: "My Tweet",
            url: "/celoteh",
            iconType: "flame",
            category: "Navigation",
        },
        {
            title: "Blog",
            description: "Read my articles",
            url: "/blog",
            iconType: "blog",
            category: "Navigation",
        },
    ];

    // Load recent blogs
    onMount(async () => {
        const { data } = await supabase
            .from("blogs")
            .select("title, slug, excerpt")
            .eq("published", true)
            .order("created_at", { ascending: false });

        if (data) {
            blogs = data;
        }
    });

    $: blogItems = blogs.map((blog) => ({
        title: blog.title,
        description: blog.excerpt || "",
        url: `/blog/${blog.slug}`,
        iconType: "blog",
        category: "Blog Posts",
    }));

    $: projects = rawProjects.map((p) => ({
        title: p.title,
        description: p.description,
        url: p.link,
        iconType: "project",
        category: "Projects",
    }));

    $: displayBlogItems =
        searchQuery.trim() === "" ? blogItems.slice(0, 3) : blogItems;

    $: allItems = [...navigationItems, ...projects, ...displayBlogItems];

    $: filteredItems =
        searchQuery.trim() === ""
            ? allItems
            : allItems.filter((item) => {
                  const query = searchQuery.toLowerCase();
                  return (
                      item.title.toLowerCase().includes(query) ||
                      item.description.toLowerCase().includes(query) ||
                      item.category.toLowerCase().includes(query)
                  );
              });

    $: groupedItems = filteredItems.reduce(
        (acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        },
        {} as Record<string, typeof filteredItems>,
    );

    // Reset selected index when search changes
    $: if (searchQuery) {
        selectedIndex = 0;
    }

    // Keyboard navigation
    function handleKeydown(e: KeyboardEvent) {
        if (!$commandPaletteOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                selectedIndex = Math.min(
                    selectedIndex + 1,
                    filteredItems.length - 1,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                break;
            case "Enter":
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    navigateToItem(filteredItems[selectedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                closeCommandPalette();
                break;
        }
    }

    function navigateToItem(item: (typeof filteredItems)[0]) {
        if (item.url) {
            if (item.url.startsWith("http")) {
                window.open(item.url, "_blank");
            } else {
                goto(item.url);
            }
            closeCommandPalette();
        }
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            closeCommandPalette();
        }
    }

    // Focus search input when opened
    $: if ($commandPaletteOpen && searchInput) {
        setTimeout(() => searchInput?.focus(), 50);
    }

    // Reset state when closed
    $: if (!$commandPaletteOpen) {
        searchQuery = "";
        selectedIndex = 0;
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    });
</script>

{#if $commandPaletteOpen}
    <!-- Backdrop Overlay -->
    <div
        class="fixed inset-0 bg-zinc-950/50 dark:bg-black/65 backdrop-blur-md z-[2000] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
        on:click={handleBackdropClick}
        transition:fade={{ duration: 200 }}
        role="presentation"
    >
        <!-- Command Palette Container Modal -->
        <div
            class="w-full max-w-2xl bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.18)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-gray-200/60 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-300"
            on:click|stopPropagation
            on:keydown|stopPropagation
            transition:fly={{ y: -15, duration: 250 }}
            role="dialog"
            tabindex="-1"
            aria-modal="true"
            aria-label="Command palette"
        >
            <!-- Search Input Area -->
            <div
                class="flex items-center gap-3 px-5 py-4 border-b border-gray-200/50 dark:border-white/5"
            >
                <svg
                    class="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    bind:this={searchInput}
                    bind:value={searchQuery}
                    type="text"
                    placeholder="Search pages, projects, or articles..."
                    class="flex-1 bg-transparent border-none outline-none font-display font-medium text-gray-900 dark:text-zinc-100 placeholder-gray-400 text-sm sm:text-base tracking-tight"
                />
                <kbd
                    class="hidden sm:inline-block px-2 py-0.5 text-[9px] font-semibold text-gray-400 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-md shadow-2xs select-none"
                >
                    ESC
                </kbd>
            </div>

            <!-- Results Area -->
            <div class="max-h-[50vh] sm:max-h-[55vh] overflow-y-auto py-2">
                {#if filteredItems.length === 0}
                    <div
                        class="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                        <svg class="w-8 h-8 mx-auto mb-2 text-gray-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p class="text-sm font-medium">
                            No results found for "{searchQuery}"
                        </p>
                    </div>
                {:else}
                    {#each Object.entries(groupedItems) as [category, items], categoryIndex}
                        <div class="space-y-1">
                            <!-- Category Header -->
                            <div
                                class="px-5 pt-3 pb-1 text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-widest"
                            >
                                {category}
                            </div>

                            <!-- Items Container -->
                            <div class="space-y-1.5 px-2">
                                {#each items as item, itemIndex}
                                    {@const globalIndex =
                                        filteredItems.indexOf(item)}
                                    <button
                                        on:click={() => navigateToItem(item)}
                                        on:mouseenter={() =>
                                            (selectedIndex = globalIndex)}
                                        class="w-[98%] mx-auto flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left group
                           {selectedIndex === globalIndex
                                            ? 'bg-gray-100/75 dark:bg-zinc-900/80 border border-gray-200/40 dark:border-white/5 shadow-2xs translate-x-1.5'
                                            : 'border border-transparent'}"
                                    >
                                        <!-- framed icon badge -->
                                        <div
                                            class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900/60 border border-gray-250/20 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                                        >
                                            {#if item.iconType === 'home'}
                                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                            {:else if item.iconType === 'user'}
                                                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                            {:else if item.iconType === 'docs'}
                                                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                            {:else if item.iconType === 'globe'}
                                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                                            {:else if item.iconType === 'mobile'}
                                                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                                            {:else if item.iconType === 'users'}
                                                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                            {:else if item.iconType === 'academic'}
                                                <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                                            {:else if item.iconType === 'presentation'}
                                                <svg class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
                                            {:else if item.iconType === 'briefcase' || item.iconType === 'project'}
                                                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                            {:else if item.iconType === 'chart'}
                                                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                            {:else if item.iconType === 'mail'}
                                                <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                            {:else if item.iconType === 'flame'}
                                                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>
                                            {:else if item.iconType === 'blog'}
                                                <svg class="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/></svg>
                                            {:else}
                                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                            {/if}
                                        </div>

                                        <div class="flex-1 min-w-0">
                                            <div
                                                class="font-display font-bold text-gray-900 dark:text-zinc-100 text-sm truncate"
                                            >
                                                {item.title}
                                            </div>
                                            {#if item.description}
                                                <div
                                                    class="text-xs text-gray-500 dark:text-gray-450 truncate mt-0.5"
                                                >
                                                    {item.description}
                                                </div>
                                            {/if}
                                        </div>

                                        <!-- Shortcut enter / link indicator -->
                                        {#if selectedIndex === globalIndex}
                                            <span
                                                class="flex items-center gap-1.5 flex-shrink-0 transition-all duration-200"
                                            >
                                                {#if item.url.startsWith("http")}
                                                    <svg
                                                        class="w-3.5 h-3.5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        stroke-width="2.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                {/if}
                                                <kbd
                                                    class="px-1.5 py-0.5 text-[8px] font-bold text-gray-400 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded shadow-3xs uppercase"
                                                    >Enter</kbd
                                                >
                                            </span>
                                        {/if}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Redesigned Footer control bar -->
            <div
                class="px-5 py-3 border-t border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-950/40"
            >
                <div
                    class="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500"
                >
                    <div class="hidden sm:flex items-center gap-4">
                        <span class="flex items-center gap-1.5">
                            <kbd
                                class="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-gray-250/20 dark:border-white/5 rounded shadow-2xs font-semibold text-[9px]"
                                >↑↓</kbd
                            >
                            Navigate
                        </span>
                        <span class="flex items-center gap-1.5">
                            <kbd
                                class="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-gray-250/20 dark:border-white/5 rounded shadow-2xs font-semibold text-[9px]"
                                >Enter</kbd
                            >
                            Select
                        </span>
                    </div>
                    <span class="flex items-center gap-1.5 ml-auto">
                        <kbd
                            class="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-gray-250/20 dark:border-white/5 rounded shadow-2xs font-semibold text-[9px]"
                            >ESC</kbd
                        >
                        Close
                    </span>
                </div>
            </div>
        </div>
    </div>
{/if}
