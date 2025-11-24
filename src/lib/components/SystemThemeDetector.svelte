<script lang="ts">
	import { onMount } from 'svelte';
	import type { ThemePreference } from '$lib/config/theme';

	export let onSystemThemeChange: (resolvedTheme: 'light' | 'dark') => void = () => {};
	export let preference: ThemePreference = 'system';
	
	let mediaQuery: MediaQueryList | null = null;

	const handleSystemThemeChange = (event: MediaQueryListEvent) => {
		const resolvedTheme = event.matches ? 'dark' : 'light';
		onSystemThemeChange(resolvedTheme);
	};

	onMount(() => {
		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleSystemThemeChange);

		return () => {
			mediaQuery?.removeEventListener('change', handleSystemThemeChange);
		};
	});
</script>
