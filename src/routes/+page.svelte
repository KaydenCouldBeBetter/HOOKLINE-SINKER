<script context="module" lang="ts">
	export const ssr = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { env } from '$env/dynamic/public';

	let mapContainer: HTMLDivElement | null = null;
	const accessToken = env.PUBLIC_MAPBOX_ACCESS_TOKEN;

	onMount(() => {
		if (!accessToken) {
			console.warn('PUBLIC_MAPBOX_ACCESS_TOKEN is not set. Mapbox map will not initialize.');
			return;
		}

		mapboxgl.accessToken = accessToken;
		const map = new mapboxgl.Map({
			container: mapContainer!,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [-73.9857, 40.7484],
			zoom: 11
		});

		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		return () => {
			map.remove();
		};
	});
</script>

<svelte:head>
	<title>Map View</title>
</svelte:head>

<div bind:this={mapContainer} class="map-container" aria-label="Interactive city map"></div>

<style>
	:global(html, body) {
		margin: 0;
		height: 100%;
	}

	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	:global(#svelte) {
		height: 100%;
	}

	.map-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
