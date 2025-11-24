<script lang="ts">
	import { THEME_OPTIONS, type ThemePreference } from '$lib/config/theme';

	export let brandTitle = 'Hookline Sinker';
	export let subtitle = '';
	export let theme: ThemePreference = 'system';
	export let isPreferencesOpen = false;
	export let isHelpOpen = false;
	export let isLocationPanelOpen = true;
	export let onSelectTheme: (preference: ThemePreference) => void = () => {};
	export let onToggleLocationPanel: () => void = () => {};
	export let onTogglePreferences: () => void = () => {};
	export let onToggleHelp: () => void = () => {};
	export let className = '';
</script>

<header
	class={`pointer-events-auto flex w-full flex-col gap-3 rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur sm:flex-row sm:items-center sm:justify-between ${className}`}
>
	<div class="flex flex-1 items-center gap-3">
		<button
			type="button"
			on:click={onToggleLocationPanel}
			class={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 ${
				isLocationPanelOpen ? 'border-sky-400 bg-sky-100 text-sky-700' : 'border-slate-300'
			}`}
			aria-pressed={isLocationPanelOpen}
		>
			<span class="mr-2" aria-hidden="true">📍</span>
			{isLocationPanelOpen ? 'Hide details' : 'Show details'}
		</button>
		<div class="flex flex-col">
			<span class="text-sm font-semibold uppercase tracking-wide text-slate-900">{brandTitle}</span>
			{#if subtitle}
				<span class="text-xs text-slate-500">{subtitle}</span>
			{/if}
		</div>
	</div>

	<nav class="flex flex-wrap items-center gap-2" aria-label="Theme preference">
		{#each THEME_OPTIONS as option}
			{#if onSelectTheme}
				<button
					type="button"
					on:click={() => onSelectTheme(option.value)}
					class={`rounded-full border px-3 py-1 text-sm font-medium transition ${
						theme === option.value
							? 'border-sky-500 bg-sky-100 text-sky-700'
							: 'border-slate-300 text-slate-700 hover:bg-slate-100'
					}`}
					aria-pressed={theme === option.value}
				>
					<span class="mr-2" aria-hidden="true">{option.icon}</span>
					{option.label}
				</button>
			{/if}
		{/each}
	</nav>

	<div class="flex items-center gap-2">
		<button
			type="button"
			on:click={onTogglePreferences}
			class={`rounded-full border px-3 py-1 text-sm font-medium transition hover:bg-slate-100 ${
				isPreferencesOpen ? 'border-sky-500 bg-sky-100 text-sky-700' : 'border-slate-300 text-slate-700'
			}`}
			aria-pressed={isPreferencesOpen}
		>
			Preferences
		</button>
		<button
			type="button"
			on:click={onToggleHelp}
			class={`rounded-full border px-3 py-1 text-sm font-medium transition hover:bg-slate-100 ${
				isHelpOpen ? 'border-sky-500 bg-sky-100 text-sky-700' : 'border-slate-300 text-slate-700'
			}`}
			aria-pressed={isHelpOpen}
		>
			Help
		</button>
	</div>
</header>
