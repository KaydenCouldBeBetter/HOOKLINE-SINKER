<!-- Desktop Layout - Midnight Standard v3.1 -->
<script lang="ts">
  import CommandCard from './CommandCard.svelte';
  import ControlButton from './ControlButton.svelte';
  import FloatingActionButton from './FloatingActionButton.svelte';
  import type { MapStyle } from '$lib/config/map';
  
  export let speciesOptions: string[] = [];
  export let selectedSpecies: string[] = [];
  export let onToggleSpecies: (species: string) => void = () => {};
  export let temperature: number = 24;
  export let weatherCondition: 'sunny' | 'cloudy' | 'rainy' = 'cloudy';
  export let moonPhase: string = '🌗';
  export let onResetBearing: () => void = () => {};
  export let onToggleLayers: () => void = () => {};
  export let onZoomIn: () => void = () => {};
  export let onZoomOut: () => void = () => {};
  export let onLogCatch: () => void = () => {};
</script>

<!-- Top Left: Floating Command Card -->
<div class="absolute left-6 top-6 pointer-events-auto">
  <CommandCard
    speciesOptions={speciesOptions}
    selectedSpecies={selectedSpecies}
    onToggleSpecies={onToggleSpecies}
    temperature={temperature}
    weatherCondition={weatherCondition}
    moonPhase={moonPhase}
  />
</div>

<!-- Right Edge: Control Stack -->
<div class="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto flex flex-col gap-3">
  <ControlButton icon="🧭" onClick={onResetBearing} />
  <ControlButton icon="🗺️" onClick={onToggleLayers} />
  <ControlButton icon="+" onClick={onZoomIn} />
  <ControlButton icon="−" onClick={onZoomOut} />
</div>

<!-- Bottom Right: Primary Action FAB -->
<div class="absolute right-8 bottom-8 pointer-events-auto">
  <FloatingActionButton 
    icon="🎣" 
    label="Log Catch" 
    onClick={onLogCatch}
  />
</div>
