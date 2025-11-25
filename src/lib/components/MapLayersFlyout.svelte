<!-- Map Layers Flyout - Desktop Component -->
<script lang="ts">
  import type { MapStyle } from '$lib/config/map';
  import { MAP_STYLES } from '$lib/config/map';

  export let isOpen: boolean = false;
  export let currentStyle: MapStyle = 'structure';
  export let onStyleSelect: (style: MapStyle) => void = () => {};
  export let buttonRef: HTMLDivElement | null = null;

  const selectStyle = (style: MapStyle) => {
    onStyleSelect(style);
    isOpen = false;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (buttonRef && !buttonRef.contains(e.target as Node)) {
      isOpen = false;
    }
  };

  $: if (isOpen) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
</script>

{#if isOpen}
  <div 
    class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1e1e2e]/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl z-50 pointer-events-auto transition-all duration-200 ease-out"
    style="transform: translate(-10px, -50%) scale(0.95); opacity: 0; animation: flyoutIn 0.2s ease-out forwards;"
  >
    <div class="flex gap-2">
      {#each Object.entries(MAP_STYLES) as [key, style]}
        <button
          class="flex flex-col items-center p-2 rounded-lg transition-all duration-200 hover:bg-white/5 group"
          class:border-2={currentStyle === key}
          class:border-[#cba6f7]={currentStyle === key}
          class:border-transparent={currentStyle !== key}
          on:click={() => selectStyle(key as MapStyle)}
        >
          <div class="w-12 h-12 rounded-lg mb-1 flex items-center justify-center text-2xl
            {currentStyle === key ? 'bg-[#cba6f7]/20 text-[#cba6f7]' : 'bg-[#1e1e2e]/50 text-[#a6adc8]'}
            group-hover:bg-[#cba6f7]/10 group-hover:text-[#cba6f7] transition-colors"
          >
            {style.icon}
          </div>
          <div class="text-xs font-medium transition-colors
            {currentStyle === key ? 'text-[#cba6f7]' : 'text-[#a6adc8]'}
            group-hover:text-[#cba6f7]"
          >
            {style.name}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <style>
    @keyframes flyoutIn {
      to {
        transform: translate(0, -50%) scale(1);
        opacity: 1;
      }
    }
  </style>
{/if}
