<script lang="ts">
	import { THEME_OPTIONS, type ThemePreference } from '$lib/config/theme';

	export let brandTitle = 'Hookline Sinker';
	export let subtitle = '';
	export let theme: ThemePreference = 'system';
	export let isPreferencesOpen = false;
	export let isHelpOpen = false;
	export let onSelectTheme: (preference: ThemePreference) => void = () => {};
	export let onTogglePreferences: () => void = () => {};
	export let onToggleHelp: () => void = () => {};
	export let className = '';
</script>

<header
	class={`glass-panel glass-panel--ring panel--md glass-panel--interactive flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${className}`}
>
	<div class="flex flex-1 items-center gap-2">
		<div class="flex flex-col">
			<span class="text-heading-4" style="font-size: var(--font-size-xs); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase;">{brandTitle}</span>
			{#if subtitle}
				<span class="text-caption text-caption--tertiary">{subtitle}</span>
			{/if}
		</div>
	</div>

	<nav class="flex flex-wrap items-center gap-1" aria-label="Theme preference">
		{#each THEME_OPTIONS as option}
			{#if onSelectTheme}
				<button
					type="button"
					on:click={() => onSelectTheme(option.value)}
					class={`btn btn--sm ${
						theme === option.value
							? 'btn--primary'
							: 'btn--secondary'
					}`}
					role="radio"
					aria-checked={theme === option.value}
				>
					<span class="flex items-center gap-1">
						<span aria-hidden="true">{option.icon}</span>
						{option.label}
					</span>
				</button>
			{/if}
		{/each}
	</nav>

	<div class="flex items-center gap-1">
		<button
			type="button"
			on:click={onTogglePreferences}
			class={`btn btn--sm ${
				isPreferencesOpen 
					? 'btn--primary' 
					: 'btn--secondary'
			}`}
			role="switch"
			aria-checked={isPreferencesOpen}
		>
			<span class="flex items-center gap-1">
				<span>{isPreferencesOpen ? '✓' : '⚙️'}</span>
				Preferences
			</span>
		</button>
		<button
			type="button"
			on:click={onToggleHelp}
			class={`btn btn--sm ${
				isHelpOpen 
					? 'btn--primary' 
					: 'btn--secondary'
			}`}
			role="switch"
			aria-checked={isHelpOpen}
		>
			<span class="flex items-center gap-1">
				<span>{isHelpOpen ? '✓' : '?'}</span>
				Help
			</span>
		</button>
	</div>
</header>
