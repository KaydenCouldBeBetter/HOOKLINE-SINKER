import type { ControlPosition, LngLatLike, MapboxOptions } from 'mapbox-gl';

export type MapStyle = 'midnight-water' | 'glare-cut' | 'satellite';

export const MAP_STYLES: Record<MapStyle, { url: string; name: string; description: string }> = {
	'midnight-water': { 
		url: 'mapbox://styles/mapbox/dark-v11', 
		name: 'Midnight Water', 
		description: 'Tron-style cyberpunk sonar with neon bathymetry' 
	},
	'glare-cut': { 
		url: 'mapbox://styles/mapbox/light-v11', 
		name: 'Glare Cut', 
		description: 'High contrast marine chart for daytime use' 
	},
	satellite: { 
		url: 'mapbox://styles/mapbox/satellite-v9', 
		name: 'Satellite', 
		description: 'Satellite imagery' 
	}
};

export const MAP_STYLE_GLARE_CUT = MAP_STYLES['glare-cut'].url;
export const MAP_STYLE_MIDNIGHT_WATER = MAP_STYLES['midnight-water'].url;

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
