<!-- Universal Panel - Midnight Standard v3.0 -->
<!-- The HUD Effect - One Interface, Any Condition -->

<script lang="ts">
  export let padding: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let interactive: boolean = false;
  export let rounded: boolean = true;
  export let className: string = '';
  export let children: import('svelte').Snippet;
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const roundedClasses: Record<string, string> = {
    'true': 'rounded-2xl',
    'false': 'rounded-none'
  };
  
  $: classes = [
    'universal-panel',
    paddingClasses[padding],
    roundedClasses[rounded.toString()],
    interactive && 'universal-panel--interactive',
    'bg-[#1e1e2e]/90',
    'backdrop-blur-xl',
    'border border-white/10',
    'shadow-xl shadow-black/50',
    'text-[#cdd6f4]',
    className
  ].filter(Boolean).join(' ');
</script>

<div class={classes}>
  {@render children()}
</div>

<style>
  .universal-panel--interactive:hover {
    transform: scale(1.01);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .universal-panel--interactive {
    cursor: pointer;
    transition: transform 150ms ease-out, border-color 150ms ease-out;
  }
</style>
