<!-- Map Style Selector - Midnight Standard v3.1 -->
<script lang="ts">
  import { MAP_STYLES, type MapStyle } from '$lib/config/map';
  import UniversalPanel from './UniversalPanel.svelte';
  import { createEventDispatcher } from 'svelte';

  export let currentStyle: MapStyle = 'structure';
  export let isMobile: boolean = false;

  // Ensure currentStyle is always valid
  $: safeCurrentStyle = currentStyle && MAP_STYLES[currentStyle] ? currentStyle : 'structure';

  const dispatch = createEventDispatcher<{
    styleChange: MapStyle;
  }>();

  const styleKeys: MapStyle[] = Object.keys(MAP_STYLES) as MapStyle[];
  let isOpen = false;

  const selectStyle = (style: MapStyle) => {
    if (!style || currentStyle === style) return;
    currentStyle = style;
    isOpen = false;
    dispatch('styleChange', style);
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

<div class="map-style-selector pointer-events-auto z-30">
  {#if isMobile}
    <!-- Mobile: Bottom left corner, above bottom sheet -->
    <div class="absolute left-4 bottom-20">
      <UniversalPanel padding="sm" className="min-w-48">
        <button 
          class="flex items-center gap-2 w-full text-midnight-textPrimary hover:text-midnight-textSecondary transition-colors"
          on:click={toggleOpen}
        >
          <span class="text-lg">{MAP_STYLES[safeCurrentStyle as MapStyle].icon}</span>
          <span class="text-sm font-medium">{MAP_STYLES[safeCurrentStyle as MapStyle].name}</span>
          <span class="ml-auto text-xs opacity-70">{isOpen ? '▼' : '▲'}</span>
        </button>
        
        {#if isOpen}
          <div class="mt-2 space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 border border-midnight-border bg-midnight-surfaceDark rounded-lg p-2">
            {#each styleKeys as style (style)}
              {@const currentStyleKey = style as MapStyle}
              <button
                class="flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors {
                  safeCurrentStyle === currentStyleKey 
                    ? 'bg-midnight-primary text-midnight-glass' 
                    : 'text-midnight-textSecondary hover:bg-midnight-surfaceDark hover:text-midnight-textPrimary'
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
    <!-- Desktop: Compact version for floating panel -->
    <div class="w-full">
      <button 
        class="flex items-center gap-2 w-full text-midnight-textPrimary hover:text-midnight-textSecondary transition-colors bg-midnight-surfaceDark rounded-lg px-3 py-2 text-sm border border-midnight-border"
        on:click={toggleOpen}
      >
        <span class="text-base">{MAP_STYLES[safeCurrentStyle as MapStyle].icon}</span>
        <span class="font-medium">{MAP_STYLES[safeCurrentStyle as MapStyle].name}</span>
        <span class="ml-auto text-xs opacity-70">{isOpen ? '▼' : '▲'}</span>
      </button>
      
      {#if isOpen}
        <div class="mt-2 space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 border border-midnight-border bg-midnight-surfaceDark rounded-lg p-2">
          {#each styleKeys as style (style)}
            {@const currentStyleKey = style as MapStyle}
            <button
              class="flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors text-sm {
                safeCurrentStyle === currentStyleKey 
                  ? 'bg-midnight-primary text-midnight-glass' 
                  : 'text-midnight-textSecondary hover:bg-midnight-surfaceDark hover:text-midnight-textPrimary'
              }"
              on:click={() => selectStyle(currentStyleKey)}
            >
              <span class="text-base">{MAP_STYLES[currentStyleKey].icon}</span>
              <div class="flex-1">
                <div class="font-medium">{MAP_STYLES[currentStyleKey].name}</div>
                <div class="text-xs opacity-70">{MAP_STYLES[currentStyleKey].description}</div>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .map-style-selector {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
</style>
