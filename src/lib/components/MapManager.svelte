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

		mapboxgl.accessToken = accessToken;
		mapInstance = new mapboxgl.Map({
			container: mapContainer!,
			style: MAP_STYLES[mapStyle].url,
			...MAP_OPTIONS
		});
		currentMapStyle = mapStyle;
		pendingMapStyle = null;

		mapInstance.addControl(new mapboxgl.NavigationControl(), NAVIGATION_CONTROL_POSITION);
		
		// Notify parent when map is ready
		onMapReady?.(mapInstance);

		return () => {
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
