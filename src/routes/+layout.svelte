<script lang="ts">
import { MetaTags, JsonLd } from 'svelte-meta-tags';
import favicon from '$lib/assets/favicon.ico';
import "../app.css";
import { page } from '$app/stores';
import { onMount } from 'svelte';
import CommandPalette from '../components/CommandPalette.svelte';
import { toggleCommandPalette } from '$lib/stores/command-palette';

  $: data = $page.data;
  
  // Default values untuk avoid undefined
  const siteurl = data?.siteurl || 'https://abrorilhuda.me';
  const defaultimage = data?.defaultimage || 'https://abrorilhuda.me/og-image.png';
  
  // Destructure dengan safe check
  $: metaTags = (() => {
    const { siteurl: _, defaultimage: __, ...rest } = data || {};
    return rest;
  })();

  // Global keyboard shortcut for Command Palette
  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<svelte:head>
     <link 
    rel="alternate" 
    type="application/rss+xml" 
    title="RSS Feed" 
    href="/rss.xml" 
     />
    <link rel="icon" href={favicon} />
    <meta name="theme-color" content="#3b82f6" />
</svelte:head>


<MetaTags {...metaTags}/>

<JsonLd
  schema={[
    {
      "@type": "Person",
      name: "abrorilhuda",
      url: siteurl,
      image: defaultimage,
      sameAs: [
        "https://www.linkedin.com/in/moh-abroril-huda",
        "https://github.com/abrorilhuda",
        "https://twitter.com/abror_dc",
      ],
      jobTitle: "Full-Stack Developer",
      worksFor: {
        "@type": "Organization",
        name: "Freelancer",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteurl,
        },
         {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: `${siteurl}/blog`,
        },
      ],
    },
    {
      "@type": "WebSite",
      name: "Moh.AbrorilHuda",
      url: siteurl,
    },
  ]}
/>

<!-- Command Palette -->
<CommandPalette />

<slot />
