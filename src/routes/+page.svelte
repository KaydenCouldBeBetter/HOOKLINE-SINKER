<script lang="ts">
	import MapManager from '$lib/components/MapManager.svelte';
	import ThemeManager from '$lib/components/ThemeManager.svelte';
	import StateManager from '$lib/components/StateManager.svelte';
	import UIState from '$lib/components/UIState.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import LocationPanel from '$lib/components/LocationPanel.svelte';
	import PreferencesPanel from '$lib/components/PreferencesPanel.svelte';
	import HelpPanel from '$lib/components/HelpPanel.svelte';
	import type { LocationDetails } from '$lib/types/location';
	import type { MapStyle } from '$lib/config/map';

	// Map state
	let mapContainer: HTMLDivElement | null = null;
	let mapStyle: MapStyle = 'streets';

	// Theme state
	let theme: 'system' | 'light' | 'dark' = 'system';
	let resolvedTheme: 'light' | 'dark' = 'dark';
	let handleThemeSelect: (preference: 'system' | 'light' | 'dark') => void = (preference) => {
		theme = preference;
	};
	
	// Reactive theme summary
	$: themeSummary = theme === 'system'
		? `System · ${resolvedTheme.charAt(0).toUpperCase()}${resolvedTheme.slice(1)}`
		: `${theme === 'dark' ? 'Dark' : 'Light'} mode`;

	// UI state
	let isPreferencesOpen = true;
	let isHelpOpen = true;
	let isLocationPanelOpen = true;

	// App state
	let speciesOptions: string[] = [];
	let selectedSpecies: string[] = [];
	let crowdOptions: ('Quiet' | 'Moderate' | 'Busy')[] = [];
	let crowdPreference: 'Quiet' | 'Moderate' | 'Busy' = 'Moderate';
	let weatherOptions: ('Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather')[] = [];
	let weatherPreferences: ('Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather')[] = [];
	let favoriteLocations: { name: string; saved: boolean }[] = [];
	let activeLocation: LocationDetails | undefined;

	// Event handlers
	const togglePreferences = () => {
		isPreferencesOpen = !isPreferencesOpen;
	};

	const toggleHelp = () => {
		isHelpOpen = !isHelpOpen;
	};

	const toggleLocation = () => {
		isLocationPanelOpen = !isLocationPanelOpen;
	};
</script>

<svelte:head>
	<title>HOOK, LINE, & SINKER</title>
</svelte:head>

<!-- Managers (invisible, handle state and logic) -->
<ThemeManager bind:theme bind:resolvedTheme />

<UIState 
	bind:isPreferencesOpen 
	bind:isHelpOpen 
	bind:isLocationPanelOpen 
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
/>

<div class="relative h-screen w-screen" style="background-color: rgb(var(--color-bg-primary));">
	<!-- Map -->
	<MapManager bind:mapStyle={mapStyle} bind:mapContainer />

	<!-- UI Layer -->
	<div class="pointer-events-none absolute inset-0 ui-panels">
		<!-- Left Panel - Full Height -->
		<div class="absolute left-0 top-0 bottom-0 w-80 pointer-events-auto">
			{#if isLocationPanelOpen && activeLocation}
				<LocationPanel
					location={activeLocation}
					onClose={() => isLocationPanelOpen = false}
					className="h-full rounded-l-none rounded-r-xl border-l-0"
				/>
			{/if}
		</div>
		
		<!-- Right Panel - Full Height -->
		<div class="absolute right-0 top-0 bottom-0 w-80 pointer-events-auto">
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
					mapStyle={mapStyle}
					onSelectMapStyle={(style: MapStyle) => mapStyle = style}
					onToggleFavorite={(index: number) => {
						favoriteLocations = favoriteLocations.map((location, i) =>
							i === index ? { ...location, saved: !location.saved } : location
						);
					}}
					onClose={() => isPreferencesOpen = false}
					className="h-full rounded-r-none rounded-l-xl border-r-0"
				/>
			{/if}
		</div>
		
		<!-- Map Area Controls -->
		<div class="absolute left-80 right-80 top-0 bottom-0 pointer-events-none ui-topbar">
			<!-- Top Small Panel - Theme Controls -->
			<div class="pointer-events-auto flex justify-center">
				<TopBar
					className="w-fit"
					brandTitle="Hookline Sinker"
					subtitle={themeSummary}
					theme={resolvedTheme}
					isPreferencesOpen={isPreferencesOpen}
					isHelpOpen={isHelpOpen}
					onSelectTheme={handleThemeSelect}
					onTogglePreferences={togglePreferences}
					onToggleHelp={toggleHelp}
				/>
			</div>
			
			<!-- Bottom Small Panel - Additional Controls (if needed) -->
			<div class="absolute bottom-0 left-0 right-0 pointer-events-auto ui-help">
				<!-- This could be for map controls, legends, etc. -->
				{#if isHelpOpen}
					<div class="w-fit mx-auto" style="margin-bottom: var(--space-20); margin-left: var(--space-5);">
						<HelpPanel
							onClose={() => isHelpOpen = false}
							className="max-h-48 overflow-y-auto"
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
