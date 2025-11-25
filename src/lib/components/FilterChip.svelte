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
      ? 'bg-midnight-primary text-midnight-glass border-midnight-primary font-bold' 
      : 'bg-transparent text-midnight-textSecondary border-midnight-border hover:border-white/20'
  ].join(' ');
</script>

<button 
  class={chipClasses}
  onclick={onClick}
  tabindex="0"
  aria-label={`Toggle ${label} filter`}
>
  {label}
</button>
