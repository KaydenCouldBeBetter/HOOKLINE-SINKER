<!-- Responsive Layout - Midnight Standard v3.6 -->
<script lang="ts">
  import FilterChip from './FilterChip.svelte';
  import ControlButton from './ControlButton.svelte';
  import FloatingActionButton from './FloatingActionButton.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import UniversalPanel from './UniversalPanel.svelte';
  import MapLayersFlyout from './MapLayersFlyout.svelte';
  import MapLayersModal from './MapLayersModal.svelte';
  import { onMount } from 'svelte';
  import { cache, CACHE_KEYS, CACHE_TTL } from '$lib/utils/cache';
  import type { MapStyle } from '$lib/config/map';

  export let selectedSpecies: string[] = [];
  export let onToggleSpecies: (species: string) => void = () => {};
  export let temperature: number = 24;
  export let weatherCondition: 'sunny' | 'cloudy' | 'rainy' = 'sunny';
  export let moonPhase: string = '🌗';
  export let isUsingCachedWeather: boolean = false;
  export let onRefreshWeather: () => void = () => {};
  export let onLogCatch: () => void = () => {};
  export let isMobile: boolean = false;
  export let currentMapStyle: MapStyle = 'structure';
  export let onMapStyleChange: (style: MapStyle) => void = () => {};

  // Local state
  let speciesOptions: string[] = [];
  let loading: boolean = false;
  let error: string | null = null;
  let retryCount: number = 0;
  const maxRetries: number = 3;
  let isUsingCachedSpecies: boolean = false;

  // Map layers UI state
  let showFlyout: boolean = false;
  let showModal: boolean = false;
  let layersButtonRef: HTMLDivElement | null = null;

  const handleMapLayersClick = () => {
    if (isMobile) {
      showModal = !showModal;
    } else {
      showFlyout = !showFlyout;
    }
  };

  const handleStyleSelect = (style: MapStyle) => {
    onMapStyleChange(style);
  };

  const handleModalClose = () => {
    showModal = false;
  };

  const refreshSpecies = () => {
    cache.invalidate(CACHE_KEYS.SPECIES);
    retryCount = 0;
    loadSpecies();
  };

  // Load species data
  const loadSpecies = async () => {
    loading = true;
    error = null;

    try {
      // Check cache first
      const cachedData = cache.get<string[]>(CACHE_KEYS.SPECIES);
      if (cachedData) {
        console.log('Using cached species data:', cachedData);
        speciesOptions = cachedData;
        isUsingCachedSpecies = true;
        loading = false;
        return;
      }

      // Fetch from API if not cached
      const response = await fetch('/api/species');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Raw species data:', data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        const processedSpecies = data
          .filter((item: any) => item && typeof item === 'object' && 'species_name' in item)
          .map((item: any) => item.species_name)
          .filter((name: string) => name && typeof name === 'string')
          .sort((a: string, b: string) => a.localeCompare(b));
        
        console.log('Processed species options:', processedSpecies);
        speciesOptions = processedSpecies;
        isUsingCachedSpecies = false;
        
        // Cache the processed data for 24 hours
        cache.set(CACHE_KEYS.SPECIES, processedSpecies, CACHE_TTL.SPECIES);
      } else {
        throw new Error('Invalid species data format');
      }
    } catch (err) {
      console.error('Failed to load species:', err);
      error = err instanceof Error ? err.message : 'Failed to load species';
      
      // Retry logic
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying species load (${retryCount}/${maxRetries})...`);
        setTimeout(loadSpecies, 1000 * retryCount);
      }
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    loadSpecies();
  });
</script>

{#if isMobile}
  <!-- Mobile Layout: Thumb-Driven HUD -->
  
  <!-- Top Left: Weather Widget (Passive Status Monitor) -->
  <div class="fixed top-4 left-4 bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl z-50 pointer-events-none">
    <div class="flex items-center gap-2">
      <WeatherWidget 
        temperature={temperature} 
        condition={weatherCondition} 
        moonPhase={moonPhase}
        compact={true}
      />
    </div>
  </div>
  
  <!-- Top Right: Map Tools (Rarely Used Actions) -->
  <div class="fixed top-4 right-4 flex gap-2 z-50 pointer-events-auto">
    <!-- Layers Button -->
    <div class="bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl hover:bg-[#1e1e2e]/80 transition-all duration-200">
      <button 
        class="text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors flex items-center justify-center"
        on:click={handleMapLayersClick}
        title="Map Layers"
      >
        ⚙️
      </button>
    </div>
  </div>
  
  <!-- Bottom Edge: Filter Dock (Primary Navigation Controller) -->
  <div class="fixed bottom-0 left-0 right-0 bg-[#1e1e2e]/70 backdrop-blur-xl border-t border-white/10 rounded-t-2xl shadow-2xl z-50 pointer-events-auto">
    <div class="flex items-center justify-between p-4">
      <!-- Menu Icon (Left) -->
      <div class="bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/10 rounded-lg p-3 h-11 flex items-center justify-center">
        <button class="text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors" title="Main Menu" on:click={() => {
          const menuEvent = new CustomEvent('toggleMenu');
          window.dispatchEvent(menuEvent);
        }}>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      <!-- Horizontal Chip Carousel (Center/Right) -->
      <div class="flex-1 ml-4 overflow-x-auto scrollbar-hide">
        <div class="flex gap-2 flex-nowrap">
          {#if loading}
            <div class="text-[#a6adc8] text-sm h-11 flex items-center">
              Loading species...
            </div>
          {:else if error}
            <div class="text-[#f38ba8] text-sm h-11 flex items-center">
              ⚠️ Error loading
              <button 
                class="ml-2 text-xs underline hover:text-[#f2cdcd]" 
                on:click={refreshSpecies}
                title="Refresh species data"
              >
                Retry
              </button>
            </div>
          {:else}
            {#each speciesOptions as species (species)}
              <FilterChip 
                label={species}
                active={selectedSpecies.includes(species as string)}
                onClick={() => onToggleSpecies(species as string)}
              />
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Bottom Right: Primary Action (Critical In-the-Moment Action) -->
  <div class="fixed bottom-20 right-4 bg-[#cba6f7] rounded-full p-4 shadow-xl hover:bg-[#b4a8f5] transition-all duration-200 z-50 pointer-events-auto">
    <button 
      class="text-[#1e1e2e] text-xl flex items-center justify-center"
      on:click={onLogCatch}
      title="Log Catch"
    >
      🎣
    </button>
  </div>
{:else}
  <!-- Desktop Layout: Floating Command Card (Top Left) -->
  <div class="fixed top-6 left-6 w-[380px] bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 pointer-events-auto">
    <!-- Header Row -->
    <div class="flex justify-between items-center p-4 border-b border-white/10">
      <!-- Hamburger Menu -->
      <button class="text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors p-2 hover:bg-white/5 rounded-lg" title="Main Menu" on:click={() => {
        const menuEvent = new CustomEvent('toggleMenu');
        window.dispatchEvent(menuEvent);
      }}>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      
      <!-- User Avatar -->
      <button class="w-8 h-8 bg-[#89b4fa] rounded-full flex items-center justify-center text-[#1e1e2e] font-semibold text-sm hover:bg-[#b4f8f8] transition-colors cursor-pointer" title="User Profile" on:click={() => {
        const profileEvent = new CustomEvent('toggleProfile');
        window.dispatchEvent(profileEvent);
      }}>
        U
      </button>
    </div>
    
    <!-- Content Area -->
    <div class="p-5 overflow-hidden">
      <!-- Current Conditions Section -->
      <div class="mb-5">
        <h3 class="text-[#cdd6f4] font-semibold text-sm tracking-wide mb-3">Current Conditions</h3>
        <div class="bg-[#1e1e2e]/50 rounded-lg p-4 border border-white/5">
          <!-- Go/No-Go Weather Info -->
          <div class="flex justify-between items-center mb-3">
            <div>
              <h4 class="text-[#cdd6f4] font-medium">Weather Status</h4>
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
          
          <!-- Quick Filters -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-[#cdd6f4] font-medium text-sm tracking-wide">Quick Filters</h4>
              {#if isUsingCachedSpecies}
                <button 
                  class="text-[#89b4fa] text-xs hover:text-[#b4befe] transition-colors opacity-70 hover:opacity-100 flex items-center gap-1"
                  on:click={refreshSpecies}
                  title="Refresh species data"
                >
                  <span class="text-[10px]">Cached</span>
                  🔄
                </button>
              {/if}
            </div>
            {#if loading}
              <div class="text-[#a6adc8] text-sm py-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-[#cba6f7] rounded-full animate-pulse"></div>
                  Loading species{retryCount > 0 ? `... (retry ${retryCount}/${maxRetries})` : '...'}
                </div>
              </div>
            {:else if error}
              <div class="text-[#f38ba8] text-sm py-2">
                <div class="flex items-center gap-2">
                  ⚠️ 
                  <span>Error: {error}</span>
                  <button 
                    class="ml-2 text-xs underline hover:text-[#f2cdcd] transition-colors" 
                    on:click={refreshSpecies}
                  >
                    Retry
                  </button>
                </div>
              </div>
            {:else}
              <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-hide pr-1 w-full">
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
      </div>
      
      <!-- Spot Details Section (Hidden by default, shown when location selected) -->
      <!-- This will be populated when user clicks a lake/spot -->
    </div>
  </div>

  <!-- Right Side Controls -->
  <div class="fixed right-6 top-1/2 -translate-y-1/2 pointer-events-auto z-20 flex flex-col gap-3">
    <!-- Map Layers Button (Top) -->
    <div bind:this={layersButtonRef} class="bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/10 rounded-full p-3 shadow-xl hover:bg-[#1e1e2e]/80 transition-all duration-200 flex items-center justify-center relative">
      <button 
        class="text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors text-lg flex items-center justify-center"
        on:click={handleMapLayersClick}
        title="Map Layers"
      >
        ⚙️
      </button>
      
      <!-- Desktop Flyout -->
      <MapLayersFlyout 
        isOpen={showFlyout}
        currentStyle={currentMapStyle}
        onStyleSelect={handleStyleSelect}
        buttonRef={layersButtonRef}
      />
    </div>
    
    <!-- Zoom Controls -->
    <div class="bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-xl hover:bg-[#1e1e2e]/80 transition-all duration-200">
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
    
    <!-- Log Catch FAB (Bottom Right) -->
    <div class="bg-[#cba6f7] rounded-full p-4 shadow-xl hover:bg-[#b4a8f5] transition-all duration-200 flex items-center justify-center">
      <button 
        class="text-[#1e1e2e] text-xl flex items-center justify-center"
        on:click={onLogCatch}
        title="Log Catch"
      >
        🎣
      </button>
    </div>
  </div>
{/if}

<!-- Mobile Map Layers Modal -->
{#if isMobile}
  <MapLayersModal 
    isOpen={showModal}
    currentStyle={currentMapStyle}
    onStyleSelect={handleStyleSelect}
    onClose={handleModalClose}
  />
{/if}

