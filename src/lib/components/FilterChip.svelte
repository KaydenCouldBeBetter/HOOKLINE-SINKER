<!-- Filter Chip - Midnight Standard v4.0 -->
<script lang="ts">
  export let active: boolean = false;
  export let label: string = '';
  export let onClick: () => void = () => {};
  
  const chipClasses = [
    'px-4 py-2 h-11',
    'rounded-lg',
    'border',
    'font-medium text-sm',
    'transition-all duration-200 ease-out',
    'cursor-pointer select-none',
    'transform hover:scale-105 active:scale-95',
    'shadow-sm',
    active 
      ? 'bg-purple-500 text-white border-purple-500 font-bold shadow-purple-500/50' 
      : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-300'
  ].join(' ');
</script>

<button 
  class={chipClasses}
  onclick={onClick}
  tabindex="0"
  aria-label={`Toggle ${label} filter`}
>
  <span class="flex items-center gap-2">
    {#if active}
      <span class="text-xs">✓</span>
    {/if}
    <span>{label}</span>
  </span>
</button>
