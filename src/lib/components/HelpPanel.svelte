<script lang="ts">
	export let shortcuts: Array<{ key: string; description: string }> = [];
	export let tips: Array<{ title: string; description: string }> = [];
	export let onClose: () => void = () => {};
	export let className = '';
</script>

<aside class={`glass-panel glass-panel--ring panel--lg space-y-6 ${className}`}>
	<header class="flex items-start justify-between">
		<div class="rounded-lg p-2" style="background-color: rgba(255, 255, 255, 0.1);">
			<h2 class="text-heading-3" style="color: rgb(var(--color-text-primary)); text-shadow: 0 1px 2px rgba(0,0,0,0.1);">Help &amp; controls</h2>
			<p class="text-caption text-caption--tertiary" style="margin-top: var(--space-1);">Quick tips for navigating the map.</p>
		</div>
		<button
			type="button"
			on:click={onClose}
			class="btn btn--ghost"
			style="padding: 12px;"
			aria-label="Close help panel"
		>
			<span style="font-size: 18px; line-height: 1;">×</span>
		</button>
	</header>

	{#if shortcuts.length}
		<section class="space-y-3" style="gap: var(--space-3);">
			<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Shortcuts</h3>
			<ul class="space-y-1" style="gap: var(--space-1);">
				{#each shortcuts as shortcut}
					<li class="card card--interactive flex items-center justify-between">
						<span class="badge badge--primary" style="font-family: monospace; font-size: 11px; font-weight: var(--font-weight-bold); text-transform: uppercase;">{shortcut.key}</span>
						<span class="text-body text-body--secondary">{shortcut.description}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if tips.length}
		<section class="space-y-3" style="gap: var(--space-3);">
			<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Map tips</h3>
			<ul class="space-y-2" style="gap: var(--space-2);">
				{#each tips as tip}
					<li class="card card--interactive">
						<p class="text-heading-4">{tip.title}</p>
						<p class="text-body text-body--secondary" style="margin-top: var(--space-1);">{tip.description}</p>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</aside>
