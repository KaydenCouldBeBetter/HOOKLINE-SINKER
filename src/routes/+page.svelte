<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl, { type Map as MapboxMap } from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { env } from '$env/dynamic/public';

	const accessToken = env.PUBLIC_MAPBOX_ACCESS_TOKEN;

	type MarkerCategory = 'lake' | 'river' | 'parking';

	type Marker = {
		id: string;
		lat: number;
		lng: number;
		title: string;
		description?: string;
		category: MarkerCategory;
		metadata?: Record<string, unknown>;
	};

	let mapContainer: HTMLDivElement | null = null;
	let map: MapboxMap | null = null;
	let loading = true;
	let error: string | null = null;
	let markers: Marker[] = [];

	const getMetaString = (marker: Marker, key: string): string | null => {
		const value = marker.metadata?.[key];
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
		return null;
	};

	onMount(() => {
		if (!accessToken) {
			error = 'Mapbox access token is not configured. Please check your environment variables.';
			loading = false;
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				const response = await fetch('/api/markers');
				if (!response.ok) {
					throw new Error('Failed to load markers');
				}

				markers = (await response.json()) as Marker[];
				console.log('markers fetched', markers.length, markers[0]);

				mapboxgl.accessToken = accessToken;
				map = new mapboxgl.Map({
					container: mapContainer!,
					style: 'mapbox://styles/mapbox/streets-v12',
					center: markers.length
						? [markers[0].lng, markers[0].lat]
						: [-73.9857, 40.7484],
					zoom: markers.length ? 8 : 6
				});

				map.addControl(new mapboxgl.NavigationControl(), 'top-right');

				map.on('load', () => {
					markers.forEach((marker) => {
						console.log('adding marker', marker.id, marker.lat, marker.lng);
						if (!map) return;

						const element = document.createElement('div');
						element.className = 'marker';
						element.dataset.category = marker.category;

						const species =
							getMetaString(marker, 'fish_species') ??
							getMetaString(marker, 'Fish Species Present at Waterbody');
						const location =
							getMetaString(marker, 'location') ?? getMetaString(marker, 'Location');

						const popupHtml = `
							<div class="popup">
								<h3>${marker.title}</h3>
								${marker.description ? `<p>${marker.description}</p>` : ''}
								${species ? `<p><strong>Fish:</strong> ${species}</p>` : ''}
								${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
								<p class="badge" data-category="${marker.category}">${marker.category}</p>
							</div>
						`;

						new mapboxgl.Marker({ element })
							.setLngLat([marker.lng, marker.lat])
							.setPopup(new mapboxgl.Popup({ offset: 18 }).setHTML(popupHtml))
							.addTo(map);
					});
				});
			} catch (e) {
				console.error('Error initialising map:', e);
				if (!cancelled) {
					error = 'Failed to load the map. Please try again later.';
				}
			} finally {
				if (!cancelled) {
					loading = false;
				}
			}
		})();

		return () => {
			cancelled = true;
			if (map) {
				map.remove();
				map = null;
			}
		};
	});
</script>

<svelte:head>
	<title>Map View</title>
</svelte:head>

<div class="map-container">
	{#if loading}
		<div class="loading">Loading map...</div>
	{:else if error}
		<div class="error">{error}</div>
	{/if}
	<div bind:this={mapContainer} class="map" aria-label="Interactive city map"></div>
</div>

<style>
	:global(html, body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
	}

	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	:global(#svelte) {
		height: 100%;
	}

	.map-container {
		position: relative;
		width: 100%;
		height: 100vh;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	.loading,
	.error {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		background: white;
		padding: 10px 20px;
		border-radius: 4px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.error {
		background: #ffebee;
		color: #c62828;
	}

	:global(.marker) {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	:global(.marker:hover) {
		transform: scale(1.15);
	}

	:global(.marker[data-category='lake']) {
		background: #1e88e5;
	}

	:global(.marker[data-category='river']) {
		background: #43a047;
	}

	:global(.marker[data-category='parking']) {
		background: #f4511e;
	}

	:global(.mapboxgl-popup-content) {
		padding: 16px;
		border-radius: 6px;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
		max-width: 240px;
	}

	:global(.mapboxgl-popup-content h3) {
		margin: 0 0 8px;
		font-size: 16px;
		color: #1a1a1a;
	}

	:global(.mapboxgl-popup-content p) {
		margin: 0 0 6px;
		font-size: 13px;
		color: #425466;
	}

	.badge {
		display: inline-block;
		padding: 4px 8px;
		border-radius: 999px;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
		color: #fff;
	}

	.badge[data-category='lake'] {
		background: #1e88e5;
	}

	.badge[data-category='river'] {
		background: #43a047;
	}

	.badge[data-category='parking'] {
		background: #f4511e;
	}
</style>
