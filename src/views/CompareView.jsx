import React from 'react';
import { IconChevronLeft } from '../Icons';
import { PantryCard } from './PantryCard';

export const CompareView = ({ deckCards, onBack, onOpenCard, availableAvatars, onOpenMap }) => (
    <div className="absolute inset-0 z-10 flex flex-col bg-[#E8D4A9] overflow-y-auto no-scrollbar pb-32" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }}>
        <div className="px-6 pt-12 pb-4 flex justify-between items-center border-b border-black/5 shrink-0 uppercase sticky top-0 bg-[#E8D4A9]/90 backdrop-blur-md z-50 shadow-sm">
            <div className="flex flex-col w-full gap-3">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A] leading-none">Compare</h2>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#E2725B]">{deckCards.length} SELECTED PLATES</span>
                </div>
                <div className="flex gap-2 w-full">
                    <button onClick={() => onBack('pantry')} className="flex-1 py-2 bg-white/50 border border-black/5 text-[#E2725B] font-black uppercase text-[9px] tracking-widest rounded-full active:scale-95 flex items-center justify-center gap-1 shadow-sm"><IconChevronLeft size={12} /> PANTRY</button>
                </div>
            </div>
        </div>

        <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
                {deckCards.map(m => (
                    <div key={m.id} className="flex flex-col gap-2">
                        <PantryCard m={m} onOpen={onOpenCard} availableAvatars={availableAvatars} onOpenMap={onOpenMap} />
                        <div className="bg-white/40 p-3 rounded-[1.25rem] text-center shadow-inner border border-black/5 flex-1 flex flex-col">
                            <h4 className="text-[9px] font-black uppercase text-black/30 tracking-widest mb-1.5 border-b border-black/5 pb-1">Notes</h4>
                            <p className="text-[10px] font-bold text-[#1A1A1A] leading-snug italic uppercase">{m.notes || 'No notes left for this plate.'}</p>
                            <div className="mt-auto pt-3 flex flex-wrap gap-1 justify-center">
                                {m.primaryStyle && <span className="bg-white px-2 py-0.5 rounded text-[8px] font-black text-black/60 shadow-sm uppercase">{m.primaryStyle}</span>}
                                {m.petFriendly && <span className="bg-[#92400E]/10 px-2 py-0.5 rounded text-[8px] font-black text-[#92400E] shadow-sm uppercase">Pets</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
