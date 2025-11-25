<script lang="ts">
	import MapManager from '$lib/components/MapManager.svelte';
	import StateManager from '$lib/components/StateManager.svelte';
	import DesktopLayout from '$lib/components/DesktopLayout.svelte';
	import MobileLayout from '$lib/components/MobileLayout.svelte';
	import { browser } from '$app/environment';
	import type { MapStyle } from '$lib/config/map';

	// Map state
	let mapContainer: HTMLDivElement | null = null;
	let mapStyle: MapStyle = 'midnight-water';

	// UI state
	let isMobile: boolean = false;

	// Responsive breakpoint detection
	$: if (browser) {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
	}

	// App state
	let speciesOptions: string[] = ['Bass', 'Walleye', 'Pike', 'Trout'];
	let selectedSpecies: string[] = [];

	// Event handlers
	const toggleSpecies = (species: string) => {
		selectedSpecies = selectedSpecies.includes(species)
			? selectedSpecies.filter((item) => item !== species)
			: [...selectedSpecies, species];
	};

	const handleResetBearing = () => {
		// Reset map bearing to north
	};

	const handleToggleLayers = () => {
		mapStyle = mapStyle === 'midnight-water' ? 'glare-cut' : 'midnight-water';
	};

	const handleZoomIn = () => {
		// Zoom in map
	};

	const handleZoomOut = () => {
		// Zoom out map
	};

	const handleGPSLocation = () => {
		// Get user GPS location
	};

	const handleLogCatch = () => {
		// Open log catch modal
	};

	const handleToggleDock = () => {
		// Toggle dock expansion logic here
	};
</script>

<svelte:head>
	<title>HOOK, LINE, & SINKER</title>
</svelte:head>

<!-- Managers (invisible, handle state and logic) -->
<StateManager
	bind:speciesOptions
	bind:selectedSpecies
/>

<div class="relative h-screen w-screen overflow-hidden bg-black">
	<!-- Map -->
	<MapManager bind:mapStyle={mapStyle} bind:mapContainer />

	<!-- Responsive UI Layer -->
	{#if isMobile}
		<!-- Mobile Layout -->
		<MobileLayout
			speciesOptions={speciesOptions}
			selectedSpecies={selectedSpecies}
			onToggleSpecies={toggleSpecies}
			temperature={24}
			weatherCondition={'cloudy'}
			moonPhase={'🌗'}
			mapStyle={mapStyle}
			onToggleLayers={handleToggleLayers}
			onResetBearing={handleResetBearing}
			onGPSLocation={handleGPSLocation}
			onLogCatch={handleLogCatch}
			onToggleDock={handleToggleDock}
		/>
	{:else}
		<!-- Desktop Layout -->
		<DesktopLayout
			speciesOptions={speciesOptions}
			selectedSpecies={selectedSpecies}
			onToggleSpecies={toggleSpecies}
			temperature={24}
			weatherCondition={'cloudy'}
			moonPhase={'🌗'}
			onResetBearing={handleResetBearing}
			onToggleLayers={handleToggleLayers}
			onZoomIn={handleZoomIn}
			onZoomOut={handleZoomOut}
			onLogCatch={handleLogCatch}
		/>
	{/if}
</div>
