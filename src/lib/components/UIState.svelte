<script lang="ts">
	export let isPreferencesOpen = true;
	export let isHelpOpen = true;
	export let isLocationPanelOpen = true;

	const togglePreferences = () => {
		isPreferencesOpen = !isPreferencesOpen;
	};

	const toggleHelp = () => {
		isHelpOpen = !isHelpOpen;
	};

	const toggleLocation = () => {
		isLocationPanelOpen = !isLocationPanelOpen;
	};

	const closeAll = () => {
		isPreferencesOpen = false;
		isHelpOpen = false;
		isLocationPanelOpen = false;
	};

	export { togglePreferences, toggleHelp, toggleLocation, closeAll };
</script>
