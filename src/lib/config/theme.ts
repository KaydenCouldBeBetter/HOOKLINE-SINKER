export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'hookline-theme';
export const THEME_DEFAULT: ThemePreference = 'system';

export const THEME_OPTIONS: Array<{
	value: ThemePreference;
	label: string;
	description: string;
	icon: string;
}> = [
	{
		value: 'system',
		label: 'System',
		description: 'Follow your device preference',
		icon: '🖥️'
	},
	{
		value: 'light',
		label: 'Light',
		description: 'Bright background, dark text',
		icon: '☀️'
	},
	{
		value: 'dark',
		label: 'Dark',
		description: 'Dim background, light text',
		icon: '🌙'
	}
];
