import React, { useState } from 'react';
import { Icons } from './UiAssets';

/**
 * Ghost Log Component - Dining Architect
 * Logic: Location + Date only. 
 * Interaction: Swipe to Delete, Tap to Vault.
 */

const GhostLog = ({ log, onDelete, onVault }) => {
    const [isExpanding, setIsExpanding] = useState(false);
    const [rating, setRating] = useState(0);

    return (
        <div className="mb-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
            <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                onClick={() => setIsExpanding(!isExpanding)}
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl">{Icons.GHOST}</span>
                    <div>
                        <h4 className="font-bold text-slate-800">{log.location}</h4>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">{log.date}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Swipe-Action Proxies */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(log.id); }}
                        className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                        title="Swipe Left to Delete"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {isExpanding && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 animate-fade-in">
                    <p className="text-sm text-slate-600 mb-3 italic">Vault this memory?</p>

                    {/* Rating DNA: 1-5 Stars */}
                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-2xl ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                            >
                                {Icons.STAR}
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Add a 'Future-Me' Tip..."
                        className="w-full p-3 text-sm border rounded-lg mb-3 focus:ring-1 focus:ring-amber-400 outline-none"
                    />

                    <button
                        onClick={() => onVault(log.id, rating)}
                        className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-700"
                    >
                        SAVE TO PANTRY
                    </button>
                </div>
            )}
        </div>
    );
};

export default GhostLog;