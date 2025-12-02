<script lang="ts">
	import type { LocationRecommendation, Location } from '$lib/shared/types';
	import ScoreDisplay from './ScoreDisplay.svelte';

	interface Props {
		location: LocationRecommendation | null;
		isOpen: boolean;
		onClose: () => void;
		isMobile?: boolean;
	}

	let { location, isOpen, onClose, isMobile = false }: Props = $props();

	// Helper to get full location data
	const fullLocation = $derived(location?.location as Location | undefined);

	// Calculate overall score color
	const getScoreColor = (score: number) => {
		const hue = (score / 100) * 120;
		return `hsl(${hue}, 80%, 50%)`;
	};

	// Format tide info
	const formatTideTime = (time: string) => {
		return new Date(time).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
	};

	// Get current weather (first day, current hour or closest)
	const getCurrentWeather = () => {
		if (!location?.weather?.forecast?.[0]) return null;
		const now = new Date().getHours();
		const today = location.weather.forecast[0];
		const currentHour = today.hourly.find((h: any) => new Date(h.time).getHours() === now);
		return currentHour || today.hourly[0];
	};

	// Get today's tides
	const getTodayTides = () => {
		return location?.weather?.forecast?.[0]?.tides || [];
	};

	// Moon phase emoji
	const getMoonEmoji = (phase: string) => {
		const phases: Record<string, string> = {
			'New Moon': '🌑',
			'Waxing Crescent': '🌒',
			'First Quarter': '🌓',
			'Waxing Gibbous': '🌔',
			'Full Moon': '🌕',
			'Waning Gibbous': '🌖',
			'Last Quarter': '🌗',
			'Waning Crescent': '🌘'
		};
		return phases[phase] || '🌙';
	};
</script>

{#if isOpen && location}
	<!-- Overlay for mobile -->
	{#if isMobile}
		<div
			class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
			onclick={onClose}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Escape' && onClose()}
		></div>
	{/if}

	<!-- Side Panel -->
	<div
		class="location-side-panel {isMobile ? 'mobile' : 'desktop'}"
		class:open={isOpen}
		role="dialog"
		aria-modal="true"
	>
		<!-- Header -->
		<div class="panel-header">
			<div class="flex-1">
				<h2 class="text-xl font-bold text-white mb-1 line-clamp-2">{location.locationName}</h2>
				<p class="text-sm text-gray-400">
					{location.distance?.toFixed(1) || '0.0'} miles away
				</p>
			</div>
			<button
				onclick={onClose}
				class="close-button"
				aria-label="Close panel"
			>
				<svg
					class="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<!-- Scrollable Content -->
		<div class="panel-content">
			<!-- Overall Score -->
			<section class="panel-section">
				<div class="flex items-center justify-between mb-4">
					<h3 class="section-title">Fishing Score</h3>
					<div
						class="score-badge"
						style="background: linear-gradient(135deg, {getScoreColor(
							location.score
						)} 0%, {getScoreColor(location.score - 10)} 100%)"
					>
						{Math.round(location.score)}
					</div>
				</div>

				<!-- Score Breakdown -->
				<div class="space-y-3">
					<ScoreDisplay
						label="Weather Comfort"
						score={location.breakdown.weatherComfort}
						size="medium"
					/>
					<ScoreDisplay
						label="Fish Activity"
						score={location.breakdown.fishActivity}
						size="medium"
					/>
					<ScoreDisplay
						label="Water Conditions"
						score={location.breakdown.waterConditions}
						size="medium"
					/>
				</div>
			</section>

			<!-- Weather Details -->
			{#if location.weather?.forecast?.[0]}
				{@const today = location.weather.forecast[0]}
				{@const current = getCurrentWeather()}
				{@const tides = getTodayTides()}

				<section class="panel-section">
					<h3 class="section-title">Weather & Conditions</h3>

					<!-- Current Conditions -->
					{#if current}
						<div class="info-grid">
							<div class="info-item">
								<span class="info-icon">🌡️</span>
								<div>
									<div class="info-label">Temperature</div>
									<div class="info-value">{current.temp}°C</div>
								</div>
							</div>
							<div class="info-item">
								<span class="info-icon">🌊</span>
								<div>
									<div class="info-label">Water Temp</div>
									<div class="info-value">{current.waterTemp}°C</div>
								</div>
							</div>
							<div class="info-item">
								<span class="info-icon">💨</span>
								<div>
									<div class="info-label">Wind</div>
									<div class="info-value">{current.windSpeed} km/h {current.windDir}</div>
								</div>
							</div>
							<div class="info-item">
								<span class="info-icon">🌊</span>
								<div>
									<div class="info-label">Wave Height</div>
									<div class="info-value">{current.waveHeight}m</div>
								</div>
							</div>
							<div class="info-item">
								<span class="info-icon">🌀</span>
								<div>
									<div class="info-label">Swell Height</div>
									<div class="info-value">{current.swellHeight}m</div>
								</div>
							</div>
							<div class="info-item">
								<span class="info-icon">👁️</span>
								<div>
									<div class="info-label">Visibility</div>
									<div class="info-value">{current.visibility} km</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Moon Phase -->
					<div class="moon-phase">
						<span class="text-3xl">{getMoonEmoji(today.moonPhase)}</span>
						<div>
							<div class="info-label">Moon Phase</div>
							<div class="info-value">{today.moonPhase}</div>
							<div class="text-xs text-gray-400">{today.moonIllumination}% illumination</div>
						</div>
					</div>

					<!-- Tides -->
					{#if tides.length > 0}
						<div class="tides-section">
							<h4 class="text-sm font-semibold text-gray-300 mb-2">Today's Tides</h4>
							<div class="tide-list">
								{#each tides as tide}
									<div class="tide-item">
										<span class="tide-icon">{tide.tide_type === 'HIGH' ? '⬆️' : '⬇️'}</span>
										<div class="flex-1">
											<div class="text-xs text-gray-400">{tide.tide_type}</div>
											<div class="text-sm font-medium text-white">
												{formatTideTime(tide.tide_time)}
											</div>
										</div>
										<div class="text-sm text-gray-300">{tide.tide_height_mt}m</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Sun Times -->
					<div class="sun-times">
						<div class="sun-time-item">
							<span class="text-xl">🌅</span>
							<div>
								<div class="info-label">Sunrise</div>
								<div class="info-value">{today.sunrise}</div>
							</div>
						</div>
						<div class="sun-time-item">
							<span class="text-xl">🌇</span>
							<div>
								<div class="info-label">Sunset</div>
								<div class="info-value">{today.sunset}</div>
							</div>
						</div>
					</div>
				</section>
			{/if}

			<!-- Location Facilities -->
			<section class="panel-section">
				<h3 class="section-title">Location Details</h3>

				{#if fullLocation?.description}
					<p class="text-sm text-gray-300 mb-4">{fullLocation.description}</p>
				{/if}

				<div class="facility-grid">
					{#if fullLocation?.water_body_name}
						<div class="facility-item">
							<span class="facility-icon">🏞️</span>
							<span>{fullLocation.water_body_name}</span>
						</div>
					{/if}
					{#if fullLocation?.location_type}
						<div class="facility-item">
							<span class="facility-icon">📍</span>
							<span>{fullLocation.location_type}</span>
						</div>
					{/if}
					{#if fullLocation?.parking_available}
						<div class="facility-item">
							<span class="facility-icon">🅿️</span>
							<span>Parking Available</span>
						</div>
					{/if}
					{#if fullLocation?.boat_ramp}
						<div class="facility-item">
							<span class="facility-icon">⛵</span>
							<span>Boat Ramp</span>
						</div>
					{/if}
					{#if fullLocation?.shore_fishing}
						<div class="facility-item">
							<span class="facility-icon">🎣</span>
							<span>Shore Fishing</span>
						</div>
					{/if}
					{#if fullLocation?.water_depth}
						<div class="facility-item">
							<span class="facility-icon">📏</span>
							<span>Depth: {fullLocation.water_depth}</span>
						</div>
					{/if}
					{#if fullLocation?.structure_type}
						<div class="facility-item">
							<span class="facility-icon">🏗️</span>
							<span>{fullLocation.structure_type}</span>
						</div>
					{/if}
					{#if fullLocation?.bottom_type}
						<div class="facility-item">
							<span class="facility-icon">🪨</span>
							<span>{fullLocation.bottom_type}</span>
						</div>
					{/if}
					{#if fullLocation?.access_type}
						<div class="facility-item">
							<span class="facility-icon">🚶</span>
							<span>{fullLocation.access_type}</span>
						</div>
					{/if}
				</div>
			</section>

			<!-- Fish Species (placeholder - would need to fetch species data) -->
			<section class="panel-section">
				<h3 class="section-title">Fish Species</h3>
				<div class="species-tags">
					<!-- This would need actual species data from API -->
					<span class="species-tag">Species data coming soon</span>
				</div>
			</section>
		</div>
	</div>
{/if}

<style>
	.location-side-panel {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(20px);
		border-left: 1px solid rgba(148, 163, 184, 0.1);
		box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
		z-index: 50;
		display: flex;
		flex-direction: column;
		transform: translateX(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.location-side-panel.desktop {
		width: 420px;
		max-width: 90vw;
	}

	.location-side-panel.mobile {
		width: 100%;
		max-width: 100vw;
	}

	.location-side-panel.open {
		transform: translateX(0);
	}

	.panel-header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem;
		border-bottom: 1px solid rgba(148, 163, 184, 0.1);
		background: rgba(15, 23, 42, 0.6);
	}

	.close-button {
		flex-shrink: 0;
		padding: 0.5rem;
		color: #94a3b8;
		background: rgba(51, 65, 85, 0.5);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.close-button:hover {
		color: white;
		background: rgba(51, 65, 85, 0.8);
	}

	.panel-content {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.panel-section {
		background: rgba(30, 41, 59, 0.6);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(148, 163, 184, 0.1);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1rem;
		font-weight: 600;
		color: white;
		margin-bottom: 1rem;
	}

	.score-badge {
		font-size: 2rem;
		font-weight: bold;
		color: white;
		padding: 0.5rem 1.25rem;
		border-radius: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: rgba(51, 65, 85, 0.4);
		border-radius: 0.5rem;
	}

	.info-icon {
		font-size: 1.5rem;
	}

	.info-label {
		font-size: 0.75rem;
		color: #94a3b8;
	}

	.info-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
	}

	.moon-phase {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(51, 65, 85, 0.4);
		border-radius: 0.75rem;
		margin-bottom: 1rem;
	}

	.tides-section {
		margin-top: 1rem;
	}

	.tide-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tide-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: rgba(51, 65, 85, 0.4);
		border-radius: 0.5rem;
	}

	.tide-icon {
		font-size: 1.25rem;
	}

	.sun-times {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 1rem;
	}

	.sun-time-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: rgba(51, 65, 85, 0.4);
		border-radius: 0.5rem;
	}

	.facility-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.facility-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem;
		background: rgba(51, 65, 85, 0.4);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: #e2e8f0;
	}

	.facility-icon {
		font-size: 1.125rem;
	}

	.species-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.species-tag {
		padding: 0.5rem 1rem;
		background: rgba(59, 130, 246, 0.2);
		border: 1px solid rgba(59, 130, 246, 0.4);
		border-radius: 9999px;
		font-size: 0.875rem;
		color: #93c5fd;
	}

	/* Scrollbar styling */
	.panel-content::-webkit-scrollbar {
		width: 8px;
	}

	.panel-content::-webkit-scrollbar-track {
		background: rgba(51, 65, 85, 0.3);
		border-radius: 4px;
	}

	.panel-content::-webkit-scrollbar-thumb {
		background: rgba(148, 163, 184, 0.5);
		border-radius: 4px;
	}

	.panel-content::-webkit-scrollbar-thumb:hover {
		background: rgba(148, 163, 184, 0.7);
	}
</style>
