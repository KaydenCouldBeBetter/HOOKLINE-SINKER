<script lang="ts">
	import MapManager from '$lib/components/MapManager.svelte';
	import Layout from '$lib/components/Layout.svelte';
	import MapStyleSelector from '$lib/components/MapStyleSelector.svelte';
	import type { MapStyle } from '$lib/config/map';
	import { cache, CACHE_KEYS, CACHE_TTL } from '$lib/utils/cache';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	// Map state
	let mapContainer: HTMLDivElement | null = null;
	let mapStyle: MapStyle = 'structure';
	let mapInstance: any = null;

	// App state
	let selectedSpecies: string[] = [];
	let currentWeather: any = null;
	let weatherError: string | null = null;
	let isLoadingWeather: boolean = false;
	let isUsingCachedWeather: boolean = false;
	let markers: any[] = [];
	let mapMarkers: mapboxgl.Marker[] = [];

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

	const handleMapReady = async (map: any) => {
		mapInstance = map;
		await loadData();
		await loadMarkers();
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

	onMount(() => {
		// Listen for custom events
		const handleZoomIn = () => {
			mapInstance?.zoomIn();
		};

		const handleZoomOut = () => {
			mapInstance?.zoomOut();
		};

		const handleToggleMenu = () => {
			console.log('Menu toggled - placeholder for main menu functionality');
		};

		const handleToggleProfile = () => {
			console.log('Profile toggled - placeholder for user profile functionality');
		};

		window.addEventListener('mapZoomIn', handleZoomIn);
		window.addEventListener('mapZoomOut', handleZoomOut);
		window.addEventListener('toggleMenu', handleToggleMenu);
		window.addEventListener('toggleProfile', handleToggleProfile);

		return () => {
			window.removeEventListener('mapZoomIn', handleZoomIn);
			window.removeEventListener('mapZoomOut', handleZoomOut);
			window.removeEventListener('toggleMenu', handleToggleMenu);
			window.removeEventListener('toggleProfile', handleToggleProfile);
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

	const loadMarkers = async () => {
		if (!mapInstance) return;

		try {
			const response = await fetch('/api/markers');
			if (!response.ok) {
				throw new Error(`Markers API returned ${response.status}`);
			}
			markers = await response.json();
			renderMarkers();
		} catch (error) {
			console.error('Failed to load markers:', error);
		}
	};

	const renderMarkers = () => {
		if (!mapInstance) return;

		// Clear existing markers
		mapMarkers.forEach(marker => marker.remove());
		mapMarkers = [];

		// Add new markers
		markers.forEach((marker: any) => {
			const el = document.createElement('div');
			el.className = 'custom-marker';
			el.style.width = '24px';
			el.style.height = '24px';
			el.style.borderRadius = '50%';
			el.style.cursor = 'pointer';
			el.style.border = '2px solid white';
			
			// Color by category
			if (marker.category === 'lake') {
				el.style.backgroundColor = '#3b82f6'; // blue
			} else if (marker.category === 'river') {
				el.style.backgroundColor = '#10b981'; // green
			} else if (marker.category === 'parking') {
				el.style.backgroundColor = '#f59e0b'; // orange
			} else {
				el.style.backgroundColor = '#6366f1'; // indigo
			}

			const mapMarker = new mapboxgl.Marker(el)
				.setLngLat([marker.lng, marker.lat])
				.setPopup(
					new mapboxgl.Popup({ offset: 25 }).setHTML(
						`<div style="color: black;">
							<h3 style="font-weight: bold; margin-bottom: 4px;">${marker.title}</h3>
							${marker.description ? `<p style="font-size: 12px;">${marker.description}</p>` : ''}
							<p style="font-size: 11px; color: #666; margin-top: 4px;">Category: ${marker.category}</p>
						</div>`
					)
				)
				.addTo(mapInstance);

			mapMarkers.push(mapMarker);
		});

		console.log(`Rendered ${mapMarkers.length} markers on the map`);
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
		isUsingCachedWeather={isUsingCachedWeather}
		onRefreshWeather={refreshWeather}
		onLogCatch={handleLogCatch}
		{isMobile}
		currentMapStyle={mapStyle}
		onMapStyleChange={(style: MapStyle) => mapStyle = style}
	/>
</div>
