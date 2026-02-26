import React from 'react';
import { IconHome, IconCalendar, IconCamera, IconFilter, IconMenu, IconPencil } from '../Icons';
import { PARCHMENT_BG } from './Shared';

export function FooterNav({ view, ghostCount, onOpenGhost, onNewPlate, onOpenFilter, onGoHome, onOpenCalendar }) {
    const parchmentBg = PARCHMENT_BG;

    if (view === 'home') {
        return (
            <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[500]">
                <footer className="h-[120px] flex items-end justify-around pb-8 relative pointer-events-none">
                    {/* GRADIENT BACKDROP */}
                    <div className="absolute inset-0 pointer-events-none -z-10" style={{ ...parchmentBg, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 10%, black 40%, black 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 10%, black 40%, black 100%)' }} />
                    <button onClick={onOpenGhost} className={`relative pointer-events-auto p-2 z-10 ${ghostCount > 0 ? 'text-[#EF4444] animate-pulse' : 'text-black/60 active:scale-90 transition-transform'}`}>
                        {ghostCount > 0 && <div className="absolute top-0 right-0 bg-[#EF4444] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#E8D4A9]">{ghostCount}</div>}
                        <IconPencil className="rotate-[-15deg]" size={28} />
                    </button>
                    <button onClick={onNewPlate} className="pointer-events-auto p-2 text-[#4F7942] active:scale-90 transition-transform z-10"><IconCamera size={32} /></button>
                    <button onClick={onOpenFilter} className="pointer-events-auto p-2 text-black/60 z-10"><IconFilter size={32} /></button>
                    <button className="pointer-events-auto p-2 text-black/60 z-10"><IconMenu size={32} /></button>
                </footer>
            </div>
        );
    }

    return (
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[500]">
            <footer className="h-[90px] flex items-end justify-around pb-5 relative pointer-events-none">
                {/* GRADIENT BACKDROP for PANTRY */}
                <div className="absolute inset-0 pointer-events-none -z-10" style={{ ...parchmentBg, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)' }} />
                <button onClick={onGoHome} className="pointer-events-auto p-2 text-black/40 active:scale-90 transition-transform z-10"><IconHome size={24} /></button>
                <button onClick={onOpenCalendar} className="pointer-events-auto p-2 text-black/40 z-10"><IconCalendar size={24} /></button>
                <button onClick={onNewPlate} className="pointer-events-auto p-2 text-black/40 z-10"><IconCamera size={24} /></button>
                <button onClick={onOpenFilter} className="pointer-events-auto p-2 text-black/40 z-10"><IconFilter size={24} /></button>
                <button className="pointer-events-auto p-2 text-black/40 z-10"><IconMenu size={24} /></button>
            </footer>
        </div>
    );
}
