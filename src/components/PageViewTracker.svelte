<script lang="ts">
  import { onMount } from 'svelte';
  
  export let slug: string;
  
  let tracked = false;

  onMount(async () => {
    if (tracked) return;
    
    try {
      // Check if already viewed today
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `viewed_${slug}_${today}`;
      
      if (localStorage.getItem(storageKey)) {
        return;
      }
      
      // Call server-side API for more accurate tracking
      const response = await fetch('/api/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      
      if (response.ok) {
        localStorage.setItem(storageKey, 'true');
        tracked = true;
      }
    } catch (err) {
      console.error('Error tracking page view:', err);
    }
  });
</script>