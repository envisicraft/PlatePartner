/**
 * Project: Dining Architect - Master Spec v6.0
 * Logic: Vibe DNA Inference
 * Requirement: Infer Vibe from time of day if none is selected.
 */

export const inferVibeFromTime = (timestamp = new Date()) => {
    const date = new Date(timestamp);
    const hour = date.getHours();

    // 1. Logic: Lunch/Midday Window (11:00 AM - 3:59 PM)
    if (hour >= 11 && hour < 16) {
        return 'CASUAL';
    }

    // 2. Logic: Evening Window (4:00 PM - 11:59 PM)
    if (hour >= 16 || hour < 4) {
        return 'ATMOSPHERIC';
    }

    // 3. Fallback: Default to Universal/Casual
    return 'CASUAL';
};

/**
 * Variety Rule Check: Ensures a suggested vibe doesn't conflict 
 * with the 14-day variety constraint.
 */
export const validateVibeVariety = (inferredVibe, history) => {
    const recentCuisines = history.slice(0, 14).map(h => h.style);
    return !recentCuisines.includes(inferredVibe);
};