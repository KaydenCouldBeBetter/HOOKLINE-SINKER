<!-- TabNavigation - Handles tab switching logic -->
<script lang="ts">
  export let activeTab: 'plan' | 'map' | 'spots' = 'plan';
  export let onTabChange: (tab: 'plan' | 'map' | 'spots') => void = () => {};
  export let tabs: { key: 'plan' | 'map' | 'spots'; label: string }[] = [
    { key: 'plan', label: 'Plan' },
    { key: 'map', label: 'Map' },
    { key: 'spots', label: 'Spots' }
  ];
  export let variant: 'desktop' | 'mobile' = 'desktop';

  const handleTabClick = (tab: 'plan' | 'map' | 'spots') => {
    activeTab = tab;
    onTabChange(tab);
  };
</script>

<!-- Desktop Tab Navigation -->
{#if variant === 'desktop'}
  <div class="flex border-b border-midnight-border">
    {#each tabs as tab}
      <button 
        class="px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
          activeTab === tab.key
            ? 'text-midnight-primary border-midnight-primary' 
            : 'text-midnight-textSecondary border-transparent hover:text-midnight-textPrimary'
        }"
        on:click={() => handleTabClick(tab.key)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
{:else}
  <!-- Mobile Tab Navigation -->
  <div class="flex justify-center p-3 border-b border-midnight-border">
    <div class="flex border-b border-midnight-border">
      {#each tabs as tab}
        <button 
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === tab.key
              ? 'text-midnight-primary border-midnight-primary' 
              : 'text-midnight-textSecondary border-transparent hover:text-midnight-textPrimary'
          }"
          on:click={() => handleTabClick(tab.key)}
        >
          {tab.label}
        </button>
      {/each}
    </div>
  </div>
{/if}
