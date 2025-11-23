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
    <title>Abrorilhuda.me</title>
	<link rel="icon" href={favicon} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#3b82f6" />
</svelte:head>

<slot />