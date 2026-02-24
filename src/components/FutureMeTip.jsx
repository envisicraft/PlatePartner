import React from 'react';

/**
 * Project: Dining Architect - Arrival Logic (v6.6)
 * Component: Future-Me Tip (Geofence Notification)
 * Logic: Triggered via GPS dwell or arrival at a saved Pantry spot.
 */

const FutureMeTip = ({ tip, locationName, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-md z-[200] animate-in slide-in-from-top duration-500">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
                <div className="flex items-start p-4 gap-4">
                    {/* Arrival Icon/Brand Mark */}
                    <div className="bg-amber-100 p-2 rounded-xl">
                        <span className="text-xl">📍</span>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                Arrived at {locationName}
                            </span>
                            <button
                                onClick={onClose}
                                className="text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-slate-800 font-serif italic text-sm mt-1 leading-relaxed">
                            "Future-Me Tip: {tip}"
                        </p>
                    </div>
                </div>

                {/* Subtle Progress Bar (Silent Resilience Vibe) */}
                <div className="h-1 bg-amber-400/20 w-full">
                    <div className="h-full bg-amber-400 w-1/3 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default FutureMeTip;