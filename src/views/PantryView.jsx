import React from 'react';
import { IconMapPin, IconPencil, IconPawPrint, IconPlus, IconMicSpark, IconSearchGreen, IconX, IconCalendar, IconChevronDown, IconSparkles } from '../Icons';
import { ChronoSection } from './ChronoSection';
import { PROMPT_PANTRY } from './Shared';

export const PantryView = ({ heldMeals = [], bucketedMeals, activeAvatars, availableAvatars, onToggleAvatar, onAddAvatar, onOpenCalendar, pantrySearch, setPantrySearch, onOpenCard, onOpenMap, onAddNew, onOpenGhost, ghostCount, taggedIds = [], onToggleTag, onCompare }) => {
    // Optional fallback values to prevent crashes on bad state loads
    const search = pantrySearch || { text: '', dates: [] };
    const textTerm = search.text || '';
    const dateFilters = search.dates || [];

    // Temporary stub to prevent missing hook crashes
    const isTracking = false;
    const currentDistance = 0;
    const startTracking = () => { };
    const stopTracking = () => { };

    return (
        <div className="absolute inset-0 flex flex-col animate-in slide-in-from-right duration-[600ms] overflow-hidden">
            {/* FIXED HEADER SECTION */}
            <div className="shrink-0 flex flex-col z-[100] relative bg-[#E8D4A9] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-black/5" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }}>
                <div className="flex items-center justify-between px-6 pt-8 pb-2 uppercase tracking-widest">
                    <h2 className="text-4xl font-black italic tracking-tighter text-[#1A1A1A]">Plate Pantry</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={isTracking ? stopTracking : startTracking}
                            className={`text-white px-3 py-2 rounded-full font-black text-[10px] uppercase shadow-md active:scale-95 flex items-center gap-1 ${isTracking ? 'bg-[#22C55E] animate-pulse' : 'bg-black/20'}`}
                        >
                            <IconMapPin size={14} />
                            {isTracking ? `${currentDistance || 0}m (DWELLING)` : 'SIM GPS'}
                        </button>
                        <button onClick={onAddNew} className="bg-[#E2725B] text-white px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-md active:scale-95">
                            + ADD ITEM
                        </button>
                    </div>
                </div>
                {ghostCount > 0 && (
                    <div className="px-6 mt-2 mb-4 shrink-0 animate-in slide-in-from-top duration-500">
                        <button onClick={onOpenGhost} className="w-full p-3 rounded-2xl bg-[#EF4444] text-white shadow-md flex items-center justify-between active:scale-95 transition-transform">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-black text-[10px] shadow-inner border border-white/10">{ghostCount}</div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-left">Incomplete Plates Waiting</span>
                            </div>
                            <IconPencil size={16} />
                        </button>
                    </div>
                )}
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-6 shrink-0 mb-2">
                    {availableAvatars.map(av => {
                        const isActive = activeAvatars.includes(av.id);
                        return (
                            <button key={av.id} onClick={() => onToggleAvatar(av.id)} className="flex flex-col items-center gap-1 shrink-0 active:scale-90 transition-transform">
                                <div className={`w-14 h-14 rounded-full border-2 p-0.5 transition-all duration-300 ${isActive ? 'border-[#EF4444]' : 'border-transparent grayscale opacity-30'}`}>
                                    {av.id === 'DOG' ? <div className="w-full h-full rounded-full border border-black/5 flex items-center justify-center bg-white shadow-inner overflow-hidden"><IconPawPrint className="text-black/80" size={38} /></div> : <img src={av.img} className="w-full h-full rounded-full object-cover" alt="u" />}
                                </div>
                                <span className={`text-[10px] font-black uppercase ${isActive ? 'opacity-100 text-[#1A1A1A]' : 'opacity-30'}`}>{av.id}</span>
                            </button>
                        );
                    })}
                    <button onClick={() => { const names = onAddAvatar(); if (names?.length) onToggleAvatar(names[0]); }} className="flex flex-col items-center gap-1 shrink-0 active:scale-90 transition-transform">
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center bg-white/30 text-black/40">
                            <IconPlus size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase opacity-40">Add</span>
                    </button>
                </div>
                {/* SEARCH BOX IS ALWAYS VISIBLE */}
                <div className="px-6 mb-2 shrink-0">
                    <div className="flex items-center gap-3 bg-white/40 rounded-[2.5rem] border border-black/10 p-3 inner-fold shadow-inner transition-all focus-within:bg-white/60">
                        <textarea value={textTerm} onChange={e => setPantrySearch({ text: e.target.value, dates: [] })} placeholder={PROMPT_PANTRY} className="flex-grow bg-transparent border-none focus:ring-0 text-[13px] font-bold leading-tight h-[60px] w-full resize-none outline-none placeholder:text-black/30 pt-1" />
                        <div className="flex flex-col gap-2 justify-center h-[60px] items-center"><IconMicSpark /><IconSearchGreen /></div>
                    </div>
                </div>

                {dateFilters.length > 0 ? (
                    <div className="px-6 mb-3 shrink-0 flex flex-col gap-3">
                        <button onClick={() => setPantrySearch({ text: '', dates: [] })} className="flex items-center gap-2 text-black/40 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">
                            <IconX size={16} /> CLEAR CALENDAR FILTER
                        </button>
                        <button onClick={onOpenCalendar} className="w-full bg-white/60 rounded-2xl p-4 border border-[#E2725B]/20 shadow-sm flex items-center justify-between active:scale-95 transition-transform text-left">
                            <div className="flex flex-col">
                                <span className="text-[#E2725B] font-black italic text-[14px]">Viewing History</span>
                                <span className="text-black/60 font-bold text-[10px] uppercase tracking-widest">
                                    {dateFilters.length === 1
                                        ? new Date(dateFilters[0] + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                                        : `${dateFilters.length} Selected Dates`}
                                </span>
                            </div>
                            <IconCalendar size={24} className="text-[#E2725B]/40" />
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center px-6 mb-2 shrink-0 uppercase tracking-widest"><button onClick={onOpenCalendar} className="w-[240px] bg-white rounded-[1.5rem] py-2.5 border border-black/10 shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all text-[#1A1A1A]"><IconCalendar size={18} /><span className="text-[12px] font-black uppercase tracking-[0.2em]">SHOW RECENT DATES</span><IconChevronDown /></button></div>
                )}

                {taggedIds.length > 0 && (
                    <div className="flex justify-center pt-0 pb-3">
                        <button onClick={onCompare} className="pointer-events-auto bg-[#E2725B] text-white px-8 py-2.5 rounded-full shadow-md border border-white/20 active:scale-95 transition-transform flex items-center justify-center gap-2 font-black italic tracking-widest text-[11px] uppercase">
                            <IconSparkles size={14} /> COMPARE {taggedIds.length} PLATES
                        </button>
                    </div>
                )}
            </div>

            {/* SCROLLABLE CARDS SECTION */}
            <div className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-48 relative z-0">
                {heldMeals.length > 0 && (
                    <ChronoSection title="HELD PLATES" meals={heldMeals} onOpenCard={onOpenCard} availableAvatars={availableAvatars} taggedIds={taggedIds} onToggleTag={onToggleTag} />
                )}

                {bucketedMeals.isMultiDate ? (
                    <>
                        {Object.entries(bucketedMeals.dateBuckets).map(([date, meals]) => (
                            <ChronoSection key={date} title={`Pantry Plates found ${new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`} meals={meals} onOpenCard={onOpenCard} availableAvatars={availableAvatars} taggedIds={taggedIds} onToggleTag={onToggleTag} />
                        ))}
                    </>
                ) : bucketedMeals.isSearch ? (
                    <ChronoSection title="SEARCH RESULTS" meals={bucketedMeals.searchResults} onOpenCard={onOpenCard} availableAvatars={availableAvatars} taggedIds={taggedIds} onToggleTag={onToggleTag} />
                ) : (
                    <>
                        <ChronoSection title="TODAY" meals={bucketedMeals.today} onOpenCard={onOpenCard} availableAvatars={availableAvatars} taggedIds={taggedIds} onToggleTag={onToggleTag} />
                        <ChronoSection title="YESTERDAY" meals={bucketedMeals.yesterday} onOpenCard={onOpenCard} availableAvatars={availableAvatars} taggedIds={taggedIds} onToggleTag={onToggleTag} />
                        <ChronoSection title="LAST 7 DAYS" meals={bucketedMeals.last7Days} onOpenCard={onOpenCard} availableAvatars={availableAvatars} taggedIds={taggedIds} onToggleTag={onToggleTag} />
                        <ChronoSection title="LAST 14 DAYS" meals={bucketedMeals.last14Days} onOpenCard={onOpenCard} availableAvatars={availableAvatars} taggedIds={taggedIds} onToggleTag={onToggleTag} />
                    </>
                )}
                <div className="pb-24 text-center px-10 shrink-0 uppercase tracking-widest"><button onClick={onOpenCalendar} className="group flex flex-col items-center gap-2 w-full active:scale-95 transition-transform"><div className="w-full h-px bg-black/5 mb-4" /><span className="text-[10px] font-black text-black/20 group-hover:text-[#E2725B] transition-colors italic">Select from History</span><IconCalendar size={18} className="text-black/10 group-hover:text-[#E2725B] transition-colors" /></button></div>

            </div>
        </div>
    );
};
