<!-- Mobile Layout - Midnight Standard v3.1 -->
<script lang="ts">
  import FilterChip from './FilterChip.svelte';
  import ControlButton from './ControlButton.svelte';
  import FloatingActionButton from './FloatingActionButton.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  import UniversalPanel from './UniversalPanel.svelte';
  import type { MapStyle } from '$lib/config/map';
  
  export let speciesOptions: string[] = [];
  export let selectedSpecies: string[] = [];
  export let onToggleSpecies: (species: string) => void = () => {};
  export let temperature: number = 24;
  export let weatherCondition: 'sunny' | 'cloudy' | 'rainy' = 'cloudy';
  export let moonPhase: string = '🌗';
  export let mapStyle: MapStyle = 'midnight-water';
  export let onToggleLayers: () => void = () => {};
  export let onResetBearing: () => void = () => {};
  export let onGPSLocation: () => void = () => {};
  export let onLogCatch: () => void = () => {};
  export let onToggleDock: () => void = () => {};
</script>

<!-- Top Left: Weather Widget -->
<div class="absolute left-4 top-4 pointer-events-auto">
  <WeatherWidget 
    temperature={temperature} 
    condition={weatherCondition} 
    moonPhase={moonPhase}
  />
</div>

<!-- Top Right: Map Tools -->
<div class="absolute right-4 top-4 pointer-events-auto flex gap-2">
  <ControlButton 
    icon={mapStyle === 'glare-cut' ? '☀️' : '🌙'} 
    size="sm"
    onClick={onToggleLayers} 
  />
  <ControlButton icon="🧭" size="sm" onClick={onResetBearing} />
</div>

<!-- Bottom Edge: Filter Dock -->
<div class="absolute bottom-0 left-0 right-0 pointer-events-auto">
  <UniversalPanel padding="md" className="rounded-t-2xl rounded-b-none border-b-0">
    <!-- Drag Handle -->
    <div class="flex justify-center mb-3">
      <div class="w-8 h-1 bg-white/20 rounded-full"></div>
    </div>
    
    <!-- Dock Content -->
    <div class="flex items-center gap-3">
      <!-- Menu Icon -->
      <ControlButton icon="☰" size="sm" onClick={onToggleDock} />
      
      <!-- Filter Chips Carousel -->
      <div class="flex-1 overflow-x-auto scrollbar-hide">
        <div class="flex gap-2 pb-2">
          {#each speciesOptions as species}
            <FilterChip 
              label={species}
              active={selectedSpecies.includes(species)}
              onClick={() => onToggleSpecies(species)}
            />
          {/each}
        </div>
      </div>
    </div>
  </UniversalPanel>
</div>

<!-- Bottom Right: Action Stack -->
<div class="absolute right-4 bottom-24 pointer-events-auto flex flex-col gap-3">
  <!-- GPS Button -->
  <ControlButton 
    icon="📍" 
    size="md"
    onClick={onGPSLocation}
  />
  
  <!-- Log Catch FAB -->
  <FloatingActionButton 
    icon="🎣" 
    label="Log Catch" 
    onClick={onLogCatch}
  />
</div>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
