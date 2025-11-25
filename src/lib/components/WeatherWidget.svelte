<!-- Weather Widget - Midnight Standard v4.0 -->
<script lang="ts">
  export let temperature: number = 24;
  export let condition: 'sunny' | 'cloudy' | 'rainy' = 'cloudy';
  export let moonPhase: string = '🌗';
  export let compact: boolean = false;
  
  const weatherIcons = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️'
  };
</script>

<div class="bg-midnight-glass backdrop-blur-xl border border-midnight-border rounded-xl p-3 shadow-xl {compact ? '' : 'shadow-black/50'}">
  <div class="flex items-center gap-2 text-midnight-textPrimary">
    <span class="text-lg">{weatherIcons[condition]}</span>
    <span class="text-lg font-medium">{temperature}°</span>
    {#if !compact}
      <span class="text-sm opacity-70">{moonPhase}</span>
    {/if}
  </div>
</div>
