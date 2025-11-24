<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { LocationDetails } from '$lib/types/location';

	// Species preferences
	const speciesOptions = [
		'Bonefish',
		'Chinook Salmon',
		'Coho Salmon',
		'Lake Trout',
		'Lingcod',
		'Permit',
		'Snook',
		'Steelhead',
		'Tarpon',
		'Walleye'
	];
	export let selectedSpecies: string[] = ['Chinook Salmon', 'Coho Salmon', 'Lake Trout'];

	// Crowd preferences
	type CrowdPreference = 'Quiet' | 'Moderate' | 'Busy';
	const crowdOptions: CrowdPreference[] = ['Quiet', 'Moderate', 'Busy'];
	export let crowdPreference: CrowdPreference = 'Moderate';

	// Weather preferences
	type WeatherPreference = 'Sunny' | 'Cloudy' | 'Rainy' | 'Any Weather';
	const weatherOptions: WeatherPreference[] = ['Sunny', 'Cloudy', 'Rainy', 'Any Weather'];
	export let weatherPreferences: WeatherPreference[] = ['Any Weather'];

	// Favorite locations
	type FavoriteLocation = { name: string; saved: boolean };
	export let favoriteLocations: FavoriteLocation[] = [
		{ name: 'Lake Superior – Duluth Harbor', saved: true },
		{ name: 'Florida Keys – Islamorada Flats', saved: true },
		{ name: 'Columbia River – Astoria Jetty', saved: false }
	];

	// Active location
	export let activeLocation: LocationDetails = {
		name: 'Lake Superior – Duluth Harbor',
		subtitle: 'Duluth, Minnesota',
		address: '350 Harbor Dr, Duluth, MN 55802',
		species: ['Lake Trout', 'Chinook Salmon', 'Coho Salmon', 'Walleye'],
		details: [
			{ label: 'Crowd level', value: 'Moderate' },
			{ label: 'Water body', value: 'Lake' }
		],
		conditions: [
			{ label: 'Conditions', value: 'Clear sky' },
			{ label: 'Temperature', value: '7°C' },
			{ label: 'Wind speed', value: '12 km/h' }
		]
	};

	const dispatch = createEventDispatcher();

	// Species actions
	const toggleSpecies = (value: string) => {
		selectedSpecies = selectedSpecies.includes(value)
			? selectedSpecies.filter((item) => item !== value)
			: [...selectedSpecies, value];
		dispatch('speciesChange', selectedSpecies);
	};

	// Crowd actions
	const setCrowdPreference = (value: CrowdPreference) => {
		crowdPreference = value;
		dispatch('crowdChange', crowdPreference);
	};

	// Weather actions
	const toggleWeatherPreference = (value: WeatherPreference) => {
		const isActive = weatherPreferences.includes(value);
		if (value === 'Any Weather') {
			weatherPreferences = isActive ? [] : ['Any Weather'];
			dispatch('weatherChange', weatherPreferences);
			return;
		}
		const filtered = weatherPreferences.filter((item) => item !== 'Any Weather');
		weatherPreferences = isActive
			? filtered.filter((item) => item !== value)
			: [...filtered, value];
		dispatch('weatherChange', weatherPreferences);
	};

	// Location actions
	const toggleFavoriteLocation = (index: number) => {
		favoriteLocations = favoriteLocations.map((location, i) =>
			i === index ? { ...location, saved: !location.saved } : location
		);
		dispatch('favoriteChange', favoriteLocations);
	};

	const setActiveLocation = (location: LocationDetails) => {
		activeLocation = location;
		dispatch('locationChange', activeLocation);
	};

	export { toggleSpecies, setCrowdPreference, toggleWeatherPreference, toggleFavoriteLocation, setActiveLocation, speciesOptions, crowdOptions, weatherOptions };
</script>
