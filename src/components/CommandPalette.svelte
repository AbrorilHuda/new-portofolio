<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import {
    commandPaletteOpen,
    closeCommandPalette,
  } from "$lib/stores/command-palette";
  import { supabase } from "$lib/supabase/supabase";
  import { fade, fly } from "svelte/transition";

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
      title: "Blog",
      description: "Read my articles",
      url: "/blog",
      icon: "📝",
      category: "Navigation",
    },
  ];

  // Projects data
  const projects = [
    {
      title: "Demtimcod Docs",
      description: "Documentation platform",
      url: "https://demtimcod.github.io/",
      icon: "📚",
      category: "Projects",
    },
    {
      title: "Codverse",
      description: "Digital solution website",
      url: "https://codverse.site",
      icon: "🌐",
      category: "Projects",
    },
    {
      title: "Mobile Apps",
      description: "React Native application",
      url: "",
      icon: "📱",
      category: "Projects",
    },
    {
      title: "Maduradev",
      description: "Madura developers community",
      url: "https://madura.dev",
      icon: "👥",
      category: "Projects",
    },
    {
      title: "DCN UNIRA",
      description: "Dicoding Community Network",
      url: "https://dcnunira.dev",
      icon: "🎓",
      category: "Projects",
    },
    {
      title: "Presentation Deck",
      description: "SaaS presentation platform",
      url: "https://slide.dcnunira.dev",
      icon: "🎨",
      category: "Projects",
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
        selectedIndex = Math.min(selectedIndex + 1, filteredItems.length - 1);
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
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
    on:click={handleBackdropClick}
    transition:fade={{ duration: 200 }}
    role="presentation"
  >
    <!-- Command Palette Modal -->
    <div
      class="fixed top-[15%] sm:top-[20%] left-1/2 -translate-x-1/2 w-[95%] sm:w-full max-w-2xl"
      transition:fly={{ y: -20, duration: 200 }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Search Input -->
        <div
          class="flex items-center gap-3 px-4 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700"
        >
          <svg
            class="w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            bind:this={searchInput}
            bind:value={searchQuery}
            type="text"
            placeholder="Search..."
            class="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm sm:text-base"
          />
          <kbd
            class="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded"
          >
            ESC
          </kbd>
        </div>

        <!-- Results -->
        <div class="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
          {#if filteredItems.length === 0}
            <div
              class="px-4 py-8 sm:py-12 text-center text-gray-500 dark:text-gray-400"
            >
              <p class="text-sm sm:text-base">
                No results found for "{searchQuery}"
              </p>
            </div>
          {:else}
            {#each Object.entries(groupedItems) as [category, items], categoryIndex}
              <div class="py-2">
                <!-- Category Header -->
                <div
                  class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {category}
                </div>

                <!-- Items -->
                {#each items as item, itemIndex}
                  {@const globalIndex = filteredItems.indexOf(item)}
                  <button
                    on:click={() => navigateToItem(item)}
                    on:mouseenter={() => (selectedIndex = globalIndex)}
                    class="w-full flex items-center gap-3 px-4 py-2 sm:py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer
                           {selectedIndex === globalIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : ''}"
                  >
                    <span class="text-xl sm:text-2xl flex-shrink-0"
                      >{item.icon}</span
                    >
                    <div class="flex-1 text-left min-w-0">
                      <div
                        class="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate"
                      >
                        {item.title}
                      </div>
                      {#if item.description}
                        <div
                          class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate"
                        >
                          {item.description}
                        </div>
                      {/if}
                    </div>
                    {#if item.url.startsWith("http")}
                      <svg
                        class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    {/if}
                  </button>
                {/each}
              </div>
            {/each}
          {/if}
        </div>

        <!-- Footer -->
        <div
          class="px-4 py-2 sm:py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        >
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <div class="hidden sm:flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd
                  class="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                  >↑↓</kbd
                >
                Navigate
              </span>
              <span class="flex items-center gap-1">
                <kbd
                  class="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                  >Enter</kbd
                >
                Select
              </span>
            </div>
            <span class="flex items-center gap-1 ml-auto">
              <kbd
                class="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                >ESC</kbd
              >
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
