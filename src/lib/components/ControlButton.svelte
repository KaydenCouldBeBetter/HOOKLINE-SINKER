<!-- Control Button - Midnight Standard v3.1 -->
<script lang="ts">
  export let icon: string = '';
  export let onClick: () => void = () => {};
  export let size: 'sm' | 'md' = 'md';
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12'
  };
  
  const buttonClasses = [
    'bg-[#1e1e2e]/90',
    'backdrop-blur-xl',
    'border border-white/10',
    'rounded-full',
    'text-[#cdd6f4]',
    'flex items-center justify-center',
    'cursor-pointer',
    'transition-all duration-150',
    'hover:scale-105 hover:border-white/20',
    'shadow-lg shadow-black/30',
    sizeClasses[size]
  ].join(' ');
</script>

<button 
  class={buttonClasses}
  onclick={onClick}
  tabindex="0"
>
  <span class="text-lg">{icon}</span>
</button>
