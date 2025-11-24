<script lang="ts">
	export let shortcuts: Array<{ key: string; description: string }> = [];
	export let tips: Array<{ title: string; description: string }> = [];
	export let onClose: () => void = () => {};
	export let className = '';
</script>

<aside class={`pointer-events-auto w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm ${className}`}>
	<header class="flex items-start justify-between">
		<div>
			<h2 class="text-base font-semibold text-slate-900">Help &amp; controls</h2>
			<p class="text-xs text-slate-500">Quick tips for navigating the map.</p>
		</div>
		<button
			type="button"
			on:click={onClose}
			class="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
			aria-label="Close help panel"
		>
			&times;
		</button>
	</header>

	{#if shortcuts.length}
		<section class="space-y-2">
			<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Shortcuts</h3>
			<ul class="space-y-1">
				{#each shortcuts as shortcut}
					<li class="flex items-center justify-between rounded border border-slate-200 px-3 py-1 text-xs text-slate-600">
						<span class="font-mono text-[11px] font-semibold uppercase text-slate-500">{shortcut.key}</span>
						<span>{shortcut.description}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if tips.length}
		<section class="space-y-2">
			<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Map tips</h3>
			<ul class="space-y-2">
				{#each tips as tip}
					<li class="rounded border border-slate-200 px-3 py-2">
						<p class="text-xs font-semibold text-slate-700">{tip.title}</p>
						<p class="text-xs text-slate-600">{tip.description}</p>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</aside>
