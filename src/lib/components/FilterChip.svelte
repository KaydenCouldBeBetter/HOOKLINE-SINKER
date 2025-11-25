<!-- Filter Chip - Midnight Standard v3.4 -->
<script lang="ts">
  export let active: boolean = false;
  export let label: string = '';
  export let onClick: () => void = () => {};
  
  const chipClasses = [
    'px-4 py-2 h-10',
    'rounded-lg',
    'border',
    'font-medium text-sm',
    'transition-all duration-200 ease-out',
    'cursor-pointer select-none',
    'transform hover:scale-105 active:scale-95',
    'shadow-sm hover:shadow-md',
    active 
      ? 'bg-gradient-to-r from-[#cba6f7] to-[#b4a8f5] text-[#1e1e2e] border-[#cba6f7] shadow-[#cba6f7]/25' 
      : 'bg-[#1e1e2e]/30 text-[#cdd6f4] border-white/10 hover:border-[#cba6f7]/30 hover:bg-[#cba6f7]/10 hover:text-[#cba6f7]'
  ].join(' ');
  
  const ariaLabel = `Toggle ${label} filter`;
</script>

<button 
  class={chipClasses}
  onclick={onClick}
  tabindex="0"
  aria-label={ariaLabel}
>
  <span class="relative z-10">{label}</span>
</button>
