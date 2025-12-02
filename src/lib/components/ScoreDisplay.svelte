<script lang="ts">
	interface Props {
		label: string;
		score: number;
		showNumber?: boolean;
		size?: 'small' | 'medium' | 'large';
	}

	let { label, score, showNumber = true, size = 'medium' }: Props = $props();

	// Clamp score between 0-100 (reactive)
	const clampedScore = $derived(Math.min(100, Math.max(0, score)));

	// Calculate color based on score (red to green) (reactive)
	const hue = $derived((clampedScore / 100) * 120); // 0 = red, 120 = green
	const color = $derived(`hsl(${hue}, 80%, 50%)`);

	// Size classes
	const sizeClasses = {
		small: 'h-1.5',
		medium: 'h-2.5',
		large: 'h-4'
	};

	const textSizeClasses = {
		small: 'text-xs',
		medium: 'text-sm',
		large: 'text-base'
	};
</script>

<div class="score-display">
	<div class="flex items-center justify-between mb-1.5">
		<span class="text-gray-300 {textSizeClasses[size]} font-medium">{label}</span>
		{#if showNumber}
			<span class="font-bold {textSizeClasses[size]}" style="color: {color}">
				{Math.round(clampedScore)}
			</span>
		{/if}
	</div>
	<div class="w-full bg-gray-700/50 rounded-full overflow-hidden {sizeClasses[size]}">
		<div
			class="h-full rounded-full transition-all duration-500 ease-out"
			style="width: {clampedScore}%; background-color: {color}"
		></div>
	</div>
</div>

<style>
	.score-display {
		width: 100%;
	}
</style>
