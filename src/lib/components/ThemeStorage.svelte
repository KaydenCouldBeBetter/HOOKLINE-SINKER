<script lang="ts">
	import { onMount } from 'svelte';
	import { THEME_STORAGE_KEY, type ThemePreference } from '$lib/config/theme';

	export let preference: ThemePreference = 'system';

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
				preference = stored;
			}
		} catch (error) {
			console.debug('Unable to read theme preference', error);
		}
	};

	// Load on mount
	onMount(() => {
		loadPreference();
	});

	// Save whenever preference changes
	$: if (preference) {
		savePreference(preference);
	}
</script>
