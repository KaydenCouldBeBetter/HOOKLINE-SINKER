<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Species preferences
	const speciesOptions = [
		'Bass',
		'Walleye', 
		'Pike',
		'Trout'
	];
	export let selectedSpecies: string[] = [];

	const dispatch = createEventDispatcher();

	// Species actions
	const toggleSpecies = (value: string) => {
		selectedSpecies = selectedSpecies.includes(value)
			? selectedSpecies.filter((item) => item !== value)
			: [...selectedSpecies, value];
		dispatch('speciesChange', selectedSpecies);
	};

	export { toggleSpecies, speciesOptions };
</script>
