<script lang="ts">
	import { onMount } from 'svelte';
	import MapManager from '$lib/components/MapManager.svelte';
	import ThemeManager from '$lib/components/ThemeManager.svelte';
	import StateManager from '$lib/components/StateManager.svelte';
	import UIManager from '$lib/components/UIManager.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import LocationPanel from '$lib/components/LocationPanel.svelte';
	import PreferencesPanel from '$lib/components/PreferencesPanel.svelte';
	import HelpPanel from '$lib/components/HelpPanel.svelte';
	import type { LocationDetails } from '$lib/types/location';

	let mapContainer: HTMLDivElement | null = null;

	// Theme state
	let theme: 'light' | 'dark' = 'dark';
	let themeSummary = '';

	// UI state
	let isPreferencesOpen = true;
	let isHelpOpen = true;
	let isLocationPanelOpen = true;

	// State data - will be managed by StateManager
	let speciesOptions: string[] = [];
	let selectedSpecies: string[] = [];
	let crowdOptions: ('Quiet' | 'Moderate' | 'Busy')[] = [];
	let crowdPreference: 'Quiet' | 'Moderate' | 'Busy' = 'Moderate';
	let weatherOptions: ('Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather')[] = [];
	let weatherPreferences: ('Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather')[] = [];
	let favoriteLocations: { name: string; saved: boolean }[] = [];
	let activeLocation: LocationDetails | undefined;

	// Help data
	const shortcutTips = [
		{ key: 'T', description: 'Cycle theme preferences' },
		{ key: 'P', description: 'Open preferences panel' },
		{ key: 'H', description: 'Toggle help panel' },
		{ key: 'Esc', description: 'Close current overlay' }
	];

	const explorationTips = [
		{
			title: 'Drag to explore',
			description: 'Click and drag the map to survey nearby waters, docks, and marinas.'
		},
		{
			title: 'Zoom controls',
			description: 'Use scroll, pinch, or the on-map buttons to zoom in and out.'
		},
		{
			title: 'Reset focus',
			description: 'Double-click anywhere to recentre on your chosen marker.'
		}
	];

	// Event handlers
	const handleThemeChange = (event: CustomEvent) => {
		({ theme } = event.detail);
	};

	const handlePreferencesToggle = (event: CustomEvent) => {
		isPreferencesOpen = event.detail;
	};

	const handleHelpToggle = (event: CustomEvent) => {
		isHelpOpen = event.detail;
	};

	const handleLocationToggle = (event: CustomEvent) => {
		isLocationPanelOpen = event.detail;
	};

	const handleSpeciesChange = (event: CustomEvent) => {
		selectedSpecies = event.detail;
	};

	const handleCrowdChange = (event: CustomEvent) => {
		crowdPreference = event.detail;
	};

	const handleWeatherChange = (event: CustomEvent) => {
		weatherPreferences = event.detail;
	};

	const handleFavoriteChange = (event: CustomEvent) => {
		favoriteLocations = event.detail;
	};

	const handleLocationChange = (event: CustomEvent) => {
		activeLocation = event.detail;
	};

	const handleThemeSelect = (preference: string) => {
		// This will be handled by ThemeManager
	};

	const cycleThemePreference = () => {
		// This will be handled by ThemeManager
	};

	$: themeSummary = `${theme === 'dark' ? 'Dark' : 'Light'} mode`;
</script>

<svelte:head>
	<title>HOOK, LINE, & SINKER</title>
</svelte:head>

<!-- Managers (invisible, handle state and logic) -->
<ThemeManager
	bind:theme
	on:themeChange={handleThemeChange}
/>

<StateManager
	bind:speciesOptions
	bind:selectedSpecies
	bind:crowdOptions
	bind:crowdPreference
	bind:weatherOptions
	bind:weatherPreferences
	bind:favoriteLocations
	bind:activeLocation
	on:speciesChange={handleSpeciesChange}
	on:crowdChange={handleCrowdChange}
	on:weatherChange={handleWeatherChange}
	on:favoriteChange={handleFavoriteChange}
	on:locationChange={handleLocationChange}
/>

<UIManager
	bind:isPreferencesOpen
	bind:isHelpOpen
	bind:isLocationPanelOpen
	on:preferencesToggle={handlePreferencesToggle}
	on:helpToggle={handleHelpToggle}
	on:locationToggle={handleLocationToggle}
/>

<div class="relative h-screen w-screen bg-slate-900">
	<!-- Map -->
	<MapManager bind:theme bind:mapContainer />

	<!-- UI Layer -->
	<div class="pointer-events-none absolute inset-0 flex flex-col z-10">
		<div class="flex justify-center px-4 pt-4">
			<TopBar
				className="w-full md:max-w-4xl"
				brandTitle="Hookline Sinker"
				subtitle={themeSummary}
				theme={theme}
				isPreferencesOpen={isPreferencesOpen}
				isHelpOpen={isHelpOpen}
				isLocationPanelOpen={isLocationPanelOpen}
				onSelectTheme={handleThemeSelect}
				onToggleLocationPanel={() => isLocationPanelOpen = !isLocationPanelOpen}
				onTogglePreferences={() => isPreferencesOpen = !isPreferencesOpen}
				onToggleHelp={() => isHelpOpen = !isHelpOpen}
			/>
		</div>
		<div class="flex-1 px-4 pb-4">
			<div class="flex h-full flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div class="order-last md:order-0 md:max-w-sm md:shrink-0">
					{#if isLocationPanelOpen && activeLocation}
						<LocationPanel
							location={activeLocation}
							onClose={() => isLocationPanelOpen = false}
							className="pointer-events-auto w-full md:w-80"
						/>
					{/if}
				</div>
				<div class="flex-1"></div>
				<div class="flex flex-col gap-4 md:max-w-sm md:shrink-0">
					{#if isPreferencesOpen}
						<PreferencesPanel
							speciesOptions={speciesOptions}
							selectedSpecies={selectedSpecies}
							onToggleSpecies={(value: string) => {
								selectedSpecies = selectedSpecies.includes(value)
									? selectedSpecies.filter((item) => item !== value)
									: [...selectedSpecies, value];
							}}
							crowdOptions={crowdOptions}
							crowdPreference={crowdPreference}
							onSelectCrowd={(value: string) => crowdPreference = value as 'Quiet' | 'Moderate' | 'Busy'}
							weatherOptions={weatherOptions}
							weatherPreferences={weatherPreferences}
							onToggleWeather={(value: string) => {
								const isActive = weatherPreferences.includes(value as 'Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather');
								if (value === 'Any Weather') {
									weatherPreferences = isActive ? [] : ['Any Weather'];
									return;
								}
								const filtered = weatherPreferences.filter((item) => item !== 'Any Weather') as ('Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather')[];
								weatherPreferences = isActive
									? filtered.filter((item) => item !== value as 'Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather')
									: [...filtered, value as 'Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather'];
							}}
							favoriteLocations={favoriteLocations}
							onToggleFavorite={(index: number) => {
								favoriteLocations = favoriteLocations.map((location, i) =>
									i === index ? { ...location, saved: !location.saved } : location
								);
							}}
							onClose={() => isPreferencesOpen = false}
							className="pointer-events-auto w-full md:w-80"
						/>
					{/if}
					{#if isHelpOpen}
						<HelpPanel
							shortcuts={shortcutTips}
							tips={explorationTips}
							onClose={() => isHelpOpen = false}
							className="pointer-events-auto w-full md:w-72"
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
