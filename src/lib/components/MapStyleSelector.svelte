<!-- Map Style Selector - Midnight Standard v3.1 -->
<script lang="ts">
  import { MAP_STYLES, type MapStyle } from '$lib/config/map';
  import UniversalPanel from './UniversalPanel.svelte';
  import { createEventDispatcher } from 'svelte';

  export let currentStyle: MapStyle = 'midnight-water';
  export let isMobile: boolean = false;

  // Ensure currentStyle is always valid
  $: safeCurrentStyle = currentStyle && MAP_STYLES[currentStyle] ? currentStyle : 'midnight-water';

  const dispatch = createEventDispatcher<{
    styleChange: MapStyle;
  }>();

  const styleKeys: MapStyle[] = Object.keys(MAP_STYLES) as MapStyle[];
  let isOpen = false;

  const selectStyle = (style: MapStyle) => {
    console.log('Style selected in MapStyleSelector:', style);
    if (!style) {
      console.log('No style provided, skipping');
      return;
    }
    if (currentStyle === style) {
      console.log('Style is already active, skipping');
      return;
    }
    currentStyle = style;
    isOpen = false;
    dispatch('styleChange', style);
    console.log('Event dispatched for style:', style);
  };

  const toggleOpen = () => {
    isOpen = !isOpen;
  };

  // Close when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.map-style-selector')) {
      isOpen = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside);
  }
</script>

<div class="map-style-selector pointer-events-auto z-20">
  {#if isMobile}
    <!-- Mobile: Top right corner -->
    <div class="absolute right-4 top-16">
      <UniversalPanel padding="sm" className="min-w-48">
        <button 
          class="flex items-center gap-2 w-full text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors"
          on:click={toggleOpen}
        >
          <span class="text-lg">{MAP_STYLES[safeCurrentStyle].icon}</span>
          <span class="text-sm font-medium">{MAP_STYLES[safeCurrentStyle].name}</span>
          <span class="ml-auto text-xs opacity-70">{isOpen ? '▼' : '▲'}</span>
        </button>
        
        {#if isOpen}
          <div class="mt-2 space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
            {#each styleKeys as style (style)}
              {@const currentStyleKey = style as MapStyle}
              <button
                class="flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors {
                  safeCurrentStyle === currentStyleKey 
                    ? 'bg-[#cba6f7] text-[#1e1e2e]' 
                    : 'text-[#a6adc8] hover:bg-white/5 hover:text-[#cdd6f4]'
                }"
                on:click={() => selectStyle(currentStyleKey)}
              >
                <span class="text-base">{MAP_STYLES[currentStyleKey].icon}</span>
                <div class="flex-1">
                  <div class="text-sm font-medium">{MAP_STYLES[currentStyleKey].name}</div>
                  <div class="text-xs opacity-70">{MAP_STYLES[currentStyleKey].description}</div>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </UniversalPanel>
    </div>
  {:else}
    <!-- Desktop: Top right corner -->
    <div class="absolute right-4 top-16">
      <UniversalPanel padding="sm" className="min-w-64">
        <button 
          class="flex items-center gap-2 w-full text-[#cdd6f4] hover:text-[#f2cdcd] transition-colors"
          on:click={toggleOpen}
        >
          <span class="text-lg">{MAP_STYLES[safeCurrentStyle].icon}</span>
          <span class="text-sm font-medium">{MAP_STYLES[safeCurrentStyle].name}</span>
          <span class="ml-auto text-xs opacity-70">{isOpen ? '▼' : '▲'}</span>
        </button>
        
        {#if isOpen}
          <div class="mt-2 space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
            {#each styleKeys as style (style)}
              {@const currentStyleKey = style as MapStyle}
              <button
                class="flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors {
                  safeCurrentStyle === currentStyleKey 
                    ? 'bg-[#cba6f7] text-[#1e1e2e]' 
                    : 'text-[#a6adc8] hover:bg-white/5 hover:text-[#cdd6f4]'
                }"
                on:click={() => selectStyle(currentStyleKey)}
              >
                <span class="text-base">{MAP_STYLES[currentStyleKey].icon}</span>
                <div class="flex-1">
                  <div class="text-sm font-medium">{MAP_STYLES[currentStyleKey].name}</div>
                  <div class="text-xs opacity-70">{MAP_STYLES[currentStyleKey].description}</div>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </UniversalPanel>
    </div>
  {/if}
</div>

<style>
  .map-style-selector {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
