/**
 * Project: Dining Architect - Arrival Logic (v6.6)
 * Logic: Probable Visit GPS Dwell
 * Requirement: Track visits > 20 minutes even if app is closed.
 */

export const monitorGPSDwell = (currentCoords, pantry, activeVisit, onVisitConfirmed) => {
    const DWELL_THRESHOLD = 20 * 60 * 1000; // 20 minutes in milliseconds
    const GEOFENCE_RADIUS = 0.05; // 50 meters

    // 1. Silent Resilience: Check if we are currently at a known Pantry spot
    const matchedSpot = pantry.find(spot => {
        const distance = calculateDistance(currentCoords.lat, currentCoords.lng, spot.lat, spot.lng);
        return distance <= GEOFENCE_RADIUS;
    });

    if (matchedSpot) {
        const now = Date.now();

        // 2. Start tracking if this is a new entry into a geofence
        if (!activeVisit || activeVisit.locationId !== matchedSpot.id) {
            return {
                locationId: matchedSpot.id,
                locationName: matchedSpot.name,
                startTime: now,
                isConfirmed: false
            };
        }

        // 3. Confirm Probable Visit after 20-minute threshold
        const dwellDuration = now - activeVisit.startTime;
        if (dwellDuration >= DWELL_THRESHOLD && !activeVisit.isConfirmed) {
            const confirmedVisit = { ...activeVisit, isConfirmed: true };
            onVisitConfirmed(confirmedVisit);
            return confirmedVisit;
        }
    }

    // Reset if the user leaves the geofence
    return null;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
};