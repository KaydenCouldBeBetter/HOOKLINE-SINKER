<script lang="ts">
	type OptionGroup = {
		title: string;
		description?: string;
		options: string[];
		type?: 'single' | 'multi';
	};

	export let speciesOptions: string[] = [];
	export let selectedSpecies: string[] = [];
	export let onToggleSpecies: (value: string) => void = () => {};
	export let crowdOptions: string[] = [];
	export let crowdPreference: string | null = null;
	export let onSelectCrowd: (value: string) => void = () => {};
	export let weatherOptions: string[] = [];
	export let weatherPreferences: string[] = [];
	export let onToggleWeather: (value: string) => void = () => {};
	export let favoriteLocations: Array<{ name: string; saved: boolean }> = [];
	export let onToggleFavorite: (index: number) => void = () => {};
	export let onClose: () => void = () => {};
	export let className = '';
</script>

<aside class={`pointer-events-auto w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm ${className}`}>
	<header class="flex items-start justify-between">
		<div>
			<h2 class="text-base font-semibold text-slate-900">Preferences</h2>
			<p class="text-xs text-slate-500">Adjust what you want to track.</p>
		</div>
		<button
			type="button"
			on:click={onClose}
			class="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
			aria-label="Close preferences panel"
		>
			&times;
		</button>
	</header>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Target species</h3>
		<div class="flex flex-wrap gap-2">
			{#each speciesOptions as option}
				<button
					type="button"
					on:click={() => onToggleSpecies(option)}
					class={`rounded-full border px-3 py-1 text-xs font-medium transition ${
						selectedSpecies.includes(option)
							? 'border-sky-500 bg-sky-100 text-sky-700'
							: 'border-slate-300 text-slate-600 hover:bg-slate-100'
					}`}
				>
					{option}
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Crowd level</h3>
		<div class="flex flex-wrap gap-2">
			{#each crowdOptions as option}
				<button
					type="button"
					on:click={() => onSelectCrowd(option)}
					class={`rounded-full border px-3 py-1 text-xs font-medium transition ${
						crowdPreference === option
							? 'border-sky-500 bg-sky-100 text-sky-700'
							: 'border-slate-300 text-slate-600 hover:bg-slate-100'
					}`}
				>
					{option}
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weather preference</h3>
		<div class="flex flex-wrap gap-2">
			{#each weatherOptions as option}
				<button
					type="button"
					on:click={() => onToggleWeather(option)}
					class={`rounded-full border px-3 py-1 text-xs font-medium transition ${
						weatherPreferences.includes(option)
							? 'border-sky-500 bg-sky-100 text-sky-700'
							: 'border-slate-300 text-slate-600 hover:bg-slate-100'
					}`}
				>
					{option}
				</button>
			{/each}
		</div>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Favorite locations</h3>
		<ul class="space-y-1">
			{#each favoriteLocations as location, index}
				<li>
					<button
						type="button"
						on:click={() => onToggleFavorite(index)}
						class={`flex w-full items-center justify-between rounded border px-3 py-1 text-left text-xs transition ${
							location.saved
								? 'border-sky-500 bg-sky-50 text-sky-700'
								: 'border-slate-300 text-slate-600 hover:bg-slate-100'
						}`}
					>
						<span>{location.name}</span>
						<span aria-hidden="true">{location.saved ? '★' : '☆'}</span>
					</button>
				</li>
			{/each}
		</ul>
	</section>
</aside>
