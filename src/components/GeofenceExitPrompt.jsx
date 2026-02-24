import React from 'react';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Geofence Exit Prompt
 * Logic: Triggered on exit after a >20 min visit. Prompt for photo/receipt.
 */

const GeofenceExitPrompt = ({ locationName, isVisible, onCapture, onDismiss }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-md z-[210] animate-in slide-in-from-top duration-500">
            <div className="bg-slate-900 text-white shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10 p-5">
                <div className="flex flex-col gap-4">
                    <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">Exit Detected</span>
                        <h3 className="text-lg font-bold font-serif leading-tight mt-1">
                            Leaving {locationName}?
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 italic">
                            Snap a photo or receipt to anchor the memory.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onDismiss}
                            className="flex-1 py-3 bg-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                        >
                            Skip to Ghost Log
                        </button>
                        <button
                            onClick={onCapture}
                            className="flex-1 py-3 bg-amber-400 text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-300 transition-all shadow-lg active:scale-95"
                        >
                            Add Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeofenceExitPrompt;