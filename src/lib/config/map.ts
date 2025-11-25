import type { LngLatLike, MapboxOptions } from 'mapbox-gl';

export type ControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type MapStyle = 'midnight-water' | 'glare-cut' | 'satellite' | 'nautical' | 'terrain' | 'streets' | 'navigation-day' | 'navigation-night';

export const MAP_STYLES: Record<MapStyle, { url: string; name: string; description: string; icon: string }> = {
	'midnight-water': { 
		url: 'mapbox://styles/mapbox/dark-v11', 
		name: 'Midnight Water', 
		description: 'Tron-style cyberpunk sonar with neon bathymetry',
		icon: '🌊'
	},
	'glare-cut': { 
		url: 'mapbox://styles/mapbox/light-v11', 
		name: 'Glare Cut', 
		description: 'High contrast marine chart for daytime use',
		icon: '☀️'
	},
	satellite: { 
		url: 'mapbox://styles/mapbox/satellite-v9', 
		name: 'Satellite', 
		description: 'Satellite imagery',
		icon: '🛰️'
	},
	'nautical': {
		url: 'mapbox://styles/mapbox/navigation-day-v1',
		name: 'Nautical',
		description: 'Navigation-focused map for maritime use',
		icon: '⚓'
	},
	'terrain': {
		url: 'mapbox://styles/mapbox/outdoors-v11',
		name: 'Terrain',
		description: 'Topographic map with elevation',
		icon: '⛰️'
	},
	'streets': {
		url: 'mapbox://styles/mapbox/streets-v11',
		name: 'Streets',
		description: 'Standard street map view',
		icon: '🏙️'
	},
	'navigation-day': {
		url: 'mapbox://styles/mapbox/navigation-day-v1',
		name: 'Navigation Day',
		description: 'Optimized for daytime navigation',
		icon: '🧭'
	},
	'navigation-night': {
		url: 'mapbox://styles/mapbox/navigation-night-v1',
		name: 'Navigation Night',
		description: 'Optimized for nighttime navigation',
		icon: '🌙'
	}
};

export const MAP_STYLE_GLARE_CUT = MAP_STYLES['glare-cut'].url;
export const MAP_STYLE_MIDNIGHT_WATER = MAP_STYLES['midnight-water'].url;

export const MAP_CENTER: LngLatLike = [-73.9857, 40.7484];
export const MAP_ZOOM = 11;

export const MAP_OPTIONS: MapboxOptions = {
	center: MAP_CENTER,
	zoom: MAP_ZOOM,
	// Disable default Mapbox controls to use custom UI
	attributionControl: false,
	navigationControl: false,
	scaleControl: false,
	// Custom interaction settings
	dragPan: true,
	dragRotate: true,
	scrollZoom: true,
	doubleClickZoom: true,
	keyboard: true,
	touchZoomRotate: true
};

export const NAVIGATION_CONTROL_POSITION: ControlPosition = 'top-right';

export const MAPBOX_TOKEN_ENV = 'PUBLIC_MAPBOX_ACCESS_TOKEN';

export const MISSING_TOKEN_MESSAGE = `Mapbox map cannot load because ${MAPBOX_TOKEN_ENV} is missing.`;
export const MISSING_TOKEN_HELP = {
	lead: 'Set the environment variable',
	trail: 'before running the app.'
};
