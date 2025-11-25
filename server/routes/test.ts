// Simple test to check WeatherAPI response structure

const WEATHER_API_KEY = process.env.WEATHERAPI_ACCESS_TOKEN || '';
const BASE_URL = "http://api.weatherapi.com/v1";

async function testWeatherAPI() {
    const latitude = 40.7128;
    const longitude = -74.0060;

    const params = new URLSearchParams();
    params.append('key', WEATHER_API_KEY);
    params.append('q', `${latitude},${longitude}`);
    params.append('tides', 'yes');
    params.append('pollen', 'no');

    // Note: You need to specify an endpoint like /marine.json or /forecast.json
    const url = `${BASE_URL}/marine.json?${params.toString()}`;

    console.log('Testing URL:', url.replace(WEATHER_API_KEY, 'HIDDEN_KEY'));

    try {
        const res = await fetch(url);

        if (!res.ok) {
            console.error('Error:', res.status, res.statusText);
            const errorText = await res.text();
            console.error('Error body:', errorText);
            return;
        }

        const data = await res.json();
        console.log('Response structure:');
        console.log(JSON.stringify(data, null, 2));

        console.log('\n--- Keys at root level ---');
        console.log(Object.keys(data));

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testWeatherAPI();