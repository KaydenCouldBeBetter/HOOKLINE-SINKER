import type { ControlPosition, LngLatLike, MapboxOptions } from 'mapbox-gl';

export const MAP_STYLE_LIGHT = 'mapbox://styles/mapbox/streets-v12';
export const MAP_STYLE_DARK = 'mapbox://styles/mapbox/dark-v11';
export const MAP_STYLES: Record<'light' | 'dark', string> = {
	light: MAP_STYLE_LIGHT,
	dark: MAP_STYLE_DARK
};

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
