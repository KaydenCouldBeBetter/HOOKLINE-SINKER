<script lang="ts">
	import axios from 'axios';

	const API_BASE = 'http://localhost:3001/api';

	let results: { [key: string]: any } = {};
	let loading: { [key: string]: boolean } = {};
	let errors: { [key: string]: string } = {};

	async function testEndpoint(name: string, url: string, params?: any) {
		loading[name] = true;
		errors[name] = '';
		results[name] = null;

		try {
			console.log(`Testing ${name}...`);
			const response = await axios.get(url, { params });
			results[name] = response.data;
			console.log(`${name} Response:`);
			console.log(JSON.stringify(response.data, null, 2));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errors[name] = `${error.response?.status}: ${error.response?.data?.error || error.message}`;
				console.error(`${name} Error:`, error.response?.data || error.message);
			} else {
				errors[name] = 'Unexpected error';
				console.error(`${name} Error:`, error);
			}
		} finally {
			loading[name] = false;
		}
	}

	// Test functions for each endpoint
	async function testWeather() {
		await testEndpoint('Weather', `${API_BASE}/weather/location`, {
			latitude: 40.7128,
			longitude: -74.0060
		});
	}

	async function testWeatherRadius() {
		await testEndpoint('Weather Radius', `${API_BASE}/weather/radius`, {
			latitude: 40.7128,
			longitude: -74.0060,
			radius: 50
		});
	}

	async function testSpecies() {
		await testEndpoint('Species', `${API_BASE}/species`);
	}

	async function testLocations() {
		await testEndpoint('Locations', `${API_BASE}/locations`);
	}

	async function testImages() {
		await testEndpoint('Images', `${API_BASE}/images`);
	}

	async function testHealth() {
		await testEndpoint('Health', 'http://localhost:3001/health');
	}

	async function testAll() {
		console.clear();
		console.log('Testing all API endpoints...');
		await testHealth();
		await testWeather();
		await testSpecies();
		await testLocations();
		await testImages();
		console.log('All tests complete');
	}
</script>

<svelte:head>
	<title>API Test Suite</title>
</svelte:head>

<div class="container">
	<h1>API Test Suite</h1>
	<p class="subtitle">Test all API endpoints. Check the console for raw JSON responses.</p>

	<div class="controls">
		<button on:click={testAll} class="btn primary">Test All Endpoints</button>
	</div>

	<div class="endpoints">
		<div class="endpoint">
			<h2>Health Check</h2>
			<p>GET /health</p>
			<button on:click={testHealth} class="btn" disabled={loading['Health']}>
				{loading['Health'] ? 'Testing...' : 'Test'}
			</button>
			{#if errors['Health']}
				<div class="error">{errors['Health']}</div>
			{:else if results['Health']}
				<div class="success">Success</div>
			{/if}
		</div>

		<div class="endpoint">
			<h2>Weather API</h2>
			<p>GET /api/weather/location?latitude=40.7128&longitude=-74.0060</p>
			<button on:click={testWeather} class="btn" disabled={loading['Weather']}>
				{loading['Weather'] ? 'Testing...' : 'Test'}
			</button>
			{#if errors['Weather']}
				<div class="error">{errors['Weather']}</div>
			{:else if results['Weather']}
				<div class="success">Success - {results['Weather'].forecast?.length} days of forecast</div>
			{/if}
		</div>

		<div class="endpoint">
			<h2>Species API</h2>
			<p>GET /api/species</p>
			<button on:click={testSpecies} class="btn" disabled={loading['Species']}>
				{loading['Species'] ? 'Testing...' : 'Test'}
			</button>
			{#if errors['Species']}
				<div class="error">{errors['Species']}</div>
			{:else if results['Species']}
				<div class="success">
					Success - {Array.isArray(results['Species']) ? results['Species'].length : 0} species
				</div>
			{/if}
		</div>

		<div class="endpoint">
			<h2>Locations API</h2>
			<p>GET /api/locations</p>
			<button on:click={testLocations} class="btn" disabled={loading['Locations']}>
				{loading['Locations'] ? 'Testing...' : 'Test'}
			</button>
			{#if errors['Locations']}
				<div class="error">{errors['Locations']}</div>
			{:else if results['Locations']}
				<div class="success">
					Success - {Array.isArray(results['Locations']) ? results['Locations'].length : 0} locations
				</div>
			{/if}
		</div>

		<div class="endpoint">
			<h2>Images API</h2>
			<p>GET /api/images</p>
			<button on:click={testImages} class="btn" disabled={loading['Images']}>
				{loading['Images'] ? 'Testing...' : 'Test'}
			</button>
			{#if errors['Images']}
				<div class="error">{errors['Images']}</div>
			{:else if results['Images']}
				<div class="success">
					Success - {Array.isArray(results['Images']) ? results['Images'].length : 0} images
				</div>
			{/if}
		</div>
	</div>

	<div class="note">
		<strong>Note:</strong> Open the browser console (F12) to see the raw JSON responses from each
		endpoint.
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		font-size: 32px;
		margin-bottom: 8px;
		color: #1a1a1a;
	}

	.subtitle {
		color: #666;
		margin-bottom: 32px;
	}

	.controls {
		margin-bottom: 32px;
	}

	.endpoints {
		display: grid;
		gap: 24px;
		margin-bottom: 32px;
	}

	.endpoint {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 20px;
		background: #fff;
	}

	.endpoint h2 {
		font-size: 20px;
		margin: 0 0 8px 0;
		color: #1a1a1a;
	}

	.endpoint p {
		margin: 0 0 16px 0;
		color: #666;
		font-family: monospace;
		font-size: 14px;
		background: #f5f5f5;
		padding: 8px 12px;
		border-radius: 4px;
	}

	.btn {
		padding: 10px 20px;
		border: none;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		background: #f0f0f0;
		color: #333;
		transition: all 0.2s;
	}

	.btn:hover:not(:disabled) {
		background: #e0e0e0;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn.primary {
		background: #2563eb;
		color: white;
		padding: 12px 24px;
		font-size: 16px;
	}

	.btn.primary:hover:not(:disabled) {
		background: #1d4ed8;
	}

	.success {
		margin-top: 12px;
		padding: 10px 14px;
		background: #dcfce7;
		color: #166534;
		border-radius: 4px;
		font-size: 14px;
	}

	.error {
		margin-top: 12px;
		padding: 10px 14px;
		background: #fee2e2;
		color: #991b1b;
		border-radius: 4px;
		font-size: 14px;
	}

	.note {
		padding: 16px;
		background: #f0f9ff;
		border: 1px solid #bfdbfe;
		border-radius: 6px;
		color: #1e40af;
		font-size: 14px;
	}
</style>