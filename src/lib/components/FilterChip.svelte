<!-- Filter Chip - Midnight Standard v3.3 -->
<script lang="ts">
  export let active: boolean = false;
  export let label: string = '';
  export let onClick: () => void = () => {};
  
  const chipClasses = [
    'px-3 py-1.5 h-11',
    'rounded-full',
    'border',
    'font-medium text-sm',
    'transition-all duration-150',
    'cursor-pointer',
    active 
      ? 'bg-[#cba6f7] text-[#1e1e2e] border-transparent' 
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
