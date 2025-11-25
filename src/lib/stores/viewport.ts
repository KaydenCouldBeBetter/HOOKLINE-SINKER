import { writable } from 'svelte/store';

export interface ViewportState {
	center: [number, number];
	zoom: number;
	bounds: [[number, number], [number, number]] | null;
}

export const viewport = writable<ViewportState>({
	center: [40.7128, -74.0060], // Default to NYC coordinates
	zoom: 10,
	bounds: null
});
