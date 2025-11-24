<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
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

	export let theme: 'light' | 'dark' = 'dark';
	export let mapContainer: HTMLDivElement | null = null;

	let mapInstance: mapboxgl.Map | null = null;
	let currentMapStyle: 'light' | 'dark' | null = null;
	let pendingMapStyle: 'light' | 'dark' | null = null;
	let mapError: string | null = null;

	const dispatch = createEventDispatcher();

	const accessToken = env[MAPBOX_TOKEN_ENV];

	const syncMapStyle = () => {
		const targetStyle = theme;
		if (!targetStyle) return;
		if (!mapInstance) {
			pendingMapStyle = targetStyle;
			return;
		}
		if (currentMapStyle === targetStyle) return;

		const center = mapInstance.getCenter();
		const zoom = mapInstance.getZoom();
		const bearing = mapInstance.getBearing();
		const pitch = mapInstance.getPitch();

		mapInstance.setStyle(MAP_STYLES[targetStyle]);
		pendingMapStyle = targetStyle;

		mapInstance.once('style.load', () => {
			if (!mapInstance) return;
			if (pendingMapStyle && pendingMapStyle !== targetStyle) return;
			mapInstance.setCenter(center);
			mapInstance.setZoom(zoom);
			mapInstance.setBearing(bearing);
			mapInstance.setPitch(pitch);
			currentMapStyle = targetStyle;
			pendingMapStyle = null;
		});
	};

	onMount(() => {
		if (!accessToken) {
			mapError = MISSING_TOKEN_MESSAGE;
			return;
		}

		mapboxgl.accessToken = accessToken;
		mapInstance = new mapboxgl.Map({
			container: mapContainer!,
			style: MAP_STYLES[theme],
			...MAP_OPTIONS
		});
		currentMapStyle = theme;
		pendingMapStyle = null;

		mapInstance.addControl(new mapboxgl.NavigationControl(), NAVIGATION_CONTROL_POSITION);

		return () => {
			mapInstance?.remove();
			mapInstance = null;
		};
	});

	$: if (theme && mapInstance) {
		syncMapStyle();
	}

	export const getMap = () => mapInstance;
</script>

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
{/if}
