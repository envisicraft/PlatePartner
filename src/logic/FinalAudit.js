/**
 * Project: Dining Architect - Arrival Logic (v6.6)
 * Logic: Final Reconciliation Audit
 * Goal: Verify synchronization and logic-flow across background services.
 */

export const runSystemAudit = (pantry, ghostLogs, activeAvatars, syncQueueLength) => {
    const auditResults = {
        integrity: "PASS",
        alerts: [],
        status: {}
    };

    // 1. Audit: Rating DNA (Strict 1-5 Star scale)
    const invalidRatings = pantry.filter(item => item.rating < 1 || item.rating > 5);
    if (invalidRatings.length > 0) {
        auditResults.integrity = "FAIL";
        auditResults.alerts.push(`${invalidRatings.length} entries violate the 1-5 Star Rating DNA.`);
    }

    // 2. Audit: Silent Resilience (Sync Queue Health)
    auditResults.status.sync = syncQueueLength > 0
        ? `Silent Resilience: ${syncQueueLength} items pending background sync.`
        : "Silent Resilience: Fully synchronized.";

    // 3. Audit: Loop-Closure (Ghost Log Routing)
    auditResults.status.pantry = `${pantry.length} items in Plate Pantry.`;
    auditResults.status.ghosts = `${ghostLogs.length} unpolished memories in Pencil Drawer.`;

    // 4. Audit: Variety Rule (14-Day Check)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const recentCuisines = pantry
        .filter(item => new Date(item.timestamp) >= fourteenDaysAgo)
        .map(item => item.style);

    auditResults.status.variety = `Variety Rule: ${[...new Set(recentCuisines)].length} styles locked.`;

    return auditResults;
};