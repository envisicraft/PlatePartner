/**
 * Project: Dining Architect - Master Spec v6.0
 * Logic: Monthly Sweep Cleanup (Stale Log Purge)
 * Requirement: Batch-delete junk logs older than 30 days.
 */

export const purgeStaleLogs = (currentGhostLogs, expiryDays = 30) => {
    const now = new Date();

    // Logic: Identify logs that have exceeded the monthly window
    const activeLogs = currentGhostLogs.filter(log => {
        const logDate = new Date(log.timestamp || log.date);
        const diffTime = Math.abs(now - logDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Keep logs that are within the 30-day "Sweep" window
        return diffDays <= expiryDays;
    });

    const deletedCount = currentGhostLogs.length - activeLogs.length;

    if (deletedCount > 0) {
        console.log(`Silent Resilience: Purged ${deletedCount} stale junk logs.`);
    }

    return activeLogs;
};