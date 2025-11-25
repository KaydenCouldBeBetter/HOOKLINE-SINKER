<script lang="ts">
  import type { MapStyle } from '$lib/config/map';
  import { MAP_STYLES } from '$lib/config/map';

  export let isOpen: boolean = false;
  export let currentStyle: MapStyle = 'structure';
  export let onStyleSelect: (style: MapStyle) => void = () => {};
  export let onClose: () => void = () => {};

  const selectStyle = (style: MapStyle) => {
    onStyleSelect(style);
    onClose();
  };
</script>

{#if isOpen}
  <button 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
    tabindex="-1"
    on:click={onClose}
    on:keydown={(e: KeyboardEvent) => e.key === 'Escape' && onClose()}
    aria-label="Close map layers"
  ></button>
  
  <div 
    class="fixed bottom-0 left-0 right-0 bg-[#1e1e2e]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl shadow-2xl z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="map-layers-title"
    tabindex="0"
    style="height: 70vh; max-height: 70vh;"
  >
    <div class="px-6 pb-6 h-full flex flex-col">
      <h2 id="map-layers-title" class="text-[#cdd6f4] text-lg font-semibold mb-4 flex-shrink-0">Map Style</h2>
      <div class="overflow-y-auto scrollbar-hide" style="flex: 1; min-height: 0;">
        {#each Object.entries(MAP_STYLES) as [key, style]}
          <button
            class="flex items-center p-4 rounded-xl border-2 transition-all hover:bg-white/5 group border-white/10 w-full mb-3"
            class:border-[#cba6f7]={currentStyle === key}
            on:click={() => selectStyle(key as MapStyle)}
          >
            <div class="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mr-4 bg-[#1e1e2e]/50 text-[#a6adc8] group-hover:bg-[#cba6f7]/10 group-hover:text-[#cba6f7] transition-colors {currentStyle === key ? 'bg-[#cba6f7]/20 text-[#cba6f7]' : ''}">
              {style.icon}
            </div>
            <div class="flex-1 text-left">
              <h3 class="text-[#cdd6f4] font-semibold text-base mb-1 group-hover:text-[#cba6f7] {currentStyle === key ? 'text-[#cba6f7]' : ''}">
                {style.name}
              </h3>
              <p class="text-[#a6adc8] text-sm">{style.description}</p>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
