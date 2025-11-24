<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let isPreferencesOpen = true;
	export let isHelpOpen = true;
	export let isLocationPanelOpen = true;

	const dispatch = createEventDispatcher();

	const togglePreferences = () => {
		isPreferencesOpen = !isPreferencesOpen;
		if (isPreferencesOpen) {
			isHelpOpen = false;
		}
		dispatch('preferencesToggle', isPreferencesOpen);
	};

	const toggleHelp = () => {
		isHelpOpen = !isHelpOpen;
		if (isHelpOpen) {
			isPreferencesOpen = false;
		}
		dispatch('helpToggle', isHelpOpen);
	};

	const toggleLocationPanel = () => {
		isLocationPanelOpen = !isLocationPanelOpen;
		dispatch('locationToggle', isLocationPanelOpen);
	};

	const closePreferences = () => {
		isPreferencesOpen = false;
		dispatch('preferencesToggle', isPreferencesOpen);
	};

	const closeHelp = () => {
		isHelpOpen = false;
		dispatch('helpToggle', isHelpOpen);
	};

	const closeLocationPanel = () => {
		isLocationPanelOpen = false;
		dispatch('locationToggle', isLocationPanelOpen);
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closePreferences();
			closeHelp();
			return;
		}
	};

	const handleGlobalPointerDown = (event: PointerEvent) => {
		const target = event.target;
		if (!(target instanceof Node)) return;
		// This would need to be implemented based on the UI layer reference
		closePreferences();
		closeHelp();
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('pointerdown', handleGlobalPointerDown, true);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('pointerdown', handleGlobalPointerDown, true);
		};
	});

	export { togglePreferences, toggleHelp, toggleLocationPanel, closePreferences, closeHelp, closeLocationPanel };
</script>
