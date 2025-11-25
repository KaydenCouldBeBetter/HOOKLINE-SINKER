<script lang="ts">
	import MapManager from '$lib/components/MapManager.svelte';
	import Layout from '$lib/components/Layout.svelte';
	import MapStyleSelector from '$lib/components/MapStyleSelector.svelte';
	import type { MapStyle } from '$lib/config/map';
	import { cache, CACHE_KEYS, CACHE_TTL } from '$lib/utils/cache';
	import { onMount } from 'svelte';

	// Map state
	let mapContainer: HTMLDivElement | null = null;
	let mapStyle: MapStyle = 'midnight-water';
	let showLayersPanel = false;
	let mapInstance: any = null;

	// App state
	let selectedSpecies: string[] = [];
	let currentWeather: any = null;
	let weatherError: string | null = null;
	let isLoadingWeather: boolean = false;
	let isUsingCachedWeather: boolean = false;

	// UI state
	let isMobile: boolean = false;

	// Responsive breakpoint detection
	$: {
		const checkMobile = () => {
			if (typeof window !== 'undefined') {
				isMobile = window.innerWidth < 768;
			}
		};
		checkMobile();
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', checkMobile);
		}
	}

	// Event handlers
	const toggleSpecies = (species: string) => {
		selectedSpecies = selectedSpecies.includes(species)
			? selectedSpecies.filter((item) => item !== species)
			: [...selectedSpecies, species];
	};

	const handleMapReady = (map: any) => {
		mapInstance = map;
		loadData();
	};

	const handleMapError = (error: string) => {
		console.error('Map error:', error);
	};

	const handleMapLoad = () => {
		console.log('Map loaded successfully');
	};

	const loadData = async () => {
		// Load weather data with caching
		isLoadingWeather = true;
		weatherError = null;
		isUsingCachedWeather = false;

		// Try to get from cache first
		const cachedWeather = cache.get(CACHE_KEYS.WEATHER);
		if (cachedWeather) {
			currentWeather = cachedWeather;
			isUsingCachedWeather = true;
			isLoadingWeather = false;
			return;
		}

		try {
			const response = await fetch('/api/weather/location?latitude=40.7128&longitude=-74.0060');
			if (!response.ok) {
				throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
			}
			const data = await response.json();
			if (!data || !data.forecast) {
				throw new Error('Invalid weather data format');
			}
			currentWeather = data;
			// Cache the weather data
			cache.set(CACHE_KEYS.WEATHER, data, CACHE_TTL.WEATHER);
		} catch (error) {
			console.error('Failed to load weather:', error);
			weatherError = error instanceof Error ? error.message : 'Failed to load weather data';
			// Set fallback weather data
			currentWeather = {
				forecast: [{
					summary: {
						maxTemp: 24,
						condition: 'Partly Cloudy',
						moonPhase: '🌗'
					}
				}]
			};
		} finally {
			isLoadingWeather = false;
		}
	};

	const handleResetBearing = () => {
		mapInstance?.setBearing(0);
	};

	const handleToggleLayers = () => {
		showLayersPanel = !showLayersPanel;
	};

	const handleZoomIn = () => {
		mapInstance?.zoomIn();
	};

	const handleZoomOut = () => {
		mapInstance?.zoomOut();
	};

	onMount(() => {
		// Listen for custom events
		const handleToggleLayers = () => {
			showLayersPanel = !showLayersPanel;
		};

		const handleZoomIn = () => {
			mapInstance?.zoomIn();
		};

		const handleZoomOut = () => {
			mapInstance?.zoomOut();
		};

		window.addEventListener('toggleMapLayers', handleToggleLayers);
		window.addEventListener('mapZoomIn', handleZoomIn);
		window.addEventListener('mapZoomOut', handleZoomOut);

		return () => {
			window.removeEventListener('toggleMapLayers', handleToggleLayers);
			window.removeEventListener('mapZoomIn', handleZoomIn);
			window.removeEventListener('mapZoomOut', handleZoomOut);
		};
	});

	const handleGPSLocation = () => {
		if (typeof window !== 'undefined' && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					mapInstance?.flyTo({
						center: [position.coords.longitude, position.coords.latitude],
						zoom: 12
					});
				},
				(error) => {
					console.error('GPS error:', error);
				}
			);
		}
	};

	const handleMapStyleChange = (event: CustomEvent<MapStyle>) => {
		const newStyle = event.detail;
		if (!newStyle || mapStyle === newStyle) return;
		mapStyle = newStyle;
	};

	const handleLogCatch = () => {
		if (typeof window !== 'undefined') {
			alert('Log Catch functionality - placeholder implementation');
		}
	};

	// Cache management functions
	const refreshWeather = () => {
		cache.invalidate(CACHE_KEYS.WEATHER);
		loadData();
	};

	const refreshSpecies = () => {
		cache.invalidate(CACHE_KEYS.SPECIES);
		// Trigger species reload through Layout component
	};
</script>

<svelte:head>
	<title>HOOK, LINE, & SINKER</title>
</svelte:head>

<div class="relative h-screen w-screen overflow-hidden bg-black">
	<!-- Map -->
	<MapManager bind:mapStyle={mapStyle} bind:mapContainer={mapContainer} onMapReady={handleMapReady} onMapError={handleMapError} onMapLoad={handleMapLoad} />

	<!-- Responsive UI Layer -->
	<Layout
		{selectedSpecies}
		onToggleSpecies={toggleSpecies}
		temperature={currentWeather?.forecast?.[0]?.summary?.maxTemp || 24}
		weatherCondition={currentWeather?.forecast?.[0]?.summary?.condition?.toLowerCase()?.includes('rain') ? 'rainy' : 
											currentWeather?.forecast?.[0]?.summary?.condition?.toLowerCase()?.includes('cloud') ? 'cloudy' : 'sunny'}
		moonPhase={currentWeather?.forecast?.[0]?.moonPhase || '🌗'}
		weatherError={weatherError}
		isLoadingWeather={isLoadingWeather}
		isUsingCachedWeather={isUsingCachedWeather}
		onRefreshWeather={refreshWeather}
		onResetBearing={handleResetBearing}
		onGPSLocation={handleGPSLocation}
		onLogCatch={handleLogCatch}
		{isMobile}
	/>
</div>

<!-- Floating Map Layers Panel (Hidden by default) -->
{#if showLayersPanel}
<div class="fixed top-1/2 right-24 -translate-y-1/2 bg-[#1e1e2e]/70 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-2xl z-50 pointer-events-auto w-64">
	<div class="flex justify-between items-center mb-3">
		<h3 class="text-[#cdd6f4] font-semibold text-sm tracking-wide">Map Layers</h3>
		<button 
			class="text-[#a6adc8] hover:text-[#cdd6f4] transition-colors"
			on:click={() => showLayersPanel = false}
		>
			✕
		</button>
	</div>
	<MapStyleSelector 
		bind:currentStyle={mapStyle} 
		on:styleChange={handleMapStyleChange}
		{isMobile}
	/>
</div>
{/if}
