<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import {
		THEME_DEFAULT,
		THEME_OPTIONS,
		THEME_STORAGE_KEY,
		type ThemePreference
	} from '$lib/config/theme';

	export let theme: ThemePreference = THEME_DEFAULT;
	export let resolvedTheme: 'light' | 'dark' = 'dark';
	
	let mediaQuery: MediaQueryList | null = null;
	const themeOrder: ThemePreference[] = THEME_OPTIONS.map((option) => option.value);
	let localTheme = theme;
	let localResolvedTheme = resolvedTheme;

	const dispatch = createEventDispatcher();

	const getEffectiveTheme = (preference: ThemePreference): 'light' | 'dark' => {
		if (preference === 'system') {
			return mediaQuery?.matches ? 'dark' : 'light';
		}
		return preference;
	};

	const applyTheme = (preference: ThemePreference) => {
		localTheme = preference;
		try {
			localStorage.setItem(THEME_STORAGE_KEY, preference);
		} catch (error) {
			console.debug('Unable to persist theme preference', error);
		}
		localResolvedTheme = getEffectiveTheme(preference);
		document.documentElement.dataset.theme = localResolvedTheme;
		theme = localTheme;
		resolvedTheme = localResolvedTheme;
		dispatch('themeChange', { theme: localTheme, resolvedTheme: localResolvedTheme });
	};

	const handleSystemThemeChange = (event: MediaQueryListEvent) => {
		if (localTheme === 'system') {
			localResolvedTheme = event.matches ? 'dark' : 'light';
			document.documentElement.dataset.theme = localResolvedTheme;
			resolvedTheme = localResolvedTheme;
			dispatch('themeChange', { theme: localTheme, resolvedTheme: localResolvedTheme });
		}
	};

	const handleThemeSelect = (preference: ThemePreference) => {
		if (preference === localTheme) return;
		applyTheme(preference);
	};

	const cycleThemePreference = () => {
		const currentIndex = themeOrder.indexOf(localTheme);
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeOrder.length;
		applyTheme(themeOrder[nextIndex]);
	};

	onMount(() => {
		try {
			const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
			if (stored && ['system', 'light', 'dark'].includes(stored)) {
				localTheme = stored;
			}
		} catch (error) {
			console.debug('Unable to read theme preference', error);
		}

		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleSystemThemeChange);
		applyTheme(localTheme);

		return () => {
			mediaQuery?.removeEventListener('change', handleSystemThemeChange);
		};
	});

	$: activeThemeOption = THEME_OPTIONS.find((option) => option.value === localTheme) ?? THEME_OPTIONS[0];
	$: themeSummary = localTheme === 'system'
		? `${activeThemeOption.label} · ${localResolvedTheme.charAt(0).toUpperCase()}${localResolvedTheme.slice(1)}`
		: `${activeThemeOption.label} mode`;

	export { handleThemeSelect, cycleThemePreference };
</script>
