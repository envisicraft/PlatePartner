/**
 * Project: Dining Architect - Master Spec v6.0
 * Logic: Loop-Closure & Ghost Log Conversion
 * Requirement: Convert ignored Morning Whisper prompts into Ghost Logs (Location + Date).
 */

export const convertToGhostLog = (visit) => {
    // Logic: Extract strictly the Location + Date for the Monthly Sweep
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return {
        id: `ghost_${Date.now()}_${visit.id}`,
        location: visit.location,
        date: yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        originalStyle: visit.style || 'UNKNOWN',
        type: 'Ghost Log' // Identifies this as a converted/unfinalized visit
    };
};

/**
 * Pruning Logic: Removes processed items from the reflection queue 
 * and adds them to the Ghost Log repository (Pencil Icon).
 */
export const handleLoopClosure = (currentProbableVisits, ignoredVisitId) => {
    const visitToConvert = currentProbableVisits.find(v => v.id === ignoredVisitId);

    if (!visitToConvert) return null;

    return convertToGhostLog(visitToConvert);
};