import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../firebase';
import { seedDatabase } from '../logic/seed';
import { syncVaultToCloud } from '../logic/syncEngine';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        seedDatabase();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
        });

        // The Data Connect Bridge: Poll local Dexie every 10 seconds for offline logs
        const syncInterval = setInterval(syncVaultToCloud, 10000);
        return () => {
            clearInterval(syncInterval);
            unsubscribe();
        };
    }, []);

    const handleLogin = async (providerName) => {
        try {
            if (providerName === 'google') {
                await signInWithPopup(auth, googleProvider);
            } else if (providerName === 'apple') {
                await signInWithPopup(auth, appleProvider);
            } else if (providerName === 'email') {
                alert("Email authentication flow will be implemented shortly.");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleDummyLogin = () => {
        setUser({ uid: 'developer-bypass-123', displayName: 'Developer JD', email: 'dev@platepartner.app' });
    };

    return { user, isAuthLoading, handleLogin, handleDummyLogin };
}
