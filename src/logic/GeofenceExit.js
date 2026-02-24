/**
 * Project: Dining Architect - Master Spec v6.0
 * Logic: Geofence Exit (Arrival Logic v6.6)
 * Requirement: If visit > 20 mins, prompt for photo/receipt upon exit.
 */

export const monitorGeofenceExit = (currentLocation, pantry, visitStartTime, onExit) => {
    const dwellThreshold = 20 * 60 * 1000; // 20 minutes in milliseconds
    const exitRadius = 0.1; // 100 meters to confirm exit

    // 1. Silent Resilience: Check if this is a "Probable Visit"
    const currentTime = new Date().getTime();
    const dwellTime = currentTime - visitStartTime;

    if (dwellTime >= dwellThreshold) {
        // 2. Scan Pantry for the location we just left
        const activeSpot = pantry.find(spot => {
            const distance = calculateDistance(
                currentLocation.lat,
                currentLocation.lng,
                spot.lat,
                spot.lng
            );
            return distance > exitRadius; // Triggered when outside the exit radius
        });

        if (activeSpot) {
            // 3. Loop-Closure: Trigger the prompt for photo/receipt
            onExit(activeSpot);
        }
    }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
};