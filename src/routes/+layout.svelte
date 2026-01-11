<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
    import "../app.css";
</script>

<svelte:head>
     <link 
    rel="alternate" 
    type="application/rss+xml" 
    title="RSS Feed" 
    href="/rss.xml" 
     />
    <title>Moh.AbrorilHuda</title>
    <link rel="icon" href={favicon} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#3b82f6" />
    <meta name="title" content="Abrorihuda.me" />
    <meta name="description" content="web portofolio abrorilhuda" />
    <meta name="author" content="moh.abrorilhuda" />
    <link rel="canonical" href="https://abrorilhuda.me/" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://abrorilhuda.me/" />
    <meta property="og:title" content="Abrorilhuda.me" />
    <meta property="og:description" content="web portofolio abrorilhuda" />
    <meta property="og:image" content="https://abrorilhuda.me/og-default-image.png" />
    <meta property="og:site_name" content="AbrorilHuda.me" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://abrorilhuda.me" />
    <meta name="twitter:title" content="Abrorilhuda.me" />
    <meta name="twitter:description" content="web portofolio abrorilhuda" />
    <meta name="twitter:image" content="https://abrorilhuda.me/og-default-image.png" />
    <meta name="twitter:creator" content="@abror_dc" />

    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="portofolio,abrorilhuda,abrordc,moh.abrorilhuda" />
</svelte:head>

<slot />