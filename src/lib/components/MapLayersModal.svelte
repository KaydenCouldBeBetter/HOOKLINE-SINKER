<!-- Map Layers Modal - Mobile Component -->
<script lang="ts">
  import type { MapStyle } from '$lib/config/map';
  import { MAP_STYLES } from '$lib/config/map';

  export let isOpen: boolean = false;
  export let currentStyle: MapStyle = 'structure';
  export let onStyleSelect: (style: MapStyle) => void = () => {};

  const selectStyle = (style: MapStyle) => {
    onStyleSelect(style);
    isOpen = false;
  };

  const handleBackdropClick = () => {
    isOpen = false;
  };
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 pointer-events-auto"
    on:click={handleBackdropClick}
  />
  
  <!-- Bottom Sheet -->
  <div 
    class="fixed bottom-0 left-0 right-0 bg-[#1e1e2e]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl shadow-2xl z-50 pointer-events-auto transition-transform duration-300 ease-out"
    style="transform: translateY(100%); animation: slideUp 0.3s ease-out forwards;"
  >
    <!-- Handle Bar -->
    <div class="flex justify-center py-3">
      <div class="w-12 h-1 bg-white/20 rounded-full"></div>
    </div>
    
    <!-- Header -->
    <div class="px-6 pb-4">
      <h2 class="text-[#cdd6f4] text-lg font-semibold">Map Style</h2>
      <p class="text-[#a6adc8] text-sm mt-1">Choose your preferred map view</p>
    </div>
    
    <!-- Style Grid -->
    <div class="px-6 pb-6">
      <div class="grid grid-cols-1 gap-4">
        {#each Object.entries(MAP_STYLES) as [key, style]}
          <button
            class="flex items-center p-4 rounded-xl border-2 transition-all duration-200 hover:bg-white/5 group border-white/10"
            class:border-[#cba6f7]={currentStyle === key}
            on:click={() => selectStyle(key as MapStyle)}
          >
            <!-- Icon -->
            <div class="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mr-4 bg-[#1e1e2e]/50 text-[#a6adc8] group-hover:bg-[#cba6f7]/10 group-hover:text-[#cba6f7] transition-colors"
              class:bg-[#cba6f7]/20={currentStyle === key}
              class:text-[#cba6f7]={currentStyle === key}
            >
              {style.icon}
            </div>
            
            <!-- Content -->
            <div class="flex-1 text-left">
              <h3 class="text-[#cdd6f4] font-semibold text-base mb-1 group-hover:text-[#cba6f7] transition-colors"
                class:text-[#cba6f7]={currentStyle === key}
              >
                {style.name}
              </h3>
              <p class="text-[#a6adc8] text-sm leading-relaxed">
                {style.description}
              </p>
            </div>
            
            <!-- Active Indicator -->
            {#if currentStyle === key}
              <div class="w-6 h-6 rounded-full bg-[#cba6f7] flex items-center justify-center ml-4">
                <svg class="w-4 h-4 text-[#1e1e2e]" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <style>
    @keyframes slideUp {
      to {
        transform: translateY(0);
      }
    }
  </style>
{/if}
