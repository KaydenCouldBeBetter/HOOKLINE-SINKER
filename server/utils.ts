export const validateRadius = (lat: number, lon: number, rad: number): string[] => {
    const flags = [];

    if (lat < -90 || lat > 90) {
        flags.push("Invalid latitude: must be between -90 and 90");
    }

    if (lon < -180 || lon > 180) {
        flags.push("Invalid longitude: must be between -180 and 180");
    }

    if (rad <= 0) {
        flags.push("Invalid radius: must be greater than 0");
    }

    return flags;
}
