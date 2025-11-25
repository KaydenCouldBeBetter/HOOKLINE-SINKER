<!-- Floating Action Button - Midnight Standard v3.1 -->
<script lang="ts">
  export let icon: string = '🎣';
  export let label: string = 'Log Catch';
  export let onClick: () => void = () => {};
  export let showText: boolean = false;
  
  const fabClasses = [
    'w-14 h-14',
    'bg-[#cba6f7]',
    'text-[#1e1e2e]',
    'rounded-full',
    'shadow-xl shadow-black/50',
    'flex items-center justify-center',
    'cursor-pointer',
    'transition-all duration-150',
    'hover:scale-105',
    'relative'
  ].join(' ');
</script>

<button 
  class={fabClasses}
  onclick={onClick}
  tabindex="0"
  title={label}
>
  <span class="text-xl">{icon}</span>
  {#if showText}
    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1e1e2e]/90 text-[#cdd6f4] px-2 py-1 rounded text-xs whitespace-nowrap">
      {label}
    </span>
  {/if}
</button>
