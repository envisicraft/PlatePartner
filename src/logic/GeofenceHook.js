import { useState, useRef } from 'react';

/**
 * Project: Dining Architect - Geofence Logic
 * Calculates great-circle distance between two points on Earth.
 */
const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371e3; // Earth's mean radius in meters

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    // Haversine formula implementation
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const useGeofence = (targetLat, targetLon, dwellTimeMs, onDwellTriggered) => {
    const [isTracking, setIsTracking] = useState(false);
    const [currentDistance, setCurrentDistance] = useState(null);
    const dwellTimer = useRef(null);
    const watchId = useRef(null);

    const startTracking = () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser."); //
            return;
        }

        setIsTracking(true);
        console.log("GPS Tracking Initiated...");

        // Continuously monitor the user's position
        watchId.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords; //
                const distance = calculateDistanceInMeters(latitude, longitude, targetLat, targetLon);

                setCurrentDistance(Math.round(distance));
                console.log(`Current Distance to target: ${Math.round(distance)} meters`);

                // Geofence Radius: 100 meters
                if (distance <= 100) {
                    if (!dwellTimer.current) {
                        console.log("Entered geofence. Starting dwell timer...");
                        // Start the silent countdown
                        dwellTimer.current = setTimeout(() => {
                            console.log("Dwell time satisfied! Triggering Probable Visit.");
                            onDwellTriggered();
                        }, dwellTimeMs);
                    }
                } else {
                    // User left the 100m radius, cancel the visit logic
                    if (dwellTimer.current) {
                        console.log("Exited geofence. Resetting timer.");
                        clearTimeout(dwellTimer.current);
                        dwellTimer.current = null;
                    }
                }
            },
            (error) => {
                console.error("GPS Error: ", error.message); //
                setIsTracking(false);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 } // Configures GPS precision
        );
    };

    const stopTracking = () => {
        if (watchId.current) {
            navigator.geolocation.clearWatch(watchId.current); //
            watchId.current = null;
        }
        if (dwellTimer.current) {
            clearTimeout(dwellTimer.current);
            dwellTimer.current = null;
        }
        setIsTracking(false);
        console.log("GPS Tracking Stopped.");
    };

    return { isTracking, currentDistance, startTracking, stopTracking };
};