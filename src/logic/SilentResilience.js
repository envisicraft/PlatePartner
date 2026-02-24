import { useState, useEffect, useCallback } from 'react';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Logic: Connectivity - Silent Resilience
 * Requirement: Maintain background sync without "loading" or "offline" statuses.
 */

export const useSilentResilience = (initialData = [], onSyncComplete) => {
    const [queue, setQueue] = useState([]); // Interaction Queue
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // 1. Silent Resilience: Listen for connectivity changes without UI alerts
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // 2. Queue Logic: Add interaction to local queue immediately
    const addToQueue = useCallback((interaction) => {
        const interactionWithMeta = {
            ...interaction,
            id: `sr_${Date.now()}`,
            timestamp: new Date().toISOString()
        };

        setQueue(prev => [...prev, interactionWithMeta]);

        // In a real app, you would also persist this to IndexedDB/LocalStorage here
        console.log("Silent Resilience: Interaction captured locally.");
    }, []);

    // 3. Background Sync: Trigger whenever we come back online
    useEffect(() => {
        if (isOnline && queue.length > 0) {
            processQueue();
        }
    }, [isOnline, queue]);

    const processQueue = async () => {
        console.log(`Silent Resilience: Background Syncing ${queue.length} items...`);

        try {
            // Logic: Iterate through the queue and send to server
            // for (const item of queue) { await api.sync(item); }

            // Simulate successful sync
            setQueue([]);
            if (onSyncComplete) onSyncComplete();
        } catch (err) {
            console.error("Silent Resilience: Background sync deferred.");
        }
    };

    return { addToQueue, queueLength: queue.length, isOnline };
};