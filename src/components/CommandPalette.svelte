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
            icon: "🏠",
            category: "Navigation",
        },
        {
            title: "About",
            description: "Learn more about me",
            url: "/#about",
            icon: "👤",
            category: "Navigation",
        },
        {
            title: "Projects",
            description: "View my projects",
            url: "/#projects",
            icon: "💼",
            category: "Navigation",
        },
        {
            title: "Experience",
            description: "My work experience",
            url: "/#experience",
            icon: "📊",
            category: "Navigation",
        },
        {
            title: "Contact",
            description: "Get in touch",
            url: "/#contact",
            icon: "📧",
            category: "Navigation",
        },
        {
            title: "Celoteh",
            description: "My Tweet",
            url: "/celoteh",
            icon: "🔥",
            category: "Navigation",
        },
        {
            title: "Blog",
            description: "Read my articles",
            url: "/blog",
            icon: "📝",
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
        icon: "📝",
        category: "Blog Posts",
    }));

    $: projects = rawProjects.map((p) => ({
        title: p.title,
        description: p.description,
        url: p.link,
        icon: p.icon || "💼",
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
                        <span class="text-3xl block mb-2">🔍</span>
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
                                            class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900/60 border border-gray-250/20 dark:border-white/5 flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                                        >
                                            {item.icon}
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
