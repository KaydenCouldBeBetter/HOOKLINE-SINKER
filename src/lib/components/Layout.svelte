<!-- Responsive Layout - Midnight Standard v4.0 -->
<script lang="ts">
  import FilterChip from './FilterChip.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
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
  export let isMobile: boolean = false;
  export let currentMapStyle: MapStyle = 'structure';
  
  // Recommended Spots props
  export let showRecommendedOnly: boolean = false;
  export let toggleShowRecommended: () => void = () => {};
  export let userLocation: { lat: number; lng: number } | null = null;
  export let searchRadius: number = 25;
  export let loadRecommendedSpots: () => void = () => {};
  export let recommendationError: string | null = null;
  export let recommendedSpots: any[] = [];
  export let isLoadingRecommendations: boolean = false;
  export let mapInstance: any = null;
  export let mapMarkers: any[] = [];
  
  // Map styles data
  const MAP_STYLES = [
    { key: 'structure', name: 'Midnight Water', icon: '🌊' },
    { key: 'satellite', name: 'Satellite', icon: '🛰️' },
    { key: 'terrain', name: 'Terrain', icon: '⛰️' },
    { key: 'night', name: 'Night', icon: '🌙' }
  ];

  // Local state
  let speciesOptions: string[] = [];
  let loading: boolean = false;
  let error: string | null = null;
  let retryCount: number = 0;
  const maxRetries: number = 3;
  let isUsingCachedSpecies: boolean = false;

  // Map layers UI state (no longer needed)
  // Tab state for unified information architecture
  let activeTab: 'plan' | 'map' | 'spots' = 'plan';

  // Event handlers
  const handleStyleSelect = (style: MapStyle) => {
    // Dispatch custom event for parent component to handle
    const mapStyleEvent = new CustomEvent('mapStyleChange', { detail: style });
    window.dispatchEvent(mapStyleEvent);
  };

  const refreshSpecies = () => {
    cache.invalidate(CACHE_KEYS.SPECIES);
    retryCount = 0;
    loadSpecies();
  };

  // Load species data with caching
  const loadSpecies = async () => {
    loading = true;
    error = null;

    try {
      // Check cache first
      const cachedData = cache.get<string[]>(CACHE_KEYS.SPECIES);
      if (cachedData) {
        speciesOptions = cachedData;
        isUsingCachedSpecies = true;
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

    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load species';
      
      // Retry logic
      if (retryCount < maxRetries) {
        retryCount++;
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
  <div class="fixed top-4 left-4 bg-midnight-glass backdrop-blur-xl border border-midnight-border rounded-lg p-3 shadow-xl z-50 pointer-events-none">
    <div class="flex items-center gap-2">
      <WeatherWidget 
        temperature={temperature} 
        condition={weatherCondition} 
        moonPhase={moonPhase}
        compact={true}
      />
    </div>
  </div>
  
    
  <!-- Bottom Edge: Tabbed Control Dock -->
  <div class="fixed bottom-0 left-0 right-0 bg-midnight-glass backdrop-blur-xl border-t border-midnight-border rounded-t-2xl shadow-2xl z-50 pointer-events-auto">
    <!-- Tab Toggle Header -->
    <div class="flex justify-center p-3 border-b border-midnight-border">
      <div class="flex bg-midnight-surfaceDark rounded-lg p-1">
        <button 
          class="px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            activeTab === 'plan' 
              ? 'bg-midnight-primary text-midnight-glass' 
              : 'text-midnight-textSecondary hover:text-midnight-textPrimary'
          }"
          on:click={() => activeTab = 'plan'}
        >
          Plan
        </button>
        <button 
          class="px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            activeTab === 'map' 
              ? 'bg-midnight-primary text-midnight-glass' 
              : 'text-midnight-textSecondary hover:text-midnight-textPrimary'
          }"
          on:click={() => activeTab = 'map'}
        >
          Map
        </button>
        <button 
          class="px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            activeTab === 'spots' 
              ? 'bg-midnight-primary text-midnight-glass' 
              : 'text-midnight-textSecondary hover:text-midnight-textPrimary'
          }"
          on:click={() => activeTab = 'spots'}
        >
          Spots
        </button>
      </div>
    </div>
    
    <!-- Tab Content -->
    <div class="p-4">
      {#if activeTab === 'plan'}
        <!-- Plan Tab: Horizontal Filter Chips Only -->
        <div class="flex items-center gap-3">
          <!-- Horizontal Chip Carousel (Full Width) -->
          <div class="flex-1 overflow-x-auto scrollbar-hide">
            <div class="flex gap-2 flex-nowrap">
              {#if loading}
                <div class="text-midnight-textSecondary text-sm h-11 flex items-center">
                  Loading species...
                </div>
              {:else if error}
                <div class="text-midnight-warning text-sm h-11 flex items-center">
                  ⚠️ Error loading
                  <button 
                    class="ml-2 text-xs underline hover:text-midnight-textSecondary" 
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
      {:else if activeTab === 'map'}
        <!-- Map Tab: Map Style Controls -->
        <div class="space-y-4">
          <div class="text-center">
            <h3 class="text-midnight-textPrimary font-semibold text-sm tracking-wide mb-4">Map Style</h3>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            {#each MAP_STYLES as style (style.key)}
              <button
                class="flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                  currentMapStyle === style.key
                    ? 'bg-midnight-primary text-midnight-glass border-midnight-primary'
                    : 'bg-midnight-surfaceDark text-midnight-textSecondary border-midnight-border hover:bg-midnight-surfaceLight hover:text-midnight-textPrimary'
                }"
                on:click={() => handleStyleSelect(style.key as MapStyle)}
                title={style.name}
              >
                <span class="text-2xl mb-2">{style.icon}</span>
                <span class="text-xs font-medium">{style.name}</span>
              </button>
            {/each}
          </div>
          
          <div class="text-center text-xs text-midnight-textMuted mt-4">
            Choose how you want to view the fishing map
          </div>
        </div>
      {:else}
        <!-- Spots Tab: Vertical Scrolling List -->
        <div class="max-h-48 overflow-y-auto scrollbar-hide">
          <!-- Toggle Switch Row -->
          <div class="mb-3">
            <label class="toggle-switch flex justify-between items-center text-sm text-midnight-textSecondary cursor-pointer">
              <span>{showRecommendedOnly ? 'Best Only' : 'All Spots'}</span>
              <div class="relative inline-block w-11 h-5.5 ml-2">
                <input 
                  type="checkbox" 
                  bind:checked={showRecommendedOnly} 
                  on:click={toggleShowRecommended} 
                  class="opacity-0 w-0 h-0 absolute"
                >
                <span class="slider round"></span>
              </div>
            </label>
          </div>
          
          {#if userLocation}
            {#if recommendationError}
              <div class="p-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded text-sm mb-2">
                {recommendationError}
              </div>
            {/if}
            
            {#if recommendedSpots.length > 0}
              <div class="space-y-1.5">
                {#each recommendedSpots.slice(0, 5) as spot, i}
                  <button
                    type="button"
                    aria-label={`Navigate to ${spot.location.name || 'Fishing Spot'}, score ${Math.round(spot.score)}`}
                    on:click|stopPropagation={() => {
                      if (mapInstance) {
                        // First, close any open popups
                        mapMarkers.forEach(m => {
                          const popup = m.getPopup();
                          if (popup && popup.isOpen()) {
                            m.togglePopup();
                          }
                        });
                        
                        // Then fly to the selected spot
                        mapInstance.flyTo({
                          center: [spot.location.longitude, spot.location.latitude],
                          zoom: 12,
                          essential: true
                        });
                        
                        // Find and highlight the marker
                        const marker = mapMarkers.find(m => {
                          const lngLat = m.getLngLat();
                          return lngLat.lng === spot.location.longitude && 
                                 lngLat.lat === spot.location.latitude;
                        });
                        
                        if (marker) {
                          setTimeout(() => {
                            marker.getElement().style.transform = 'scale(1.3)';
                            marker.getElement().style.zIndex = '1000';
                            marker.togglePopup();
                          }, 300);
                        }
                      }
                    }}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.target?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                      }
                    }}
                    class="p-2 bg-surface-dark/80 border border-white/5 rounded cursor-pointer transition-colors w-full text-left hover:bg-surface-dark"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-medium text-sm text-midnight-textPrimary">{i + 1}. {spot.location.name || 'Fishing Spot'}</span>
                      <span class="font-bold text-cyan-300">{Math.round(spot.score)}</span>
                    </div>
                    <div class="text-xs text-midnight-textMuted mt-0.5">
                      {spot.distance?.toFixed(1) || '0.0'} mi away
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
          {:else}
            <div class="text-midnight-textMuted text-sm text-center py-5">
              {isLoadingRecommendations ? 'Detecting your location...' : 'Enable location access to find the best fishing spots near you.'}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  
    
  {:else}
  <!-- Desktop Layout: Floating Command Card (Top Left) -->
  <div class="fixed top-6 left-6 w-[380px] bg-midnight-glass backdrop-blur-xl border border-midnight-border rounded-2xl shadow-2xl z-50 pointer-events-auto">
    <!-- Header Row with Tabs -->
    <div class="flex justify-between items-center p-4 border-b border-midnight-border">
      <!-- Tab Navigation -->
      <div class="flex bg-midnight-surfaceDark rounded-lg p-1">
        <button 
          class="px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            activeTab === 'plan' 
              ? 'bg-midnight-primary text-midnight-glass' 
              : 'text-midnight-textSecondary hover:text-midnight-textPrimary'
          }"
          on:click={() => activeTab = 'plan'}
        >
          Plan
        </button>
        <button 
          class="px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            activeTab === 'spots' 
              ? 'bg-midnight-primary text-midnight-glass' 
              : 'text-midnight-textSecondary hover:text-midnight-textPrimary'
          }"
          on:click={() => activeTab = 'spots'}
        >
          Spots
        </button>
      </div>
      
      <!-- User Avatar -->
      <button class="w-8 h-8 bg-midnight-water rounded-full flex items-center justify-center text-midnight-glass font-semibold text-sm hover:bg-midnight-water/80 transition-colors cursor-pointer" title="User Profile" on:click={() => {
        const profileEvent = new CustomEvent('toggleProfile');
        window.dispatchEvent(profileEvent);
      }}>
        U
      </button>
    </div>
    
    <!-- Tab Content Area -->
    <div class="p-5 overflow-hidden">
      {#if activeTab === 'plan'}
        <!-- Plan Tab: Weather and Filters -->
        <div class="space-y-4">
          <!-- Current Conditions Section -->
          <div>
            <h3 class="text-midnight-textPrimary font-semibold text-sm tracking-wide mb-3">Current Conditions</h3>
            <div class="bg-midnight-surfaceDark rounded-lg p-4 border border-midnight-border/5">
              <!-- Go/No-Go Weather Info -->
              <div class="flex justify-between items-center mb-3">
                <div>
                  <h4 class="text-midnight-textPrimary font-medium">Weather Status</h4>
                  {#if isUsingCachedWeather}
                    <div class="text-midnight-water text-xs mt-1">Cached data</div>
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
                      class="text-midnight-water text-xs hover:text-midnight-water/80 transition-colors opacity-70 hover:opacity-100"
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
                  <h4 class="text-midnight-textPrimary font-medium text-sm tracking-wide">Quick Filters</h4>
                  {#if isUsingCachedSpecies}
                    <button 
                      class="text-midnight-water text-xs hover:text-midnight-water/80 transition-colors opacity-70 hover:opacity-100"
                      on:click={refreshSpecies}
                      title="Refresh species data"
                    >
                      🔄
                    </button>
                  {/if}
                </div>
                <div class="flex flex-wrap gap-2">
                  {#if loading}
                    <div class="text-midnight-textSecondary text-sm py-2">Loading species...</div>
                  {:else if error}
                    <div class="text-midnight-warning text-sm py-2">
                      ⚠️ Error loading
                      <button 
                        class="ml-2 text-xs underline hover:text-midnight-textSecondary" 
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
              
              <!-- Map Styles -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-midnight-textPrimary font-medium text-sm tracking-wide">Map Style</h4>
                </div>
                <div class="flex flex-wrap gap-2">
                  {#each MAP_STYLES as style (style.key)}
                    <button
                      class="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border ${
                        currentMapStyle === style.key
                          ? 'bg-midnight-primary text-midnight-glass border-midnight-primary'
                          : 'bg-midnight-surfaceDark text-midnight-textSecondary border-midnight-border hover:bg-midnight-surfaceLight hover:text-midnight-textPrimary'
                      }"
                      on:click={() => handleStyleSelect(style.key as MapStyle)}
                      title={style.name}
                    >
                      <span class="mr-1">{style.icon}</span>
                      {style.name}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <!-- Spots Tab: Recommended Fishing Spots -->
        <div class="h-96 overflow-y-auto scrollbar-hide">
          <h3 class="text-midnight-textPrimary font-semibold text-sm tracking-wide mb-3">Recommended Fishing Spots</h3>
          
          <!-- Toggle Switch Row -->
          <div class="mb-4">
            <label class="toggle-switch flex justify-between items-center text-sm text-midnight-textSecondary cursor-pointer">
              <span>{showRecommendedOnly ? 'Best Only' : 'All Spots'}</span>
              <div class="relative inline-block w-11 h-5.5 ml-2">
                <input 
                  type="checkbox" 
                  bind:checked={showRecommendedOnly} 
                  on:click={toggleShowRecommended} 
                  class="opacity-0 w-0 h-0 absolute"
                >
                <span class="slider round"></span>
              </div>
            </label>
          </div>
          
          {#if userLocation}
            <div class="mb-3">
              <label for="radius-slider" class="block mb-1.5 text-xs text-midnight-textSecondary">
                Radius: {searchRadius}mi
              </label>
              <input 
                id="radius-slider"
                type="range" 
                min="5" 
                max="50" 
                step="5"
                bind:value={searchRadius}
                on:input={() => loadRecommendedSpots()}
                class="w-full cursor-pointer h-1 bg-white/10 rounded"
                aria-label="Search radius in miles"
              >
              <div class="flex justify-between text-xs text-midnight-textMuted mt-0.5">
                <span>5mi</span>
                <span>50mi</span>
              </div>
            </div>
            
            {#if recommendationError}
              <div class="mt-2.5 p-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded text-sm">
                {recommendationError}
              </div>
            {/if}
            
            {#if recommendedSpots.length > 0}
              <div class="mt-2.5 border-t border-midnight-border pt-2">
                <h4 class="text-xs text-midnight-textSecondary mb-1.5">Top Spots:</h4>
                <div class="max-h-48 overflow-y-auto scrollbar-hide">
                  {#each recommendedSpots.slice(0, 5) as spot, i}
                    <button
                      type="button"
                      aria-label={`Navigate to ${spot.location.name || 'Fishing Spot'}, score ${Math.round(spot.score)}`}
                      on:click|stopPropagation={() => {
                        if (mapInstance) {
                          // First, close any open popups
                          mapMarkers.forEach(m => {
                            const popup = m.getPopup();
                            if (popup && popup.isOpen()) {
                              m.togglePopup();
                            }
                          });
                          
                          // Then fly to the selected spot
                          mapInstance.flyTo({
                            center: [spot.location.longitude, spot.location.latitude],
                            zoom: 12,
                            essential: true
                          });
                          
                          // Find and highlight the marker
                          const marker = mapMarkers.find(m => {
                            const lngLat = m.getLngLat();
                            return lngLat.lng === spot.location.longitude && 
                                   lngLat.lat === spot.location.latitude;
                          });
                          
                          if (marker) {
                            setTimeout(() => {
                              marker.getElement().style.transform = 'scale(1.3)';
                              marker.getElement().style.zIndex = '1000';
                              marker.togglePopup();
                            }, 300);
                          }
                        }
                      }}
                      on:keydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.target?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        }
                      }}
                      class="p-2 mb-1.5 bg-surface-dark/80 border border-white/5 rounded cursor-pointer transition-colors w-full text-left hover:bg-surface-dark"
                      on:mouseenter={() => {
                        const marker = mapMarkers.find(m => {
                          const lngLat = m.getLngLat();
                          return lngLat.lng === spot.location.longitude && 
                                 lngLat.lat === spot.location.latitude;
                        });
                        if (marker) {
                          marker.getElement().style.transform = 'scale(1.3)';
                          marker.getElement().style.zIndex = '1000';
                          marker.togglePopup();
                        }
                      }}
                      on:mouseleave={() => {
                        const marker = mapMarkers.find(m => {
                          const lngLat = m.getLngLat();
                          return lngLat.lng === spot.location.longitude && 
                                 lngLat.lat === spot.location.latitude;
                        });
                        if (marker) {
                          marker.getElement().style.transform = 'scale(1)';
                          marker.getElement().style.zIndex = '1';
                          if (marker.getPopup().isOpen()) {
                            marker.togglePopup();
                          }
                        }
                      }}
                    >
                      <div class="flex justify-between items-center">
                        <span class="font-medium text-sm text-midnight-textPrimary">{i + 1}. {spot.location.name || 'Fishing Spot'}</span>
                        <span class="font-bold text-cyan-300">{Math.round(spot.score)}</span>
                      </div>
                      <div class="text-xs text-midnight-textMuted mt-0.5">
                        {spot.distance?.toFixed(1) || '0.0'} mi away
                      </div>
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          {:else}
            <div class="text-midnight-textMuted text-sm text-center py-5">
              {isLoadingRecommendations ? 'Detecting your location...' : 'Enable location access to find the best fishing spots near you.'}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Right Side Controls -->
  <div class="fixed right-6 top-1/2 -translate-y-1/2 pointer-events-auto z-20 flex flex-col gap-3">
    <!-- Zoom Controls -->
    <div class="bg-midnight-glass backdrop-blur-xl border border-midnight-border rounded-full p-2 shadow-xl hover:bg-midnight-surfaceLight transition-all duration-200">
      <div class="flex flex-col gap-1">
        <button 
          class="text-midnight-textPrimary hover:text-midnight-textSecondary transition-colors text-sm px-2 py-1 hover:bg-midnight-surfaceLight rounded flex items-center justify-center"
          on:click={() => {
            const mapEvent = new CustomEvent('mapZoomIn');
            window.dispatchEvent(mapEvent);
          }}
          title="Zoom In"
        >
          +
        </button>
        <div class="h-px bg-midnight-border mx-1"></div>
        <button 
          class="text-midnight-textPrimary hover:text-midnight-textSecondary transition-colors text-sm px-2 py-1 hover:bg-midnight-surfaceLight rounded flex items-center justify-center"
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
  </div>
{/if}


<style>
	.toggle-switch {
		display: flex;
		align-items: center;
		min-height: 40px;
	}

	.toggle-switch input {
		opacity: 0;
		left: 0;
	}

	.slider {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #45475a; /* midnight-surfaceLight */
		transition: .4s;
		border-radius: 24px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 16px;
		width: 16px;
		left: 4px;
		bottom: 4px;
		background-color: #cdd6f4;
		transition: .4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: #cba6f7;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #cba6f7;
	}

	input:checked + .slider:before {
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 24px;
	}

	.slider.round:before {
		border-radius: 50%;
	}

	/* Improve touch targets */
	.toggle-switch > div {
		height: 24px;
		display: flex;
		align-items: center;
	}
</style>

