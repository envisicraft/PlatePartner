import React from 'react';
import { Icons } from './UiAssets';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Ghost Log Trigger (Pencil Icon)
 * Logic: Entry point for unpolished memories (Ghost Logs).
 * Interaction: Tapping opens the Monthly Sweep / Pencil Drawer.
 */

const GhostLogTrigger = ({ count, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="relative p-3 rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-90 group"
            aria-label="Open Ghost Logs"
        >
            {/* The Pencil Icon: Home of the unpolished memory */}
            <span className="text-xl text-slate-400 group-hover:text-amber-500 transition-colors">
                {Icons.PENCIL || '✎'}
            </span>

            {/* Notification Badge: Silent Resilience Style */}
            {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] font-bold text-white items-center justify-center border border-[#FDFCF8]">
                        {count}
                    </span>
                </span>
            )}
        </button>
    );
};

export default GhostLogTrigger;