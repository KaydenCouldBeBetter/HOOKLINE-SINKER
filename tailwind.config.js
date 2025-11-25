/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif']
			},
			zIndex: {
				'800': '800',
				'850': '850',
				'900': '900',
				'1000': '1000',
				'1050': '1050'
			},
			colors: {
				// Midnight Standard - Universal Dark Glass Palette (Catppuccin Mocha)
				midnight: {
					// The "Midnight Glass" Surface
					glass: '#1e1e2e', // Catppuccin Base
					glassOpacity: 'rgba(30, 30, 46, 0.7)', // Base + 70% Opacity (updated for transparency)
					
					// Typography (High Contrast)
					textPrimary: '#cdd6f4', // Text Base - Off White
					textSecondary: '#a6adc8', // Subtext - Soft Grey
					
					// Functional Colors (Permanent)
					primary: '#cba6f7', // Mauve - Main Buttons, Active Tabs
					selection: '#f5c2e7', // Pink - Selected Chips, Toggles
					water: '#89dceb', // Sky - GPS Dot, Water Depth
					warning: '#fab387', // Peach - Low Battery, Weather Alert
					
					// Surface Colors
					surfaceDark: '#313244', // Surface0 - Search bars, inputs
					surfaceLight: '#45475a', // Surface1 - Hover states
					
					// Border & Subtle Elements
					border: 'rgba(255, 255, 255, 0.1)', // Subtle 1px rim
					shadow: 'rgba(0, 0, 0, 0.5)', // Deep shadow for lift
				},
				// Legacy Catppuccin for reference (deprecated in v3.0)
				ctp: {
					// Base colors
					rosewater: '#f5e0dc',
					flamingo: '#f2cdcd',
					pink: '#f5c2e7',
					mauve: '#cba6f7',
					red: '#f38ba8',
					maroon: '#eba0ac',
					peach: '#fab387',
					yellow: '#f9e2af',
					green: '#a6e3a1',
					teal: '#94e2d5',
					sky: '#89dceb',
					sapphire: '#74c7ec',
					blue: '#89b4fa',
					cyan: '#89dceb',
					lavender: '#b4befe',
					
					// Surface colors
					text: '#cdd6f4',
					subtext1: '#bac2de',
					subtext0: '#a6adc8',
					overlay2: '#9399b2',
					overlay1: '#7f849c',
					overlay0: '#6c7086',
					surface2: '#585b70',
					surface1: '#45475a',
					surface0: '#313244',
					base: '#1e1e2e',
					mantle: '#181825',
					crust: '#11111b'
				}
			}
		}
	},
	plugins: []
};
