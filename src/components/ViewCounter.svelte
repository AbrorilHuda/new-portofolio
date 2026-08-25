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
    <span class="loading flex items-center gap-1.5 text-xs">
      <svg class="w-3.5 h-3.5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </span>
  {:else}
    <span class="views flex items-center gap-1 text-xs">
      <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      {totalViews.toLocaleString('id-ID')} views
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