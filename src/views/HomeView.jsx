import React, { useState } from 'react';
import { IconMicSpark, IconSearchGreen, IconAwardGold, IconPlateStack, IconHubBrochure, IconHubPlateSpoon, IconSparkles, IconChevronLeft, IconChevronRight } from '../Icons';
import { PantryCard } from './PantryCard';
import { PROMPT_HOME } from './Shared';

export const HomeView = ({ inputValue, setInputValue, setView, stats, recentMeals, availableAvatars, onOpenCard, onOpenMap, onCompare, taggedIds = [], onToggleTag }) => {
    const [page, setPage] = useState(0);

    // Strongly sort the deck by star rating first, then fallback to date
    const sortedRecentMeals = [...(recentMeals || [])].sort((a, b) => {
        if (b.rating !== a.rating) {
            return b.rating - a.rating;
        }
        return new Date(b.date) - new Date(a.date);
    });

    const pinnedCards = sortedRecentMeals.filter(m => taggedIds.includes(m.id));
    const unpinnedCards = sortedRecentMeals.filter(m => !taggedIds.includes(m.id));

    const CARDS_PER_PAGE = 6;
    const availableSlots = CARDS_PER_PAGE - pinnedCards.length;

    const startIndex = page * availableSlots;
    const currentUnpinned = unpinnedCards.slice(startIndex, startIndex + availableSlots);

    const displayedCards = [...pinnedCards, ...currentUnpinned];
    const hasMore = startIndex + availableSlots < unpinnedCards.length;

    return (
        <div className="absolute inset-0 flex flex-col px-6 gap-4 pb-48 overflow-y-auto no-scrollbar uppercase">
            <header className="text-center shrink-0 mb-2 mt-4 uppercase"><h1 className="text-3xl font-black tracking-tighter italic text-[#1A1A1A]">PlatePartner</h1><p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E2725B] mt-1.5 italic">A FIVE-STAR JOURNEY</p></header>
            <div className="flex items-start gap-3 bg-white/40 rounded-[2rem] border border-black/10 pl-8 pr-4 py-0 h-[110px] inner-fold shrink-0 uppercase"><textarea value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={PROMPT_HOME} className="flex-grow bg-transparent border-none focus:ring-0 text-[12px] font-bold h-[110px] pt-1 pb-3 w-full resize-none outline-none placeholder:text-black/30" /><div className="flex flex-col gap-3 justify-between h-[110px] items-center py-4"><IconMicSpark /><IconSearchGreen /></div></div>
            <div className="w-full px-4 py-3 rounded-[2rem] text-center border-2 border-black/10 bg-white/5 shadow-lg shrink-0 italic font-black uppercase"><div className="flex flex-col items-center"><h2 className="text-sm leading-none text-black/40">WELCOME</h2><h2 className="text-xl leading-none text-[#1A1A1A] mt-0.5">{stats?.userName || 'GUEST'}</h2></div><div className="h-px bg-black/10 w-full my-2.5" /><div className="grid grid-cols-2 gap-0 text-[#1A1A1A]"><div className="flex flex-col items-center group"><div className="flex items-center justify-center gap-1.5 mb-0.5 drop-shadow-sm"><IconAwardGold size={20} className="text-[#D4AF37] animate-pulse" /><span className="text-3xl leading-none uppercase text-[#1A1A1A]">{stats?.fiveStars || 0}</span></div><span className="text-[8px] opacity-40 uppercase">5 Star Plates</span></div><div className="flex flex-col items-center border-l border-black/10"><div className="flex items-center justify-center gap-1.5 mb-0.5"><IconPlateStack size={20} /><span className="text-3xl leading-none uppercase text-[#1A1A1A]">{stats?.totalFills || 0}</span></div><span className="text-[8px] opacity-40 uppercase">Plate Fills</span></div></div></div>
            <div className="flex gap-2 mb-6 shrink-0 relative z-10">
                <button onClick={() => setView('pantry')} className="relative flex-1 py-4 rounded-[2rem] bg-[#E2725B] text-white shadow-[0_8px_16px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-2 active:translate-y-[2px] active:shadow-[0_4px_8px_rgba(0,0,0,0.4)] transition-all border border-black/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }} />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <IconHubBrochure />
                        <span className="font-black text-[10px] uppercase tracking-widest leading-none mt-1">Plate Pantry</span>
                    </div>
                </button>
                <button onClick={() => alert("Fill My Plate coming soon!")} className="relative flex-1 py-4 rounded-[2rem] bg-[#4F7942] text-white shadow-[0_8px_16px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-2 active:translate-y-[2px] active:shadow-[0_4px_8px_rgba(0,0,0,0.4)] transition-all border border-black/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }} />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <IconHubPlateSpoon />
                        <span className="font-black text-[10px] uppercase tracking-widest leading-none mt-1">Fill My Plate</span>
                    </div>
                </button>
            </div>

            {recentMeals?.length > 0 && (
                <div className="shrink-0 mb-6 bg-transparent p-4 rounded-[2rem] border border-black/5 shadow-inner">
                    <div className="flex justify-between items-end mb-3 border-b border-black/5 pb-2 uppercase text-black/30 px-2">
                        <h3 className="text-[11px] font-black italic tracking-widest">Recent Plates</h3>
                        {taggedIds.length > 0 ? (
                            <button onClick={onCompare} className="text-[9px] font-black bg-[#E2725B] text-white px-3 py-1 rounded-full shadow-md active:scale-95 transition-transform flex items-center gap-1 animate-pulse"><IconSparkles size={12} /> COMPARE {taggedIds.length}</button>
                        ) : (
                            <button onClick={() => setView('pantry')} className="text-[8px] font-bold text-[#4F7942] uppercase active:scale-95 transition-transform">See All</button>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-1">
                        {displayedCards.map(m => (
                            <PantryCard key={m.id} m={m} onOpen={onOpenCard} availableAvatars={availableAvatars} isTagged={taggedIds.includes(m.id)} onToggleTag={onToggleTag} onOpenMap={onOpenMap} />
                        ))}
                    </div>
                    <div className="flex justify-center items-center mt-4 mb-2">
                        <button onClick={() => setView('pantry')} className="text-[9px] font-black uppercase tracking-widest text-[#E2725B] bg-black/5 hover:bg-black/10 px-6 py-2 rounded-full active:scale-95 transition-all outline-none border border-[#E2725B]/20">See More Plates</button>
                    </div>
                </div>
            )}
        </div>
    );
};
