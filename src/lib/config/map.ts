import type { LngLatLike, MapboxOptions } from 'mapbox-gl';

export type ControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type MapStyle = 'structure' | 'marine' | 'satellite';

export type MapStyleInfo = {
  url: string;
  name: string;
  description: string;
  icon: string;
};

export const MAP_STYLES: Record<MapStyle, MapStyleInfo> = {
  'structure': { 
    url: 'mapbox://styles/mapbox/dark-v11', 
    name: 'Structure', 
    description: 'Structure visualization and low-light eye protection',
    icon: '🌃'
  },
  'marine': { 
    url: 'mapbox://styles/mapbox/light-v11', 
    name: 'Marine', 
    description: 'Maximum visibility in direct sunlight',
    icon: '🌊'
  },
  'satellite': { 
    url: 'mapbox://styles/mapbox/satellite-v9', 
    name: 'Satellite', 
    description: 'Visual landmark navigation',
    icon: '🛰️'
  }
};

export const MAP_CENTER: LngLatLike = [-73.9857, 40.7484];
export const MAP_STYLE_STRUCTURE = MAP_STYLES['structure'].url;
export const MAP_STYLE_MARINE = MAP_STYLES['marine'].url;
export const MAP_STYLE_SATELLITE = MAP_STYLES['satellite'].url;
export const MAP_ZOOM = 11;

export const MAP_OPTIONS = {
	center: MAP_CENTER,
	zoom: MAP_ZOOM,
	// Disable default Mapbox controls to use custom UI
	attributionControl: false,
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
