import React from 'react';
import { PantryCard } from './PantryCard';

export const ChronoSection = ({ title, meals, onOpenCard, availableAvatars, taggedIds = [], onToggleTag }) => {
    if (!meals || meals.length === 0) return null;

    // Sort meals 5-star down to 1-star
    const sortedMeals = [...meals].sort((a, b) => b.rating - a.rating);

    return (
        <div className="px-6 mb-6 shrink-0">
            <div className="flex justify-between items-center mb-3 border-b border-black/5 pb-2 uppercase text-black/30">
                <h3 className="text-[12px] font-black italic tracking-widest">{title}</h3>
                <span className="text-[8px] font-bold text-[#E2725B] uppercase">{meals.length} PLATE{meals.length === 1 ? '' : 'S'}</span>
            </div>
            {/* grid-cols-3 handles the 3 across constraint, and new items naturally wrap to rows below! */}
            <div className="grid grid-cols-3 gap-2">
                {sortedMeals.map(m => <PantryCard key={m.id} m={m} onOpen={onOpenCard} availableAvatars={availableAvatars} isTagged={taggedIds.includes(m.id)} onToggleTag={onToggleTag} onOpenMap={() => { }} />)}
            </div>
        </div>
    );
};
