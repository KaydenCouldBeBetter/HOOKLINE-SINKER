import { writable } from 'svelte/store';

export interface InteractionState {
	isDragging: boolean;
	isSelecting: boolean;
	selectedFeatures: string[];
	hoveredFeature: string | null;
	activeTool: 'pan' | 'select' | 'measure' | 'draw';
}

export const interaction = writable<InteractionState>({
	isDragging: false,
	isSelecting: false,
	selectedFeatures: [],
	hoveredFeature: null,
	activeTool: 'pan'
});
