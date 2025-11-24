<script lang="ts">
	import type { ThemePreference } from '$lib/config/theme';

	export let preference: ThemePreference = 'system';
	export let resolvedTheme: 'light' | 'dark' = 'dark';

	const resolveTheme = (pref: ThemePreference): 'light' | 'dark' => {
		if (pref === 'system') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return pref as 'light' | 'dark';
	};

	// Apply theme whenever preference changes
	$: resolvedTheme = resolveTheme(preference);
	$: document.documentElement.dataset.theme = resolvedTheme;
</script>
