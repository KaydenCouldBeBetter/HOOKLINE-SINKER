<!-- Weather Widget - Midnight Standard v3.1 -->
<script lang="ts">
  export let temperature: number = 24;
  export let condition: 'sunny' | 'cloudy' | 'rainy' = 'cloudy';
  export let moonPhase: string = '🌗';
  
  const weatherIcons = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️'
  };
</script>

<div class="bg-[#1e1e2e]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl shadow-black/50">
  <div class="flex items-center gap-2 text-[#cdd6f4]">
    <span class="text-lg">{weatherIcons[condition]}</span>
    <span class="text-lg font-medium">{temperature}°</span>
    <span class="text-sm opacity-70">{moonPhase}</span>
  </div>
</div>
