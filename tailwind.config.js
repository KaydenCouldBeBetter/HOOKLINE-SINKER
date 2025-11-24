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
				// Catppuccin Mocha colors
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
				},
				// Custom accent colors from design guide
				mauve: '#DDB6F2',
				peach: '#F5C2E7',
				latte: '#F4DBD6',
				green: '#ABE9B3',
				sky: '#89DCEB',
				sapphire: '#74C7EC'
			}
		}
	},
	plugins: []
};
