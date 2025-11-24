<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { env } from '$env/dynamic/public';

	import {
		MAP_OPTIONS,
		MAPBOX_TOKEN_ENV,
		MAP_STYLES,
		MISSING_TOKEN_HELP,
		MISSING_TOKEN_MESSAGE,
		NAVIGATION_CONTROL_POSITION
	} from '$lib/config/map';
	import {
		THEME_DEFAULT,
		THEME_OPTIONS,
		THEME_STORAGE_KEY,
		type ThemePreference
	} from '$lib/config/theme';
	import TopBar from '$lib/components/TopBar.svelte';
	import LocationPanel from '$lib/components/LocationPanel.svelte';
import type { LocationDetails } from '$lib/types/location';
	import PreferencesPanel from '$lib/components/PreferencesPanel.svelte';
	import HelpPanel from '$lib/components/HelpPanel.svelte';

	let mapContainer: HTMLDivElement | null = null;
	let mapError: string | null = null;
	const accessToken = env[MAPBOX_TOKEN_ENV];

	let uiLayer: HTMLDivElement | null = null;
	let theme: ThemePreference = THEME_DEFAULT;
	let resolvedTheme: 'light' | 'dark' = 'dark';
	let isPreferencesOpen = true;
	let isHelpOpen = true;
	let isLocationPanelOpen = true;

	let mediaQuery: MediaQueryList | null = null;
	const themeOrder: ThemePreference[] = THEME_OPTIONS.map((option) => option.value);

	let mapInstance: mapboxgl.Map | null = null;
	let currentMapStyle: 'light' | 'dark' | null = null;
	let pendingMapStyle: 'light' | 'dark' | null = null;

	const speciesOptions = [
		'Bonefish',
		'Chinook Salmon',
		'Coho Salmon',
		'Lake Trout',
		'Lingcod',
		'Permit',
		'Snook',
		'Steelhead',
		'Tarpon',
		'Walleye'
	];
	let selectedSpecies: string[] = ['Chinook Salmon', 'Coho Salmon', 'Lake Trout'];

	const toggleSpecies = (value: string) => {
		selectedSpecies = selectedSpecies.includes(value)
			? selectedSpecies.filter((item) => item !== value)
			: [...selectedSpecies, value];
	};

	type CrowdPreference = 'Quiet' | 'Moderate' | 'Busy';
	const crowdOptions: CrowdPreference[] = ['Quiet', 'Moderate', 'Busy'];
	let crowdPreference: CrowdPreference = 'Moderate';

	const setCrowdPreference = (value: CrowdPreference) => {
		crowdPreference = value;
	};

	type WeatherPreference = 'Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather';
	const weatherOptions: WeatherPreference[] = ['Sunny', 'Cloudy', 'Rainy', 'Any Weather'];
	let weatherPreferences: WeatherPreference[] = ['Any Weather'];

	const toggleWeatherPreference = (value: WeatherPreference) => {
		const isActive = weatherPreferences.includes(value);
		if (value === 'Any Weather') {
			weatherPreferences = isActive ? [] : ['Any Weather'];
			return;
		}
		const filtered = weatherPreferences.filter((item) => item !== 'Any Weather');
		weatherPreferences = isActive
			? filtered.filter((item) => item !== value)
			: [...filtered, value];
	};

	type FavoriteLocation = { name: string; saved: boolean };
	let favoriteLocations: FavoriteLocation[] = [
		{ name: 'Lake Superior – Duluth Harbor', saved: true },
		{ name: 'Florida Keys – Islamorada Flats', saved: true },
		{ name: 'Columbia River – Astoria Jetty', saved: false }
	];

	const toggleFavoriteLocation = (index: number) => {
		favoriteLocations = favoriteLocations.map((location, i) =>
			i === index ? { ...location, saved: !location.saved } : location
		);
	};

	const activeLocation: LocationDetails = {
		name: 'Lake Superior – Duluth Harbor',
		subtitle: 'Duluth, Minnesota',
		address: '350 Harbor Dr, Duluth, MN 55802',
		species: ['Lake Trout', 'Chinook Salmon', 'Coho Salmon', 'Walleye'],
		details: [
			{ label: 'Crowd level', value: 'Moderate' },
			{ label: 'Water body', value: 'Lake' }
		],
		conditions: [
			{ label: 'Conditions', value: 'Clear sky' },
			{ label: 'Temperature', value: '7°C' },
			{ label: 'Wind speed', value: '12 km/h' }
		]
	};

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

	const getEffectiveTheme = (preference: ThemePreference): 'light' | 'dark' => {
		if (preference === 'system') {
			return mediaQuery?.matches ? 'dark' : 'light';
		}
		return preference;
	};

	const syncMapStyle = () => {
		const targetStyle = resolvedTheme;
		if (!targetStyle) {
			return;
		}
		if (!mapInstance) {
			pendingMapStyle = targetStyle;
			return;
		}
		if (currentMapStyle === targetStyle) {
			return;
		}

		const center = mapInstance.getCenter();
		const zoom = mapInstance.getZoom();
		const bearing = mapInstance.getBearing();
		const pitch = mapInstance.getPitch();

		mapInstance.setStyle(MAP_STYLES[targetStyle]);
		pendingMapStyle = targetStyle;

		mapInstance.once('style.load', () => {
			if (!mapInstance) {
				return;
			}
			if (pendingMapStyle && pendingMapStyle !== targetStyle) {
				return;
			}
			mapInstance.setCenter(center);
			mapInstance.setZoom(zoom);
			mapInstance.setBearing(bearing);
			mapInstance.setPitch(pitch);
			currentMapStyle = targetStyle;
			pendingMapStyle = null;
		});
	};

	const applyTheme = (preference: ThemePreference) => {
		theme = preference;
		try {
			localStorage.setItem(THEME_STORAGE_KEY, preference);
		} catch (error) {
			console.debug('Unable to persist theme preference', error);
		}
		resolvedTheme = getEffectiveTheme(preference);
		document.documentElement.dataset.theme = resolvedTheme;
		syncMapStyle();
	};

	const handleSystemThemeChange = (event: MediaQueryListEvent) => {
		if (theme === 'system') {
			resolvedTheme = event.matches ? 'dark' : 'light';
			document.documentElement.dataset.theme = resolvedTheme;
			syncMapStyle();
		}
	};

	const handleThemeSelect = (preference: ThemePreference) => {
		if (preference === theme) {
			return;
		}
		applyTheme(preference);
	};

	const togglePreferences = () => {
		isPreferencesOpen = !isPreferencesOpen;
		if (isPreferencesOpen) {
			isHelpOpen = false;
		}
	};

	const toggleHelp = () => {
		isHelpOpen = !isHelpOpen;
		if (isHelpOpen) {
			isPreferencesOpen = false;
		}
	};

	const closePreferences = () => {
		isPreferencesOpen = false;
	};

	const closeHelp = () => {
		isHelpOpen = false;
	};

	const toggleLocationPanel = () => {
		isLocationPanelOpen = !isLocationPanelOpen;
	};

	const closeLocationPanel = () => {
		isLocationPanelOpen = false;
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closePreferences();
			closeHelp();
			return;
		}

		if (event.key.toLowerCase() === 't') {
			event.preventDefault();
			cycleThemePreference();
		}
	};

	const handleGlobalPointerDown = (event: PointerEvent) => {
		const target = event.target;
		if (!(target instanceof Node)) return;
		const container = uiLayer as Node | null;
		if (container?.contains(target)) return;
		closePreferences();
		closeHelp();
	};

	const cycleThemePreference = () => {
		const currentIndex = themeOrder.indexOf(theme);
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length;
		applyTheme(themeOrder[nextIndex]);
	};

onMount(() => {
	const removeGlobalListeners = () => {
		mediaQuery?.removeEventListener('change', handleSystemThemeChange);
		window.removeEventListener('keydown', handleKeydown);
		window.removeEventListener('pointerdown', handleGlobalPointerDown, true);
	};

	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
		if (stored && ['system', 'light', 'dark'].includes(stored)) {
			theme = stored;
		}
	} catch (error) {
		console.debug('Unable to read theme preference', error);
	}

	mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	mediaQuery.addEventListener('change', handleSystemThemeChange);
	window.addEventListener('keydown', handleKeydown);
	window.addEventListener('pointerdown', handleGlobalPointerDown, true);
	applyTheme(theme);

	if (!accessToken) {
		mapError = MISSING_TOKEN_MESSAGE;
		return removeGlobalListeners;
	}

	mapboxgl.accessToken = accessToken;
	mapInstance = new mapboxgl.Map({
		container: mapContainer!,
		style: MAP_STYLES[resolvedTheme],
		...MAP_OPTIONS
	});
	currentMapStyle = resolvedTheme;
	pendingMapStyle = null;

	mapInstance.addControl(new mapboxgl.NavigationControl(), NAVIGATION_CONTROL_POSITION);

	return () => {
		mapInstance?.remove();
		mapInstance = null;
		removeGlobalListeners();
	};
});

	$: activeThemeOption =
		THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0];

	$: themeSummary =
		theme === 'system'
			? `${activeThemeOption.label} · ${resolvedTheme.charAt(0).toUpperCase()}${resolvedTheme.slice(1)}`
			: `${activeThemeOption.label} mode`;
</script>

<svelte:head>
	<title>HOOK, LINE, & SINKER</title>
</svelte:head>

<div class="relative h-screen w-screen bg-slate-900">
	{#if mapError}
		<section class="mx-auto flex h-full max-w-xl flex-col justify-center gap-4 p-8 text-center text-slate-100" role="alert" aria-live="polite">
			<div class="rounded-2xl bg-slate-900/80 p-6 shadow-xl ring-1 ring-slate-700/40 backdrop-blur">
				<h1 class="text-2xl font-semibold">Map unavailable</h1>
				<p class="text-sm text-slate-300">{mapError}</p>
				<p class="text-sm text-slate-300">
					{MISSING_TOKEN_HELP.lead}
					<code class="mx-1 inline-block rounded bg-slate-800 px-2 py-1 text-xs font-mono">{MAPBOX_TOKEN_ENV}</code>
					{MISSING_TOKEN_HELP.trail}
				</p>
			</div>
		</section>
	{:else}
		<div bind:this={mapContainer} class="absolute inset-0 h-full w-full" aria-label="Interactive city map"></div>
		<div bind:this={uiLayer} class="pointer-events-none absolute inset-0 flex flex-col z-10">
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
					onToggleLocationPanel={toggleLocationPanel}
					onTogglePreferences={togglePreferences}
					onToggleHelp={toggleHelp}
				/>
			</div>
			<div class="flex-1 px-4 pb-4">
				<div class="flex h-full flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div class="order-last md:order-0 md:max-w-sm md:shrink-0">
						{#if isLocationPanelOpen}
							<LocationPanel
								location={activeLocation}
								onClose={closeLocationPanel}
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
								onToggleSpecies={toggleSpecies}
								crowdOptions={crowdOptions}
								crowdPreference={crowdPreference}
								onSelectCrowd={(value: string) => setCrowdPreference(value as CrowdPreference)}
								weatherOptions={weatherOptions}
								weatherPreferences={weatherPreferences}
								onToggleWeather={(value: string) => toggleWeatherPreference(value as WeatherPreference)}
								favoriteLocations={favoriteLocations}
								onToggleFavorite={toggleFavoriteLocation}
								onClose={closePreferences}
								className="pointer-events-auto w-full md:w-80"
							/>
						{/if}
						{#if isHelpOpen}
							<HelpPanel
								shortcuts={shortcutTips}
								tips={explorationTips}
								onClose={closeHelp}
								className="pointer-events-auto w-full md:w-72"
							/>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
