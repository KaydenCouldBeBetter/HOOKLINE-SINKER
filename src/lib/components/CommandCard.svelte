<!-- Command Card - Midnight Standard v3.1 -->
<script lang="ts">
  import UniversalPanel from './UniversalPanel.svelte';
  import FilterChip from './FilterChip.svelte';
  import WeatherWidget from './WeatherWidget.svelte';
  
  export let speciesOptions: string[] = ['Bass', 'Walleye', 'Pike', 'Trout'];
  export let selectedSpecies: string[] = [];
  export let onToggleSpecies: (species: string) => void = () => {};
  export let temperature: number = 24;
  export let weatherCondition: 'sunny' | 'cloudy' | 'rainy' = 'cloudy';
  export let moonPhase: string = '🌗';
</script>

<UniversalPanel padding="md" className="w-96">
  <!-- Header Row -->
  <div class="flex justify-between items-center mb-4">
    <!-- Hamburger Menu -->
    <button 
      class="text-[#cdd6f4] hover:text-[#cba6f7] transition-colors"
      aria-label="Open menu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
    
    <!-- User Profile Avatar -->
    <div class="w-8 h-8 bg-[#cba6f7] rounded-full flex items-center justify-center text-[#1e1e2e] font-medium text-sm">
      U
    </div>
  </div>
  
  <!-- Default View: Current Conditions & Quick Filters -->
  <div class="space-y-4">
    <!-- Current Conditions -->
    <div>
      <h3 class="text-[#cdd6f4] font-medium mb-2">Current Conditions</h3>
      <WeatherWidget 
        temperature={temperature} 
        condition={weatherCondition} 
        moonPhase={moonPhase}
      />
    </div>
    
    <!-- Quick Filters -->
    <div>
      <h3 class="text-[#cdd6f4] font-medium mb-2">Quick Filters</h3>
      <div class="flex flex-wrap gap-2">
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
