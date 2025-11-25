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
    class="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[#1e1e2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 w-80"
    role="dialog"
    aria-modal="true"
    aria-labelledby="flyout-title"
  >
    <div class="p-4 h-full flex flex-col" style="max-height: 60vh;">
      <h3 id="flyout-title" class="text-[#cdd6f4] text-sm font-semibold mb-3 flex-shrink-0">Map Style</h3>
      <div class="overflow-y-auto scrollbar-hide" style="flex: 1; min-height: 0;">
        {#each Object.entries(MAP_STYLES) as [key, style]}
          <button
            class="flex items-center p-3 rounded-lg border transition-all hover:bg-white/5 group border-white/10 w-full mb-2"
            class:border-[#cba6f7]={currentStyle === key}
            on:click={() => selectStyle(key as MapStyle)}
          >
            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-3 bg-[#1e1e2e]/50 text-[#a6adc8] group-hover:bg-[#cba6f7]/10 group-hover:text-[#cba6f7] transition-colors {currentStyle === key ? 'bg-[#cba6f7]/20 text-[#cba6f7]' : ''}">
              {style.icon}
            </div>
            <div class="flex-1 text-left">
              <h4 class="text-[#cdd6f4] font-medium text-sm mb-1 group-hover:text-[#cba6f7] {currentStyle === key ? 'text-[#cba6f7]' : ''}">
                {style.name}
              </h4>
              <p class="text-[#a6adc8] text-xs">{style.description}</p>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}