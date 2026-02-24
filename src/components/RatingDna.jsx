import React, { useState, useEffect } from 'react';
import { Icons } from './UiAssets';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Rating DNA
 * Logic: Strictly 1-5 Stars. Silent Resilience background sync.
 */

const RatingDna = ({ initialRating = 0, onRatingChange }) => {
    const [rating, setRating] = useState(initialRating);
    const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
        onRatingChange(selectedRating);

        // Silent Resilience Logic: Background Sync Simulation
        setSyncStatus('syncing');

        // Simulate background sync without showing a "loading" spinner to the user
        setTimeout(() => {
            setSyncStatus('synced');
            console.log(`Silent Sync: Rating of ${selectedRating} stars saved to Master Menu.`);

            // Reset status after a delay (stays silent to user)
            setTimeout(() => setSyncStatus('idle'), 2000);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`text-3xl transition-all active:scale-90 ${rating >= star ? 'text-amber-400' : 'text-slate-100'
                            }`}
                        title={star === 1 ? "1 - Never Again" : star === 5 ? "5 - Absolute Favorite" : `${star} Stars`}
                    >
                        {Icons.STAR}
                    </button>
                ))}
            </div>

            {/* Hidden Sync Indicator: Only visible for debugging, remains silent for user */}
            <span className="text-[8px] text-slate-300 uppercase tracking-widest h-2">
                {syncStatus === 'syncing' ? '•••' : ''}
            </span>
        </div>
    );
};

export default RatingDna;