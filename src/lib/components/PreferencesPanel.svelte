<script lang="ts">
	import { MAP_STYLES, type MapStyle } from '$lib/config/map';

	export let onClose: () => void = () => {};
	export let onSelectMapStyle: (style: MapStyle) => void = () => {};
	// @ts-ignore - Used by parent component
	export let onToggleSpecies: (option: string) => void = () => {};
	// @ts-ignore - Used by parent component
	export let onSelectCrowd: (value: string) => void = () => {};
	// @ts-ignore - Used by parent component
	export let onToggleWeather: (value: string) => void = () => {};
	// @ts-ignore - Used by parent component
	export let onToggleFavorite: (index: number) => void = () => {};
	export let mapStyle: MapStyle = 'streets';
	export let speciesOptions: string[] = [];
	export let selectedSpecies: string[] = [];
	export let crowdOptions: string[] = [];
	export let crowdPreference: string | null = null;
	export let weatherOptions: string[] = [];
	export let weatherPreferences: string[] = [];
	export let favoriteLocations: Array<{ name: string; saved: boolean }> = [];
	export let className = '';

	const handleToggleSpecies = (option: string) => {
		onToggleSpecies?.(option);
	};

	const handleSelectCrowd = (value: string) => {
		onSelectCrowd?.(value);
	};

	const handleToggleWeather = (value: string) => {
		onToggleWeather?.(value);
	};

	const handleSelectMapStyle = (style: MapStyle) => {
		onSelectMapStyle?.(style);
	};

	const handleToggleFavorite = (index: number) => {
		onToggleFavorite?.(index);
	};

	const mapStyleOptions = Object.entries(MAP_STYLES).map(([key, value]) => ({
		value: key as MapStyle,
		name: value.name,
		description: value.description
	}));
</script>

<aside class={`glass-panel glass-panel--ring panel--lg space-y-6 ${className}`}>
	<header class="flex items-start justify-between">
		<div>
			<h2 class="text-heading-3">Preferences</h2>
			<p class="text-caption text-caption--tertiary" style="margin-top: var(--space-1);">Adjust what you want to track.</p>
		</div>
		<button
			type="button"
			on:click={onClose}
			class="btn btn--ghost"
			style="padding: 12px;"
			aria-label="Close preferences panel"
		>
			<span style="font-size: 18px; line-height: 1;">×</span>
		</button>
	</header>

	<section class="space-y-3" style="gap: var(--space-3);">
		<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Target species</h3>
		<div class="flex flex-wrap gap-2" style="gap: var(--space-2);">
			{#each speciesOptions as option}
				<button
					type="button"
					on:click={() => handleToggleSpecies(option)}
					class={`badge ${
						selectedSpecies.includes(option)
							? 'badge--primary'
							: 'badge--secondary'
					}`}
				>
					<span>{option}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-3" style="gap: var(--space-3);">
		<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Crowd level</h3>
		<div class="flex flex-wrap gap-2" style="gap: var(--space-2);">
			{#each crowdOptions as option}
				<button
					type="button"
					on:click={() => handleSelectCrowd(option)}
					class={`badge ${
						crowdPreference === option
							? 'badge--primary'
							: 'badge--secondary'
					}`}
				>
					<span>{option}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-3" style="gap: var(--space-3);">
		<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Weather preference</h3>
		<div class="flex flex-wrap gap-2" style="gap: var(--space-2);">
			{#each weatherOptions as option}
				<button
					type="button"
					on:click={() => handleToggleWeather(option)}
					class={`badge ${
						weatherPreferences.includes(option)
							? 'badge--success'
							: 'badge--secondary'
					}`}
				>
					<span>{option}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-3" style="gap: var(--space-3);">
		<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Map style</h3>
		<div class="flex flex-wrap gap-2" style="gap: var(--space-2);">
			{#each mapStyleOptions as option}
				<button
					type="button"
					on:click={() => handleSelectMapStyle(option.value)}
					class={`badge ${
						mapStyle === option.value
							? 'badge--primary'
							: 'badge--secondary'
					}`}
					title={option.description}
				>
					<span>{option.name}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-3" style="gap: var(--space-3);">
		<h3 class="text-caption" style="font-weight: var(--font-weight-medium); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">Favorite locations</h3>
		<ul class="space-y-1" style="gap: var(--space-1);">
			{#each favoriteLocations as location, index}
				<li>
					<button
						type="button"
						on:click={() => handleToggleFavorite(index)}
						class={`card card--interactive flex w-full items-center justify-between ${
							location.saved
								? 'border-[rgb(var(--color-warning-primary)/0.3)] bg-[rgb(var(--color-warning-primary)/0.08)]'
								: ''
						}`}
					>
						<span class="text-body" style="color: location.saved ? 'rgb(var(--color-warning-primary))' : 'rgb(var(--color-text-primary))';">{location.name}</span>
						<span aria-hidden="true">{location.saved ? '★' : '☆'}</span>
					</button>
				</li>
			{/each}
		</ul>
	</section>
</aside>
