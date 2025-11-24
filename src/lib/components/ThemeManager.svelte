<script lang="ts">
	import { onMount } from 'svelte';
	import { THEME_OPTIONS, THEME_STORAGE_KEY, type ThemePreference } from '$lib/config/theme';

	export let theme: ThemePreference = 'system';
	export let resolvedTheme: 'light' | 'dark' = 'dark';

	let mediaQuery: MediaQueryList | null = null;

	const resolveTheme = (pref: ThemePreference): 'light' | 'dark' => {
		if (pref === 'system') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return pref as 'light' | 'dark';
	};

	const applyTheme = () => {
		const html = document.documentElement;
		
		// Remove existing theme classes
		html.classList.remove('dark', 'light');
		
		// Add current theme class
		if (resolvedTheme === 'dark') {
			html.classList.add('dark');
		} else {
			html.classList.add('light');
		}
		
		// Also set data-theme for CSS variables
		html.dataset.theme = resolvedTheme;
	};

	const savePreference = (pref: ThemePreference) => {
		try {
			localStorage.setItem(THEME_STORAGE_KEY, pref);
		} catch (error) {
			console.debug('Unable to persist theme preference', error);
		}
	};

	const loadPreference = () => {
		try {
			const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
			if (stored && ['system', 'light', 'dark'].includes(stored)) {
				theme = stored;
			}
		} catch (error) {
			console.debug('Unable to read theme preference', error);
		}
	};

	const handleThemeSelect = (preference: ThemePreference) => {
		if (preference === theme) return;
		theme = preference;
		savePreference(preference);
		applyTheme();
	};

	const cycleThemePreference = () => {
		const currentIndex = THEME_OPTIONS.findIndex(option => option.value === theme);
		const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
		const newTheme = THEME_OPTIONS[nextIndex].value;
		theme = newTheme;
		savePreference(newTheme);
		applyTheme();
	};

	const handleSystemThemeChange = (event: MediaQueryListEvent) => {
		if (theme === 'system') {
			applyTheme();
		}
	};

	onMount(() => {
		loadPreference();
		applyTheme();
		
		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleSystemThemeChange);

		return () => {
			mediaQuery?.removeEventListener('change', handleSystemThemeChange);
		};
	});

	// Apply theme whenever preference changes
	$: if (theme) {
		applyTheme();
	}

	$: activeThemeOption = THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0];
	$: themeSummary = theme === 'system'
		? `${activeThemeOption.label} · ${resolvedTheme.charAt(0).toUpperCase()}${resolvedTheme.slice(1)}`
		: `${activeThemeOption.label} mode`;
</script>
