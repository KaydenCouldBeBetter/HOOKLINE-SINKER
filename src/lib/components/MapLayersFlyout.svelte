<!-- Map Layers Flyout - Midnight Standard v4.0 -->
<script lang="ts">
  import type { MapStyle } from '$lib/config/map';
  import { MAP_STYLES } from '$lib/config/map';

  export let isOpen: boolean = false;
  export let currentStyle: MapStyle = 'structure';
  export let onStyleSelect: (style: MapStyle) => void = () => {};

  const selectStyle = (style: MapStyle) => {
    onStyleSelect(style);
  };
</script>

{#if isOpen}
  <div 
    class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-midnight-glass border border-midnight-border rounded-2xl shadow-2xl z-50 w-48"
    role="dialog"
    aria-modal="true"
    aria-labelledby="flyout-title"
  >
    <div class="p-4">
      <h3 id="flyout-title" class="text-midnight-textPrimary text-sm font-semibold mb-4">Map Style</h3>
      
      <div class="grid grid-cols-4 gap-2">
        {#each Object.entries(MAP_STYLES) as [key, style]}
          <button
            class="group relative aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 border-midnight-border hover:border-midnight-primary/30 {currentStyle === key ? 'border-midnight-primary bg-midnight-primary/10' : ''}"
            on:click={() => selectStyle(key as MapStyle)}
            title={style.name}
          >
            <div class="w-full h-full flex items-center justify-center text-lg">
              {style.icon}
            </div>
            {#if currentStyle === key}
              <div class="absolute -inset-0.5 rounded-lg border-2 border-midnight-primary pointer-events-none"></div>
            {/if}
          </button>
        {/each}
      </div>
      
      <div class="mt-3 text-xs text-midnight-textSecondary text-center">
        {MAP_STYLES[currentStyle].name}
      </div>
    </div>
  </div>
{/if}