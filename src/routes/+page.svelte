<script lang="ts">
	import MapManager from '$lib/components/MapManager.svelte';
	import Layout from '$lib/components/Layout.svelte';
	import MapStyleSelector from '$lib/components/MapStyleSelector.svelte';
	import type { MapStyle } from '$lib/config/map';
	import { cache, CACHE_KEYS, CACHE_TTL } from '$lib/utils/cache';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import type { FishingConditions, Location, LocationRecommendation } from '$lib/shared/types';

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

	// Fishing conditions state
	let recommendedSpots: LocationRecommendation[] = [];
	let isLoadingRecommendations = false;
	let recommendationError: string | null = null;
	let userLocation: { lat: number; lng: number } | null = null;
	let searchRadius = 10; // Default 10 miles radius
	let showRecommendedOnly = false; // Toggle between all markers and recommended spots
	let allMarkers: any[] = []; // Store all markers
	let recommendedMarkers: any[] = []; // Store only recommended markers

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
		
		// Apply species filtering to markers
		filterMarkersBySpecies();
	};

	// Filter markers based on selected species
	const filterMarkersBySpecies = () => {
		if (!allMarkers.length) return;
		
		// If no species selected, show all markers
		if (selectedSpecies.length === 0) {
			markers = showRecommendedOnly ? [...recommendedMarkers] : [...allMarkers, ...recommendedMarkers];
		} else {
			// Filter markers by selected species
			const filteredMarkers = allMarkers.filter((marker: any) => {
				if (!marker.metadata?.fish_species) return false;
				
				const fishSpecies = marker.metadata.fish_species as string;
				// Check if any selected species is found in the marker's fish species string
				return selectedSpecies.some(species => 
					fishSpecies.toLowerCase().includes(species.toLowerCase())
				);
			});
			
			// Combine filtered markers with recommended markers
			markers = showRecommendedOnly ? [...recommendedMarkers] : [...filteredMarkers, ...recommendedMarkers];
		}
		
		// Filter out markers with invalid coordinates
		markers = markers.filter((marker: any) => {
			const lat = typeof marker.lat === 'number' ? marker.lat : parseFloat(marker.lat);
			const lng = typeof marker.lng === 'number' ? marker.lng : parseFloat(marker.lng);
			return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
		});
		
		renderMarkers();
	};

	const handleMapReady = async (map: any) => {
		mapInstance = map;
		await loadData();
		await loadMarkers();
		// Try to get user's location for recommendations
		getUserLocation();
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

		const handleToggleProfile = () => {
			console.log('Profile toggled - placeholder for user profile functionality');
		};

		window.addEventListener('mapZoomIn', handleZoomIn);
		window.addEventListener('mapZoomOut', handleZoomOut);
		window.addEventListener('toggleProfile', handleToggleProfile);
		window.addEventListener('mapStyleChange', handleMapStyleChange);

		return () => {
			window.removeEventListener('mapZoomIn', handleZoomIn);
			window.removeEventListener('mapZoomOut', handleZoomOut);
			window.removeEventListener('toggleProfile', handleToggleProfile);
			window.removeEventListener('mapStyleChange', handleMapStyleChange);
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

	const handleMapStyleChange = (event: Event) => {
		const customEvent = event as CustomEvent<MapStyle>;
		const newStyle = customEvent.detail;
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

	// Get user's location for recommendations
	const getUserLocation = () => {
		if (typeof window !== 'undefined' && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// Validate coordinates before setting
					const lat = position.coords.latitude;
					const lng = position.coords.longitude;
					
					if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
						console.error('Invalid coordinates from geolocation:', { lat, lng });
						recommendationError = 'Invalid location data received. Using default location.';
						userLocation = { lat: 40.7128, lng: -74.0060 };
					} else {
						userLocation = { lat, lng };
						console.log('User location obtained:', userLocation);
						
						// Fly to user location
						if (mapInstance) {
							mapInstance.flyTo({
								center: [lng, lat],
								zoom: 10
							});
						}
					}
					
					// Load recommendations for user's location
					loadRecommendedSpots();
				},
				(error) => {
					console.error('Error getting location:', error);
					let errorMessage = 'Could not get your location. Using default location.';
					
					// Provide more specific error messages
					switch (error.code) {
						case error.PERMISSION_DENIED:
							errorMessage = 'Location access denied. Please enable location permissions. Using default location.';
							break;
						case error.POSITION_UNAVAILABLE:
							errorMessage = 'Location information unavailable. Using default location.';
							break;
						case error.TIMEOUT:
							errorMessage = 'Location request timed out. Using default location.';
							break;
						default:
							errorMessage = 'Unknown location error. Using default location.';
							break;
					}
					
					recommendationError = errorMessage;
					// Default to New York if location access is denied
					userLocation = { lat: 40.7128, lng: -74.0060 };
					loadRecommendedSpots();
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000 // 5 minutes
				}
			);
		} else {
			recommendationError = 'Geolocation is not supported by your browser';
			userLocation = { lat: 40.7128, lng: -74.0060 }; // Default to New York
			loadRecommendedSpots();
		}
	};

	// Load recommended fishing spots based on current location
	const loadRecommendedSpots = async () => {
		if (!userLocation) return;
		
		isLoadingRecommendations = true;
		recommendationError = null;
		
		try {
			const response = await fetch(
				`/api/recommended?latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius=${searchRadius}`
			);
			
			if (!response.ok) {
				throw new Error(`Recommendations API returned ${response.status}`);
			}
			
			const data = await response.json();
			recommendedSpots = data.recommendations || [];
			
			// Update recommended markers
			recommendedMarkers = recommendedSpots.map(spot => ({
				...spot.location,
				score: spot.score,
				isRecommended: true
			}));
			
			// Apply species filtering after loading recommendations
			filterMarkersBySpecies();
		} catch (error) {
			console.error('Failed to load recommendations:', error);
			recommendationError = error instanceof Error ? error.message : 'Failed to load recommendations';
		} finally {
			isLoadingRecommendations = false;
		}
	};

	const loadMarkers = async () => {
		if (!mapInstance) return;

		try {
			const response = await fetch('/api/markers');
			if (!response.ok) {
				throw new Error(`Markers API returned ${response.status}`);
			}
			allMarkers = await response.json();
			// Apply species filtering after loading markers
			filterMarkersBySpecies();
		} catch (error) {
			console.error('Failed to load markers:', error);
		}
	};

	const renderMarkers = () => {
		if (!mapInstance) return;

		// Clear existing markers
		mapMarkers.forEach(marker => marker.remove());
		mapMarkers = [];

		// Add new markers with coordinate validation
		markers.forEach((marker: any) => {
			// Validate coordinates
			const lat = typeof marker.lat === 'number' ? marker.lat : parseFloat(marker.lat);
			const lng = typeof marker.lng === 'number' ? marker.lng : parseFloat(marker.lng);
			
			// Skip markers with invalid coordinates
			if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
				console.warn('Skipping marker with invalid coordinates:', marker);
				return;
			}

			const el = document.createElement('div');
			el.className = 'custom-marker';
			el.style.width = '24px';
			el.style.height = '24px';
			el.style.borderRadius = '50%';
			el.style.cursor = 'pointer';
			el.style.border = '2px solid white';
			
			// Color by score if available (recommended spots)
			if (marker.score !== undefined) {
				// Scale color from red (0) to green (100)
				const hue = (marker.score / 100) * 120; // 0-100 to 0-120 degrees (red to green)
				el.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
			}
			// Fallback to category-based colors
			else if (marker.category === 'lake') {
				el.style.backgroundColor = '#3b82f6'; // blue
			} else if (marker.category === 'river') {
				el.style.backgroundColor = '#10b981'; // green
			} else if (marker.category === 'parking') {
				el.style.backgroundColor = '#f59e0b'; // amber
			} else {
				el.style.backgroundColor = '#6b7280'; // gray default
			}

			// Create popup content
			let popupContent = `
				<div style="font-family: system-ui, -apple-system, sans-serif; padding: 8px; max-width: 200px;">
					<h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #f8fafc;">${marker.title || 'Untitled Location'}</h4>
			`;

			// Add score for recommended spots
			if (marker.score !== undefined) {
				popupContent += `
					<p style="margin: 0 0 4px 0; font-size: 12px; color: #10b981;">Score: ${Math.round(marker.score)}/100</p>
				`;
			}

			// Add fish species if available
			if (marker.metadata?.fish_species) {
				popupContent += `
					<p style="font-size: 11px; color: #3b82f6; margin: 0 0 4px 0;">🐟 ${marker.metadata.fish_species}</p>
				`;
			}

			// Add description and category
			if (!marker.isRecommended) {
					popupContent += `
					<div style="margin-top: 8px; font-size: 12px; color: #a6adc8;">
						<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
							<span>Weather:</span>
							<span style="color: #cdd6f4;">${Math.round(marker.breakdown.weatherComfort)}/100</span>
						</div>
						<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
							<span>Fish Activity:</span>
							<span style="color: #cdd6f4;">${Math.round(marker.breakdown.fishActivity)}/100</span>
						</div>
						<div style="display: flex; justify-between;">
							<span>Water Conditions:</span>
							<span style="color: #cdd6f4;">${Math.round(marker.breakdown.waterConditions)}/100</span>
						</div>
					</div>
					`;
				}
			} else {
				// Default popup for non-recommended markers
				popupContent += `
					${marker.description ? `<p style="font-size: 12px; margin: 0 0 4px 0; color: #a6adc8;">${marker.description}</p>` : ''}
					<p style="font-size: 11px; color: #6c7086; margin: 0;">${marker.category ? `Category: ${marker.category}` : ''}</p>
				`;
			}

			popupContent += `</div>`;

			const mapMarker = new mapboxgl.Marker(el)
				.setLngLat([marker.lng, marker.lat])
				.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
				.addTo(mapInstance);

			mapMarkers.push(mapMarker);
		});

		console.log(`Rendered ${mapMarkers.length} markers on the map`);
	};

	// Toggle between showing all markers and recommended spots
	const toggleShowRecommended = () => {
		showRecommendedOnly = !showRecommendedOnly;
		
		// Apply species filtering after toggling recommended view
		filterMarkersBySpecies();
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
		{isMobile}
		currentMapStyle={mapStyle}
		{showRecommendedOnly}
		toggleShowRecommended={() => showRecommendedOnly = !showRecommendedOnly}
		{userLocation}
		{searchRadius}
		{loadRecommendedSpots}
		recommendationError={recommendationError}
		{recommendedSpots}
		isLoadingRecommendations={isLoadingRecommendations}
		mapInstance={mapInstance}
		mapMarkers={mapMarkers}
	/>
</div>

<style>
	/* Mapbox popup styling to match Midnight Standard theme */
	:global(.mapboxgl-popup) {
		background: transparent !important;
	}

	:global(.mapboxgl-popup-content) {
		background: rgba(30, 30, 46, 0.9) !important;
		border: 1px solid rgba(255, 255, 255, 0.1) !important;
		border-radius: 8px !important;
		padding: 0 !important;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
		backdrop-filter: blur(12px) !important;
	}

	:global(.mapboxgl-popup-tip) {
		border-top-color: rgba(30, 30, 46, 0.9) !important;
		border-bottom-color: rgba(30, 30, 46, 0.9) !important;
	}

	:global(.mapboxgl-popup-close-button) {
		color: #a6adc8 !important;
		background: transparent !important;
		font-size: 20px !important;
		padding: 4px !important;
		right: 4px !important;
		top: 4px !important;
	}

	:global(.mapboxgl-popup-close-button:hover) {
		color: #cdd6f4 !important;
		background: rgba(255, 255, 255, 0.1) !important;
		border-radius: 4px !important;
	}
</style>
