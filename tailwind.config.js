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
				// Midnight Standard - Universal Dark Glass Palette
				midnight: {
					// Core Surfaces
					glass: '#1e1e2e', // Base - Main background
					glassOpacity: 'rgba(30, 30, 46, 0.9)', // Base + 90% Opacity for glass effect
					
					// Typography (High Contrast)
					textPrimary: '#cdd6f4', // Text Base - Primary content
					textSecondary: '#a6adc8', // Subtext - Secondary content
					textMuted: '#6c7086', // Muted text - Tertiary content
					
					// Functional Colors (Semantic)
					primary: '#cba6f7', // Mauve - Main actions, active states
					selection: '#f5c2e7', // Pink - Selected items, toggles
					water: '#89dceb', // Sky - Water elements, GPS
					warning: '#fab387', // Peach - Warnings, alerts
					
					// Surface Colors
					surfaceDark: '#313244', // Surface0 - Inputs, search bars
					surfaceLight: '#45475a', // Surface1 - Hover states
					
					// Border & Subtle Elements
					border: 'rgba(255, 255, 255, 0.1)', // Subtle borders
					shadow: 'rgba(0, 0, 0, 0.5)', // Deep shadows for depth
				}
			}
		}
	},
	plugins: []
};
