/**
 * Project: Dining Architect - Master Spec v6.0
 * Logic: Variety Rule Exclusion
 * Requirement: Strictly exclude any cuisine eaten within the last 14 days.
 */

export const getForbiddenCuisines = (mealHistory, currentDate = new Date()) => {
    const fourteenDaysAgo = new Date(currentDate);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // 1. Filter history for entries within the 14-day window
    const recentEntries = mealHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp || entry.date);
        return entryDate >= fourteenDaysAgo && entryDate <= currentDate;
    });

    // 2. Extract unique cuisine styles (the "Color Balance" pills)
    const forbiddenSet = new Set(recentEntries.map(entry => entry.style));

    return Array.from(forbiddenSet);
};

/**
 * Filter Pantry: Only returns 4-5 star favorites that obey the Variety Rule.
 */
export const filterPantryByVariety = (pantry, forbiddenCuisines) => {
    return pantry.filter(item =>
        !forbiddenCuisines.includes(item.style) && item.rating >= 4
    );
};