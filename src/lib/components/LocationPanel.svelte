<script lang="ts">
	import type { LocationDetails } from '$lib/types/location';

	export let location: LocationDetails | null = null;
	export let onClose: () => void = () => {};
	export let className = '';
</script>

{#if location}
	<aside
		class={`glass-panel glass-panel--ring panel--lg space-y-6 ${className}`}
	>
		<header class="flex items-start justify-between gap-3">
			<div>
				<h2 class="text-heading-3">{location.name}</h2>
				{#if location.subtitle}
					<p class="text-caption text-caption--tertiary">{location.subtitle}</p>
				{/if}
				{#if location.address}
					<p class="text-caption text-caption--tertiary" style="margin-top: var(--space-1);">{location.address}</p>
				{/if}
			</div>
			<button
				type="button"
				on:click={onClose}
				class="btn btn--icon"
				aria-label="Close location panel"
			>
				<span style="font-size: var(--font-size-lg); line-height: var(--line-height-tight);">×</span>
			</button>
		</header>

		{#if location.galleryImage}
			<div class="space-y-3">
				<p class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Gallery</p>
				<div class="card overflow-hidden">
					<img
						src={location.galleryImage}
						alt={location.galleryLabel ?? location.name}
						class="h-40 w-full object-cover hover:scale-105 transition-transform duration-300 ease-out"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-bg-primary)/0.2)] to-transparent pointer-events-none"></div>
				</div>
			</div>
		{/if}

		{#if location.species?.length}
			<section class="space-y-3">
				<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Species</h3>
				<div class="flex flex-wrap gap-2">
					{#each location.species as species}
						<span class="badge badge--primary">{species}</span>
					{/each}
				</div>
			</section>
		{/if}

		{#if location.details?.length}
			<section class="space-y-3">
				<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Details</h3>
				<ul class="space-y-2">
					{#each location.details as item}
						<li class="card card--interactive flex items-center justify-between">
							<span class="text-body text-body--secondary">{item.label}</span>
							<span class="text-body font-medium">{item.value}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if location.conditions?.length}
			<section class="space-y-3">
				<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Current conditions</h3>
				<ul class="space-y-2">
					{#each location.conditions as item}
						<li class="card card--interactive flex items-center justify-between border-[rgb(var(--color-success-primary)/0.3)] bg-[rgb(var(--color-success-primary)/0.08)]">
							<span class="text-body text-body--secondary">{item.label}</span>
							<span class="text-body font-medium">{item.value}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</aside>
{:else}
	<aside class={`glass-panel glass-panel--ring panel--lg text-body text-body--secondary ${className}`}>
		Select a location to view details.
	</aside>
{/if}
