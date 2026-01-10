<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase/supabase';
  
  export let slug: string;
  export let showUnique = false;
  
  let totalViews = 0;
  let uniqueVisitors = 0;
  let loading = true;

  onMount(async () => {
    await fetchViews();
  });

  async function fetchViews() {
    try {
      const { data, error } = await supabase
        .rpc('get_page_views', { page_slug: slug });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        totalViews = data[0].total_views;
        uniqueVisitors = data[0].unique_visitors;
      }
    } catch (err) {
      console.error('Error fetching views:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="view-counter">
  {#if loading}
    <span class="loading">⏳ Loading...</span>
  {:else}
    <span class="views">
      👁️ {totalViews.toLocaleString('id-ID')} views
      {#if showUnique}
        <span class="unique">({uniqueVisitors} unique)</span>
      {/if}
    </span>
  {/if}
</div>

<style>
  .view-counter {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .views {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .unique {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  .loading {
    opacity: 0.5;
  }
</style>