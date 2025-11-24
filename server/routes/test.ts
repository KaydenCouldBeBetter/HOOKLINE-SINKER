import {fetchLocationWeather} from './weather'
import {getAllLocations} from "./locations";
import {initSchema} from "../database/schema";
import {initializeDatabase} from "../database/connection";

const test1 = () => {
    initializeDatabase();
    initSchema();
    const locs = getAllLocations();
    if (locs.length >= 1) {
        const result = fetchLocationWeather(locs[0])
            .then(
                (result) => {
                    console.log(result);
                }
            )
    } else {
        console.log('fill the database dipshit');
    }
}

test1();
