import { db } from './db';
import { createVisitLog } from '../dataconnect';
import { dataConnect } from '../firebase';

/**
 * The Data Connect Bridge (Sync Engine)
 * This background worker scans the local Dexie IndexedDB for unsynced Visit Logs
 * and pushes them to the Firebase Postgres database (The Vault) using Data Connect.
 */
export async function syncVaultToCloud() {
    try {
        console.log("[Data_Pantry Sync] Scanning for offline changes...");

        // 1. Find all Visit Logs in Dexie that haven't been pushed to Firebase yet
        // In a real app we would index this natively, but for the prototype we can filter
        const allLogs = await db.visit_logs.toArray();
        const unsyncedLogs = allLogs.filter(log => !log.is_synced);

        if (unsyncedLogs.length === 0) {
            console.log("[Data_Pantry Sync] Local data is fully synced with The Vault.");
            return 0; // Nothing to sync
        }

        console.log(`[Data_Pantry Sync] Found ${unsyncedLogs.length} offline records. Syncing to Cloud...`);

        // 2. Push each un-synced bundle up to Cloud SQL using the exact UUID Types
        for (const log of unsyncedLogs) {
            await createVisitLog(dataConnect, {
                visitId: log.visit_id,
                locationId: log.place_id,
                // Ensure ms epoch is safely converted to Int64 capable format or just int
                timestampIn: log.timestamp_in,
                status: log.status,
                isGhost: !!log.is_ghost
            });

            // 3. Mark the transaction as successfully completed locally
            await db.visit_logs.update(log.visit_id, { is_synced: true });
            console.log(`[Data_Pantry Sync] Successfully vaulted Visit_Log: ${log.visit_id}`);
        }

        return unsyncedLogs.length;
    } catch (error) {
        console.error("[Data_Pantry Sync] Error syncing to The Vault:", error);
        return 0;
    }
}
