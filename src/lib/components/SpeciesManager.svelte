<!-- SpeciesManager - Handles species data loading and caching -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { cache, CACHE_KEYS, CACHE_TTL } from '$lib/utils/cache';

  export let onSpeciesLoaded: (species: string[]) => void = () => {};
  export let onError: (error: string) => void = () => {};
  export let onLoadingChange: (loading: boolean) => void = () => {};

  // Local state
  let speciesOptions: string[] = [];
  let loading: boolean = false;
  let error: string | null = null;
  let retryCount: number = 0;
  const maxRetries: number = 3;
  let isUsingCachedSpecies: boolean = false;

  // Public methods
  const refreshSpecies = () => {
    cache.invalidate(CACHE_KEYS.SPECIES);
    retryCount = 0;
    loadSpecies();
  };

  // Load species data with caching
  const loadSpecies = async () => {
    loading = true;
    error = null;
    onLoadingChange(true);

    try {
      // Check cache first
      const cachedData = cache.get<string[]>(CACHE_KEYS.SPECIES);
      if (cachedData) {
        speciesOptions = cachedData;
        isUsingCachedSpecies = true;
        onSpeciesLoaded(speciesOptions);
        return;
      }

      // Fetch from API
      const response = await fetch('/api/species');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid species data format');
      }

      // Process and cache data
      const processedSpecies = data
        .filter((item: any) => item?.species_name)
        .map((item: any) => item.species_name)
        .filter((name: string) => typeof name === 'string')
        .sort((a: string, b: string) => a.localeCompare(b));

      speciesOptions = processedSpecies;
      isUsingCachedSpecies = false;
      cache.set(CACHE_KEYS.SPECIES, processedSpecies, CACHE_TTL.SPECIES);
      onSpeciesLoaded(speciesOptions);

    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load species';
      onError(error);
      
      // Retry logic
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(loadSpecies, 1000 * retryCount);
      }
    } finally {
      loading = false;
      onLoadingChange(false);
    }
  };

  onMount(() => {
    loadSpecies();
  });

  // Expose reactive state to parent
  $: loadingState = { loading, error, species: speciesOptions, refresh: refreshSpecies };
</script>

<!-- This component is purely logical - no UI -->
{#if loading}
  <slot loading={true} error={null} species={[]} refresh={refreshSpecies} />
{:else if error}
  <slot loading={false} error={error} species={[]} refresh={refreshSpecies} />
{:else}
  <slot loading={false} error={null} species={speciesOptions} refresh={refreshSpecies} />
{/if}
