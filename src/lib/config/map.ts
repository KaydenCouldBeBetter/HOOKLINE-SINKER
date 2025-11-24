import type { ControlPosition, LngLatLike, MapboxOptions } from 'mapbox-gl';

export type MapStyle = 'streets' | 'dark' | 'light' | 'outdoors' | 'satellite' | 'satellite-streets';

export const MAP_STYLES: Record<MapStyle, { url: string; name: string; description: string }> = {
	streets: { 
		url: 'mapbox://styles/mapbox/streets-v12', 
		name: 'Streets', 
		description: 'Default street map' 
	},
	dark: { 
		url: 'mapbox://styles/mapbox/dark-v11', 
		name: 'Dark', 
		description: 'Dark theme streets' 
	},
	light: { 
		url: 'mapbox://styles/mapbox/light-v11', 
		name: 'Light', 
		description: 'Light theme streets' 
	},
	outdoors: { 
		url: 'mapbox://styles/mapbox/outdoors-v12', 
		name: 'Outdoors', 
		description: 'Terrain and hiking' 
	},
	satellite: { 
		url: 'mapbox://styles/mapbox/satellite-v9', 
		name: 'Satellite', 
		description: 'Satellite imagery' 
	},
	'satellite-streets': { 
		url: 'mapbox://styles/mapbox/satellite-streets-v12', 
		name: 'Satellite Streets', 
		description: 'Satellite with streets' 
	}
};

export const MAP_STYLE_LIGHT = MAP_STYLES.light.url;
export const MAP_STYLE_DARK = MAP_STYLES.dark.url;

export const MAP_CENTER: LngLatLike = [-73.9857, 40.7484];
export const MAP_ZOOM = 11;

export const MAP_OPTIONS: Pick<MapboxOptions, 'center' | 'zoom'> = {
	center: MAP_CENTER,
	zoom: MAP_ZOOM
};

export const NAVIGATION_CONTROL_POSITION: ControlPosition = 'top-right';

export const MAPBOX_TOKEN_ENV = 'PUBLIC_MAPBOX_ACCESS_TOKEN';

export const MISSING_TOKEN_MESSAGE = `Mapbox map cannot load because ${MAPBOX_TOKEN_ENV} is missing.`;
export const MISSING_TOKEN_HELP = {
	lead: 'Set the environment variable',
	trail: 'before running the app.'
};
