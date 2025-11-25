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
    active 
      ? 'bg-[#cba6f7] text-[#1e1e2e] border-[#cba6f7] font-bold' 
      : 'bg-transparent text-[#a6adc8] border-white/10 hover:border-white/20'
  ].join(' ');
  
  const ariaLabel = `Toggle ${label} filter`;
</script>

<button 
  class={chipClasses}
  onclick={onClick}
  tabindex="0"
  aria-label={ariaLabel}
>
  {label}
</button>
