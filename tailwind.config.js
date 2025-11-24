/** @type {import('tailwindcss').Config} */
module.exports = {
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
			}
		}
	},
	plugins: [
		require('@catppuccin/tailwindcss')({
			prefix: 'ctp',
			defaultFlavour: 'mocha',
			customColors: {
				mauve: '#DDB6F2',
				peach: '#F5C2E7',
				latte: '#F4DBD6',
				green: '#ABE9B3',
				sky: '#89DCEB',
				sapphire: '#74C7EC'
			}
		})
	]
};
