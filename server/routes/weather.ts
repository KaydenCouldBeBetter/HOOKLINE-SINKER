import {Location, Result, ok, err} from "../../shared/types";

const WEATHER_API_KEY = process.env.WEATHERAPI_ACCESS_TOKEN || '';
const BASE_URL = "http://api.weatherapi.com/v1"

const fetchLocationWeather = async (loc: Location) => {
    let params = new URLSearchParams();
    params.append('key', WEATHER_API_KEY);
    params.append('q', `${loc.latitude},${loc.longitude}`);
    params.append('tides', 'yes');
    params.append('pollen', 'no');

    const url = `${BASE_URL}?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) {
        return `Broken: ${res.status}`;
    }

    return res.json();
}

export {fetchLocationWeather};
