<script lang="ts">
	import type { LocationDetails } from '$lib/types/location';

	export let location: LocationDetails | null = null;
	export let onClose: () => void = () => {};
	export let className = '';
</script>

{#if location}
	<aside
		class={`pointer-events-auto w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm ${className}`}
	>
		<header class="flex items-start justify-between gap-3">
			<div>
				<h2 class="text-base font-semibold text-slate-900">{location.name}</h2>
				{#if location.subtitle}
					<p class="text-xs text-slate-500">{location.subtitle}</p>
				{/if}
				{#if location.address}
					<p class="mt-1 text-xs text-slate-500">{location.address}</p>
				{/if}
			</div>
			<button
				type="button"
				on:click={onClose}
				class="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
				aria-label="Close location panel"
			>
				&times;
			</button>
		</header>

		{#if location.galleryImage}
			<div class="space-y-2">
				<p class="text-xs font-medium uppercase tracking-wide text-slate-500">Gallery</p>
				<img
					src={location.galleryImage}
					alt={location.galleryLabel ?? location.name}
					class="h-32 w-full rounded-lg object-cover"
				/>
			</div>
		{/if}

		{#if location.species?.length}
			<section class="space-y-2">
				<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Species</h3>
				<div class="flex flex-wrap gap-2">
					{#each location.species as species}
						<span class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
							{species}
						</span>
					{/each}
				</div>
			</section>
		{/if}

		{#if location.details?.length}
			<section class="space-y-2">
				<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Details</h3>
				<ul class="space-y-1">
					{#each location.details as item}
						<li class="flex items-center justify-between text-xs text-slate-600">
							<span class="font-medium text-slate-500">{item.label}</span>
							<span>{item.value}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if location.conditions?.length}
			<section class="space-y-2">
				<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Current conditions</h3>
				<ul class="space-y-1">
					{#each location.conditions as item}
						<li class="flex items-center justify-between text-xs text-slate-600">
							<span class="font-medium text-slate-500">{item.label}</span>
							<span>{item.value}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</aside>
{:else}
	<aside class={`pointer-events-auto w-full max-w-md rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500 ${className}`}>
		Select a location to view details.
	</aside>
{/if}
