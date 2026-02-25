import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';

// Define the local offline-first database
export const db = new Dexie('PlatePartnerDB');

// --- SCHEMA DEFINITION ---
// We map the SQLite Master Spec to IndexedDB stores.
// ++id means auto-incrementing primary key.
// Fields without ++ or & are indexed for fast searching but not unique.
db.version(1).stores({
    // Table 1: Locations (The Anchor)
    locations: 'place_id, name, latitude, longitude',

    // Table 2: Visit_Logs (The Bundle)
    // visit_id is UUID. We index place_id for relations, and status for the 7-Day Sweep.
    visit_logs: 'visit_id, place_id, timestamp_in, status, rating_score, is_ghost',

    // Table 3: Media_Assets (The Stack)
    media_assets: 'asset_id, visit_id, type, timestamp',

    // Table 4: Dish_Items (The OCR / Manual Extraction)
    dish_items: 'item_id, visit_id, name, source_receipt'
});

// --- MODULE 1: THE STAPLER LOGIC ---

/**
 * The "Stay" Event & Stapler action.
 * Logic: If a user stays at a location for > 5 min, start a session.
 * All media captured within 120 minutes is bundled to this visit_id.
 */
export async function stapleVisitEvent(locationData) {
    // 1. Check if we are already in an active 120-minute window for this location
    const { place_id, name, latitude, longitude } = locationData;
    const now = Date.now();
    const TWO_HOURS_MS = 120 * 60 * 1000;

    // Ensure location exists in the anchor table
    await db.locations.put({ place_id, name, latitude, longitude });

    // Look for an active "PENDING_POLISH" session at this location within last 2 hours
    let activeSession = await db.visit_logs
        .where('place_id')
        .equals(place_id)
        .filter(log => log.status === 'PENDING_POLISH' && (now - log.timestamp_in) < TWO_HOURS_MS)
        .first();

    // 2. The "Overlap Rule" - If no active session, create a new Ghost Log bundle.
    if (!activeSession) {
        const newVisitId = uuidv4();

        activeSession = {
            visit_id: newVisitId,
            place_id: place_id,
            timestamp_in: now,
            timestamp_out: null,
            weather_md: null, // To be populated by API silently
            status: 'PENDING_POLISH',
            rating_score: 0, // Unrated
            future_me_tip: '',
            vibe_stamps: [],
            is_ghost: true // Created purely by GPS/Dwell handshake
        };

        await db.visit_logs.add(activeSession);
    }

    return activeSession.visit_id;
}

/**
 * 7-Day Sweep (Hygiene)
 * Logic: Run daily at 03:00 AM. 
 * Any PENDING_POLISH log older than 168 hours is moved to COLD_STORAGE.
 */
export async function perform7DaySweep() {
    const SEVEN_DAYS_MS = 168 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - SEVEN_DAYS_MS;

    const oldLogs = await db.visit_logs
        .filter(log => log.status === 'PENDING_POLISH' && log.timestamp_in < cutoffTime)
        .toArray();

    for (let log of oldLogs) {
        await db.visit_logs.update(log.visit_id, { status: 'COLD_STORAGE' });
    }

    return oldLogs.length;
}

// --- MODULE 1: UI ADAPTER LOGIC ---
// Helper functions to map the normalized Database Schema to the flat objects expected by App.jsx

export async function savePlate(mealData) {
    // mealData is flat from the UI Editor: 
    // { id (timestamp or string), userIds, dish, place, rating, placeRating, img, date, primaryStyle, notes, petFriendly }

    const visitId = typeof mealData.id === 'string' ? mealData.id : uuidv4();
    const placeId = mealData.place.toLowerCase().replace(/[^a-z0-9]/g, ''); // Naive place ID for prototype

    // 1. Ensure Anchor Location exists
    await db.locations.put({
        place_id: placeId,
        name: mealData.place,
        latitude: null, // UI doesn't have this yet unless Geofenced
        longitude: null
    });

    // 2. Save the Visit Log (Bundle)
    await db.visit_logs.put({
        visit_id: visitId,
        place_id: placeId,
        timestamp_in: Date.now(), // Real apps would parse mealData.date
        status: 'POLISHED', // Since it was saved via the Editor
        rating_score: mealData.placeRating !== undefined ? mealData.placeRating : mealData.rating,
        is_ghost: false,

        // UI specific fields that we chuck in the bundle for the prototype
        userIds: mealData.userIds || ['JD'],
        ui_date_string: mealData.date,
        primaryStyle: mealData.primaryStyle,
        notes: mealData.notes,
        petFriendly: mealData.petFriendly
    });

    // 3. Save the Dish Item
    if (mealData.dish) {
        await db.dish_items.put({
            item_id: uuidv4(),
            visit_id: visitId,
            name: mealData.dish,
            rating: mealData.rating,
            source_receipt: false
        });
    }

    // 4. Save the Media Asset (if they attached an image)
    if (mealData.img) {
        await db.media_assets.put({
            asset_id: uuidv4(),
            visit_id: visitId,
            type: 'photo',
            url: mealData.img, // In prototype we'll store URL. Real app would store binary/blob
            timestamp: Date.now()
        });
    }

    return visitId;
}

export async function deletePlate(visitId) {
    await db.visit_logs.where('visit_id').equals(visitId).delete();
    await db.dish_items.where('visit_id').equals(visitId).delete();
    await db.media_assets.where('visit_id').equals(visitId).delete();
}

export async function getAllPlates() {
    const visits = await db.visit_logs.toArray();
    const output = [];

    for (let v of visits) {
        const loc = await db.locations.get(v.place_id);
        const dishes = await db.dish_items.where('visit_id').equals(v.visit_id).toArray();
        const media = await db.media_assets.where('visit_id').equals(v.visit_id).toArray();

        // Map back to the App.jsx expected format
        output.push({
            id: v.visit_id,
            userIds: v.userIds || ['JD'],
            dish: dishes.length > 0 ? dishes[0].name : 'Unknown Dish',
            place: loc ? loc.name : 'Unknown Location',
            rating: dishes.length > 0 ? dishes[0].rating : 0, // Fallback if no dish rating
            placeRating: v.rating_score || 0,
            img: media.length > 0 ? media[0].url : null,
            date: v.ui_date_string || '2026-02-23', // Hardcoded fallback date for prototype ease
            isGhost: v.is_ghost,
            primaryStyle: v.primaryStyle,
            notes: v.notes,
            petFriendly: v.petFriendly
        });
    }

    return output.sort((a, b) => b.id.localeCompare(a.id)); // Sort by newest visit_id 
}
