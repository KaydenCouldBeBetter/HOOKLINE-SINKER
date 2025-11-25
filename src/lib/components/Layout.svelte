<!-- Responsive Layout - Midnight Standard v3.1 -->
<script lang="ts">
  import FilterChip from './FilterChip.svelte';
  import ControlButton from './ControlButton.svelte';
  import FloatingActionButton from './FloatingActionButton.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import UniversalPanel from './UniversalPanel.svelte';
  import { onMount } from 'svelte';
  import { cache, CACHE_KEYS, CACHE_TTL } from '$lib/utils/cache';
  
  export let selectedSpecies: string[] = [];
  export let onToggleSpecies: (species: string) => void = () => {};
  export let temperature: number = 24;
  export let weatherCondition: 'sunny' | 'cloudy' | 'rainy' = 'cloudy';
  export let moonPhase: string = '🌗';
  export let weatherError: string | null = null;
  export let isLoadingWeather: boolean = false;
  export let isUsingCachedWeather: boolean = false;
  export let onRefreshWeather: () => void = () => {};
  export let onResetBearing: () => void = () => {};
  export let onGPSLocation: () => void = () => {};
  export let onLogCatch: () => void = () => {};
  export let isMobile: boolean = false;

  // Internal state
  let speciesOptions: string[] = [];
  let loading: boolean = false;
  let error: string | null = null;
  let retryCount: number = 0;
  const maxRetries: number = 3;
  let isUsingCachedSpecies: boolean = false;

  // Type assertion helper
  const assertIsString = (value: unknown): value is string => {
    return typeof value === 'string';
  };

  interface SpeciesData {
  species_name: string;
  [key: string]: any;
}

// Load species data with caching and retry logic
  const loadSpecies = async (attempt: number = 0) => {
    loading = true;
    error = null;
    isUsingCachedSpecies = false;

    // Try to get from cache first
    const cachedSpecies = cache.get<string[]>(CACHE_KEYS.SPECIES);
    if (cachedSpecies) {
      console.log('Using cached species:', cachedSpecies);
      speciesOptions = cachedSpecies;
      isUsingCachedSpecies = true;
      loading = false;
      return;
    }

    try {
      const response = await fetch('/api/species');
      if (!response.ok) {
        throw new Error(`Species API returned ${response.status}: ${response.statusText}`);
      }
      const data: unknown = await response.json();
      console.log('Raw species data:', data);
      if (!Array.isArray(data)) {
        throw new Error('Invalid species data format');
      }
      speciesOptions = data
        .map((s: unknown) => {
          const species = s as SpeciesData;
          return species.species_name;
        })
        .filter(assertIsString);
      
      console.log('Processed species options:', speciesOptions);
      
      // Cache the species data
      cache.set(CACHE_KEYS.SPECIES, speciesOptions, CACHE_TTL.SPECIES);
      retryCount = 0; // Reset retry count on success
    } catch (err) {
      console.error(`Failed to load species (attempt ${attempt + 1}):`, err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (attempt < maxRetries - 1) {
        retryCount = attempt + 1;
        // Exponential backoff: wait 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        setTimeout(() => loadSpecies(attempt + 1), delay);
        return; // Don't set error state yet, we're retrying
      }
      
      error = errorMessage;
      speciesOptions = ['Bass', 'Walleye', 'Pike', 'Trout']; // Fallback data
    } finally {
      if (attempt >= maxRetries - 1) {
        loading = false;
      }
    }
  };

  onMount(() => {
    loadSpecies();
  });
</script>

{#if isMobile}
  <!-- Mobile Layout -->
  <!-- Bottom: Filter Dock -->
  <div class="absolute bottom-4 left-4 right-4 pointer-events-auto z-20">
    <UniversalPanel padding="sm" className="max-w-md mx-auto">
      <div class="flex items-center gap-3">
        <!-- Filter Chips -->
        <div class="flex-1 overflow-x-auto scrollbar-hide">
          {#each speciesOptions as species (species)}
            <FilterChip 
              label={species}
              active={selectedSpecies.includes(species as string)}
              onClick={() => onToggleSpecies(species as string)}
            />
          {/each}
        </div>
      </div>
    </UniversalPanel>
  </div>

  <!-- Top Right: Weather Widget -->
  <div class="absolute right-4 top-4 pointer-events-auto z-20">
    <UniversalPanel padding="sm" className="min-w-fit">
      {#if isLoadingWeather}
        <div class="text-[#a6adc8] text-sm py-1">
          Loading weather...
        </div>
      {:else if weatherError}
        <div class="text-[#f38ba8] text-sm py-1">
          ⚠️ Weather unavailable
        </div>
      {:else}
        <div class="flex items-center gap-2">
          <WeatherWidget 
            temperature={temperature} 
            condition={weatherCondition} 
            moonPhase={moonPhase}
          />
          {#if isUsingCachedWeather}
            <button 
              class="text-[#89b4fa] text-xs hover:text-[#b4befe]" 
              on:click={onRefreshWeather}
              title="Refresh weather data"
            >
              🔄
            </button>
          {/if}
        </div>
      {/if}
    </UniversalPanel>
  </div>

  <!-- Right Edge: Control Stack -->
  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto z-20 flex flex-col gap-3">
    <ControlButton icon="�" size="sm" onClick={onGPSLocation} />
    <ControlButton icon="🧭" size="sm" onClick={onResetBearing} />
    <FloatingActionButton icon="🎣" onClick={onLogCatch} />
  </div>
{:else}
  <!-- Desktop Layout: Floating Command Card (Top Left) -->
  <div class="fixed top-6 left-6 w-[24rem] bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-2xl z-50 pointer-events-auto">
    <!-- Weather Header -->
    <div class="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
      <div>
        <h2 class="text-[#cdd6f4] font-semibold text-sm tracking-wide">Weather</h2>
        {#if isUsingCachedWeather}
          <div class="text-[#89b4fa] text-xs mt-1">Cached data</div>
        {/if}
      </div>
      <div class="flex items-center gap-3">
        <WeatherWidget 
          temperature={temperature} 
          condition={weatherCondition} 
          moonPhase={moonPhase}
        />
        {#if isUsingCachedWeather}
          <button 
            class="text-[#89b4fa] text-xs hover:text-[#b4befe] transition-colors opacity-70 hover:opacity-100"
            on:click={onRefreshWeather}
            title="Refresh weather data"
          >
            🔄
          </button>
        {/if}
      </div>
    </div>
    
    <!-- Map Theme -->
    <div class="mb-4 pb-3 border-b border-white/10">
      <h3 class="text-[#cdd6f4] font-semibold text-sm tracking-wide mb-3">Map Theme</h3>
      <slot name="themeSelector">
        <!-- Theme selector will be injected here -->
      </slot>
    </div>
    
    <!-- Quick Filters -->
    <div>
      <h3 class="text-[#cdd6f4] font-semibold text-sm tracking-wide mb-3">Quick Filters</h3>
      {#if loading}
        <div class="text-[#a6adc8] text-sm">
          Loading species{retryCount > 0 ? `... (retry ${retryCount}/${maxRetries})` : '...'}
        </div>
      {:else if error}
        <div class="text-[#f38ba8] text-sm">
          ⚠️ Error: {error}
          <button 
            class="ml-2 text-xs underline hover:text-[#f2cdcd]" 
            on:click={() => loadSpecies()}
          >
            Retry
          </button>
        </div>
      {:else}
        <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-hide">
          {#each speciesOptions as species (species)}
            <FilterChip 
              label={species}
              active={selectedSpecies.includes(species as string)}
              onClick={() => onToggleSpecies(species as string)}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Right Side Controls -->
  <div class="fixed right-6 top-1/2 -translate-y-1/2 pointer-events-auto z-20 flex flex-col gap-3">
    <!-- Zoom Controls (Glass Style) -->
    <div class="bg-[#1e1e2e]/60 backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-lg hover:bg-[#1e1e2e]/80 transition-all duration-200">
      <div class="flex flex-col gap-1">
        <button 
          class="text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors text-sm px-2 py-1 hover:bg-white/10 rounded flex items-center justify-center"
          on:click={() => {
            const mapEvent = new CustomEvent('mapZoomIn');
            window.dispatchEvent(mapEvent);
          }}
          title="Zoom In"
        >
          +
        </button>
        <div class="h-px bg-white/10 mx-1"></div>
        <button 
          class="text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors text-sm px-2 py-1 hover:bg-white/10 rounded flex items-center justify-center"
          on:click={() => {
            const mapEvent = new CustomEvent('mapZoomOut');
            window.dispatchEvent(mapEvent);
          }}
          title="Zoom Out"
        >
          −
        </button>
      </div>
    </div>
    
    <!-- Log Catch (Mauve FAB) -->
    <FloatingActionButton icon="🎣" onClick={onLogCatch} />
  </div>
{/if}
