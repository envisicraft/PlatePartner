import React from 'react';
import { IconMapPin } from '../../Icons';
import { formatDate } from '../Shared';

export const GhostEventBanner = ({ ghostSource, pendingCount, hasAppliedData, onDiscard, onApply }) => {
    if (!ghostSource || hasAppliedData) return null;

    return (
        <div className="w-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-[2rem] p-4 flex flex-col gap-3 shadow-inner relative overflow-hidden group animate-in slide-in-from-top fade-in duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="flex items-start gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-md shrink-0">
                    <IconMapPin size={20} />
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#D97706] leading-none mb-1">Unfinished Card Entries ({pendingCount} Pending)</span>
                    <h3 className="text-[16px] font-black text-[#1A1A1A] leading-tight capitalize">{ghostSource.place || 'Unknown Place'}</h3>
                    <span className="text-[10px] font-bold text-black/50 mt-0.5 capitalize">{formatDate(ghostSource.date)} • Pending Review</span>
                </div>
            </div>
            <div className="flex gap-2 w-full mt-1 relative z-10">
                <button onClick={onDiscard} className="flex-1 py-3 rounded-xl bg-white/60 text-[#D97706] font-black uppercase text-[10px] tracking-widest shadow-sm active:scale-95 transition-transform">Discard</button>
                <button onClick={onApply} className="flex-1 py-3 rounded-xl bg-[#F59E0B] text-white font-black uppercase text-[10px] tracking-widest shadow-md active:scale-95 transition-transform">Apply Data</button>
            </div>
        </div>
    );
};
