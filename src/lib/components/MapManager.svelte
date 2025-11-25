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
		NAVIGATION_CONTROL_POSITION,
		type MapStyle
	} from '$lib/config/map';

	export let mapStyle: MapStyle = 'streets';
	export let mapContainer: HTMLDivElement | null = null;
	export let onMapReady: ((map: mapboxgl.Map) => void) | null = null;
	export let onMapError: ((error: string) => void) | null = null;
	export let onMapLoad: (() => void) | null = null;

	let mapInstance: mapboxgl.Map | null = null;
	let currentMapStyle: MapStyle | null = null;
	let pendingMapStyle: MapStyle | null = null;
	let mapError: string | null = null;
	let styleLoadHandler: (() => void) | null = null;

	const accessToken = env[MAPBOX_TOKEN_ENV];

	const syncMapStyle = () => {
		const targetStyle = mapStyle;
		if (!targetStyle || !MAP_STYLES[targetStyle] || !mapInstance || currentMapStyle === targetStyle) return;

		const center = mapInstance.getCenter();
		const zoom = mapInstance.getZoom();
		const bearing = mapInstance.getBearing();
		const pitch = mapInstance.getPitch();

		pendingMapStyle = targetStyle;

		// Remove any existing style.load listener to prevent duplicates
		if (styleLoadHandler) {
			mapInstance.off('style.load', styleLoadHandler);
		}

		// Create new handler
		styleLoadHandler = () => {
			if (!mapInstance) return;
			mapInstance.setCenter(center);
			mapInstance.setZoom(zoom);
			mapInstance.setBearing(bearing);
			mapInstance.setPitch(pitch);
			currentMapStyle = targetStyle;
			pendingMapStyle = null;
			styleLoadHandler = null;
		};

		mapInstance.setStyle(MAP_STYLES[targetStyle].url);
		mapInstance.once('style.load', styleLoadHandler);
	};

	onMount(() => {
		if (!accessToken) {
			mapError = MISSING_TOKEN_MESSAGE;
			onMapError?.(MISSING_TOKEN_MESSAGE);
			return;
		}

		try {
			mapInstance = new mapboxgl.Map({
				container: mapContainer!,
				style: MAP_STYLES[mapStyle].url,
				accessToken,
				...MAP_OPTIONS,
				// WebGL context preservation settings
				preserveDrawingBuffer: true,
				fadeDuration: 0,
				crossSourceCollisions: false
			});

			// Add custom attribution control positioned away from UI
			mapInstance.addControl(new mapboxgl.AttributionControl({
				compact: true
			}), 'bottom-left');

			// Notify parent when map is ready
			onMapReady?.(mapInstance);

			// Apply chartplotter styling when style loads
			mapInstance.on('style.load', () => {
				if (!mapInstance) return;
				
				// Hide road layers for chartplotter effect - set opacity to 0.05
				const layers = mapInstance.getStyle().layers;
				layers?.forEach(layer => {
					if (layer.id.includes('road') || layer.id.includes('highway') || layer.id.includes('street') || layer.id.includes('motorway') || layer.id.includes('trunk') || layer.id.includes('primary') || layer.id.includes('secondary') || layer.id.includes('tertiary')) {
						// Set opacity to almost invisible (0.05) instead of hiding completely
						mapInstance?.setPaintProperty(layer.id, 'line-opacity', 0.05);
						mapInstance?.setPaintProperty(layer.id, 'line-color', '#ffffff');
					}
				});

				// Add neon blue bathymetry styling (if layer exists)
				if (mapInstance.getLayer('water')) {
					mapInstance.setPaintProperty('water', 'fill-color', '#00d4ff');
					mapInstance.setPaintProperty('water', 'fill-outline-color', '#0099cc');
				}
			});

			// Handle non-critical Mapbox errors
			mapInstance.on('error', (e) => {
				// Only log non-critical errors, don't fail the map
				console.warn('Mapbox warning:', e);
			});

			// Handle WebGL context loss
			mapInstance.on('render', () => {
				if (!mapInstance) return;
				
				const canvas = mapInstance.getCanvas();
				const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
				
				if (gl && 'isContextLost' in gl && gl.isContextLost()) {
					console.warn('WebGL context lost, attempting to restore...');
					// Mapbox GL JS should automatically handle context restoration
					// but we can add custom handling if needed
				}
			});

			// Notify when map is fully loaded
			onMapLoad?.();

			mapInstance.on('load', () => {
				currentMapStyle = mapStyle;
			});
		} catch (error) {
			console.error('Map initialization error:', error);
			mapError = 'Failed to initialize map';
			onMapError?.(mapError || 'Unknown map error');
		}

		// Add custom zoom control listeners
		const handleZoomIn = () => {
			if (mapInstance) {
				mapInstance.zoomIn();
			}
		};

		const handleZoomOut = () => {
			if (mapInstance) {
				mapInstance.zoomOut();
			}
		};

		window.addEventListener('mapZoomIn', handleZoomIn);
		window.addEventListener('mapZoomOut', handleZoomOut);

		return () => {
			window.removeEventListener('mapZoomIn', handleZoomIn);
			window.removeEventListener('mapZoomOut', handleZoomOut);
			mapInstance?.remove();
			mapInstance = null;
		};
	});

	$: if (mapStyle && mapInstance) {
		syncMapStyle();
	}

	export const getMap = () => mapInstance;
</script>

{#if mapError}
	<section class="mx-auto flex h-full max-w-xl flex-col justify-center gap-4 p-8 text-center text-[rgb(var(--catppuccin-text))]" role="alert" aria-live="polite">
		<div class="rounded-2xl bg-[rgb(var(--catppuccin-base)/0.8)] p-6 shadow-xl ring-1 ring-[rgb(var(--catppuccin-surface0)/0.4)] backdrop-blur">
			<h1 class="text-2xl font-semibold text-[rgb(var(--catppuccin-text))]">Map unavailable</h1>
			<p class="text-sm text-[rgb(var(--catppuccin-subtext1))]">{mapError}</p>
			<p class="text-sm text-[rgb(var(--catppuccin-subtext1))]">
				{MISSING_TOKEN_HELP.lead}
				<code class="mx-1 inline-block rounded bg-[rgb(var(--catppuccin-surface0))] px-2 py-1 text-xs font-mono text-[rgb(var(--catppuccin-text))]">{MAPBOX_TOKEN_ENV}</code>
				{MISSING_TOKEN_HELP.trail}
			</p>
		</div>
	</section>
{:else}
	<div bind:this={mapContainer} class="absolute inset-0 h-full w-full" aria-label="Interactive city map"></div>
{/if}
