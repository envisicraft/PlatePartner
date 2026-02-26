import React, { useState } from 'react';
import { IconX, IconCalendar, IconPawPrint, IconStar } from '../Icons';
import { MASTER_CATEGORIES, CUISINE_MAP } from './Shared';
import { ParchmentDatePicker } from './ParchmentDatePicker';

export const FilterModalView = ({ isOpen, searchState, onApply, onClose, availableStylesInPantry, availableAvatars, activeAvatars, setActiveAvatars, onOpenCalendar }) => {
    // Provide a default schema if empty
    const currentSearch = {
        text: searchState?.text || '',
        dates: searchState?.dates || [],
        timeframe: searchState?.timeframe || 'any',
        minRating: searchState?.minRating || 0,
        sortBy: searchState?.sortBy || 'NEWEST',
        locationFilter: searchState?.locationFilter || 'ALL',
        closestOnly: searchState?.closestOnly || false,
        petFriendlyOnly: searchState?.petFriendlyOnly || false,
        selectedStyles: searchState?.selectedStyles || [],
        customStartDate: searchState?.customStartDate || '',
        customEndDate: searchState?.customEndDate || ''
    };

    const parchmentBg = { backgroundColor: '#E8D4A9', backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' };

    const [draft, setDraft] = useState(currentSearch);

    const SORT_OPTIONS = [
        { id: 'NEWEST', label: 'Newest First' },
        { id: 'OLDEST', label: 'Oldest First' },
        { id: 'HIGH_RATE_PLATE', label: 'Highest Rated Plate' },
        { id: 'HIGH_RATE_PLACE', label: 'Highest Rated Place' }
    ];

    const LOC_OPTIONS = [
        { id: 'ALL', label: 'ANYWHERE' },
        { id: 'RESTAURANT', label: 'RESTAURANTS' },
        { id: 'HOME', label: 'HOME' }
    ];

    const toggleStyle = (styleId) => {
        setDraft(prev => {
            const has = prev.selectedStyles.includes(styleId);
            return {
                ...prev,
                selectedStyles: has ? prev.selectedStyles.filter(s => s !== styleId) : [...prev.selectedStyles, styleId]
            };
        });
    };

    const countActiveFilters = () => {
        let n = 0;
        if (draft.sortBy !== 'NEWEST') n++;
        if (draft.locationFilter !== 'ALL') n++;
        if (draft.closestOnly) n++;
        if (draft.petFriendlyOnly) n++;
        if (draft.timeframe !== 'any') n++;
        if (draft.minRating > 0) n++;
        if (draft.selectedStyles.length > 0) n += draft.selectedStyles.length;
        if (draft.dates.length > 0) n += draft.dates.length;
        if (draft.timeframe === 'custom' && (draft.customStartDate || draft.customEndDate)) n++;
        return n;
    };

    const TIMEFRAMES = [
        { id: 'any', label: 'ANY TIME' },
        { id: '30d', label: '30 DAYS' },
        { id: '3m', label: '3 MONTHS' },
        { id: '1y', label: 'PAST YEAR' },
        { id: 'custom', label: 'CUSTOM RANGE' }
    ];

    const RATINGS = [
        { id: 0, label: 'ANY', desc: 'ANY' },
        { id: 3, label: '3+ STARS' },
        { id: 4, label: '4+ STARS' },
        { id: 5, label: '5 ONLY' }
    ];

    return (
        <div className={`absolute inset-0 z-[1200] flex flex-col justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-[600ms] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <div className={`relative w-full h-[85vh] bg-[#E8D4A9] parchment-root rounded-t-[3rem] shadow-2xl flex flex-col pointer-events-auto overflow-hidden transform transition-transform duration-[600ms] ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Modal Drawer Handle */}
                <div className="w-full flex justify-center pt-4 pb-2 bg-transparent shrink-0">
                    <div onClick={onClose} className="w-12 h-1.5 bg-black/20 rounded-full cursor-pointer hover:bg-black/30 transition-colors" />
                </div>

                {/* Modal Header */}
                <div className="px-6 pt-2 pb-6 flex justify-between items-center shrink-0">
                    <h2 className="text-3xl font-black italic tracking-tighter text-[#1A1A1A]">Filter & Sort Pantry</h2>
                    <button onClick={onClose} className="p-2 bg-black/5 hover:bg-black/10 rounded-full active:scale-90 transition-colors"><IconX size={16} /></button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pb-32">
                    {/* AVATARS */}
                    <div>
                        <h4 className="text-[10px] font-black text-black/40 mb-2.5 uppercase tracking-widest">Filter by Diner</h4>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
                            {availableAvatars?.map((m) => {
                                const isActive = activeAvatars.includes(m.id);
                                return (
                                    <button
                                        key={`filter-av-${m.id}`}
                                        onClick={() => {
                                            setActiveAvatars(prev => prev.includes(m.id) && prev.length > 1 ? prev.filter(a => a !== m.id) : prev.includes(m.id) ? prev : [...prev, m.id]);
                                        }}
                                        className="flex flex-col items-center gap-1.5 group shrink-0"
                                    >
                                        <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 shadow-md ${isActive ? 'bg-[#E2725B] border-2 border-white/60 scale-105' : 'bg-white/40 border border-black/10 opacity-50 grayscale'}`}>
                                            {m.img ? (
                                                <img src={m.img} alt={m.id} className="w-full h-full object-cover" />
                                            ) : m.id === 'DOG' ? (
                                                <IconPawPrint size={20} className={isActive ? "text-white" : "text-black/30"} />
                                            ) : (
                                                <span className={`text-[12px] font-black uppercase ${isActive ? 'text-white' : 'text-black/40'}`}>{m.id}</span>
                                            )}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-tighter transition-opacity ${isActive ? 'opacity-100 text-[#1A1A1A]' : 'opacity-40 text-black'}`}>{m.id}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SORTING */}
                    <div>
                        <h4 className="text-[10px] font-black text-black/40 mb-2.5 uppercase tracking-widest">Sort Pantry By</h4>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setDraft({ ...draft, sortBy: 'NEWEST' })} className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${draft.sortBy === 'NEWEST' ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-[#1A1A1A] active:scale-95'}`}>Newest</button>
                            <button onClick={() => setDraft({ ...draft, sortBy: 'HIGH_RATE_PLATE' })} className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${draft.sortBy === 'HIGH_RATE_PLATE' ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-[#1A1A1A] active:scale-95'}`}>By Rating</button>
                        </div>
                    </div>

                    {/* LOCATIONS */}
                    <div>
                        <h4 className="text-[10px] font-black text-black/40 mb-2.5 uppercase tracking-widest">Location</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {LOC_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => {
                                    const newDraft = { ...draft, locationFilter: opt.id };
                                    if (opt.id === 'HOME') newDraft.closestOnly = false; // Reset closest if home is selected
                                    setDraft(newDraft);
                                }} className={`py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${draft.locationFilter === opt.id ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-black/60 active:scale-95'}`}>{opt.label}</button>
                            ))}
                        </div>
                        {/* CLOSEST TOGGLE - Only meaningful for restaurants/anywhere */}
                        <div className={`mt-3 transition-opacity duration-300 ${draft.locationFilter === 'HOME' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                            <button disabled={draft.locationFilter === 'HOME'} onClick={() => setDraft({ ...draft, closestOnly: !draft.closestOnly })} className={`w-full py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${draft.closestOnly ? 'bg-white border-[#4F7942] text-[#4F7942] shadow-sm' : 'bg-transparent border-black/10 text-black/60 active:scale-95'}`}>
                                Closest to My Location
                            </button>
                        </div>
                    </div>

                    {/* TIMEFRAME */}
                    <div>
                        <h4 className="text-[10px] font-black text-black/40 mb-2.5 uppercase tracking-widest">Timeframe</h4>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <button onClick={() => setDraft({ ...draft, timeframe: 'any' })} className={`flex-[1.5] py-3.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center truncate ${draft.timeframe === 'any' ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-[#1A1A1A] active:scale-95'}`}>
                                    ANY TIME
                                </button>
                                <button onClick={() => setDraft({ ...draft, timeframe: '30d' })} className={`flex-1 py-3.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center truncate ${draft.timeframe === '30d' ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-[#1A1A1A] active:scale-95'}`}>
                                    30 DAYS
                                </button>
                                <button onClick={() => setDraft({ ...draft, timeframe: '3m' })} className={`flex-1 py-3.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center truncate ${draft.timeframe === '3m' ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-[#1A1A1A] active:scale-95'}`}>
                                    3 MONTHS
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setDraft({ ...draft, timeframe: '1y' })} className={`flex-1 py-3.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center truncate ${draft.timeframe === '1y' ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-[#1A1A1A] active:scale-95'}`}>
                                    PAST YEAR
                                </button>
                                <button onClick={() => setDraft({ ...draft, timeframe: 'custom' })} className={`flex-1 py-3.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center truncate ${draft.timeframe === 'custom' ? 'bg-[#4F7942] text-white shadow-md' : 'bg-white/40 border border-black/10 text-[#1A1A1A] active:scale-95'}`}>
                                    CUSTOM RANGE
                                </button>
                            </div>
                            {draft.timeframe === 'custom' && (
                                <div className="date-range-enter grid grid-cols-2 gap-3">
                                    <ParchmentDatePicker
                                        value={draft.customStartDate}
                                        label="Start Date"
                                        onChange={val => setDraft({ ...draft, customStartDate: val })}
                                    />
                                    <ParchmentDatePicker
                                        value={draft.customEndDate}
                                        label="End Date"
                                        onChange={val => setDraft({ ...draft, customEndDate: val })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FILTER BY RATING */}
                    <div>
                        <h4 className="text-[10px] font-black text-black/40 mb-2.5 uppercase tracking-widest">Filter by Rating</h4>
                        <div className="grid grid-cols-4 gap-2">
                            {RATINGS.map((r) => {
                                const isSelected = draft.minRating === r.id;
                                return (
                                    <button key={r.id} onClick={() => setDraft({ ...draft, minRating: r.id })} className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${isSelected ? 'bg-[#4F7942] text-white shadow-md border-transparent' : 'bg-white/40 border border-black/10 hover:bg-white/60 text-[#1A1A1A]'}`}>
                                        {r.id === 0 ? (
                                            <div className="w-5 h-5 rounded-full border-[2.5px] border-dashed border-white/80" />
                                        ) : (
                                            <IconStar size={20} fill="currentColor" className={isSelected ? 'text-white' : 'text-black/30'} />
                                        )}
                                        <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-1">{r.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* PET FRIENDLY */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setDraft({ ...draft, petFriendlyOnly: !draft.petFriendlyOnly })} className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${draft.petFriendlyOnly ? 'bg-[#92400E] text-white shadow-md' : 'bg-white/40 border border-black/10 text-black/60 active:scale-95'}`}>
                            <IconPawPrint size={14} />
                            Pet Friendly Only
                        </button>
                    </div>

                    {/* CUISINE STYLE */}
                    <div>
                        <h4 className="text-[10px] font-black text-black/40 mb-2.5 uppercase tracking-widest">Cuisine Style</h4>
                        <div className="grid grid-cols-2 gap-2 pb-8">
                            {availableStylesInPantry && availableStylesInPantry.map(styleId => {
                                const isSelected = draft.selectedStyles.includes(styleId);
                                // Find the color for this style from CUISINE_MAP
                                const dotColor = CUISINE_MAP[styleId] || '#000';

                                return (
                                    <button key={styleId} onClick={() => toggleStyle(styleId)} className={`py-3 px-3 rounded-[1rem] flex items-center justify-start gap-2.5 transition-all active:scale-95 overflow-hidden border ${isSelected ? 'bg-[#4F7942] shadow-md border-transparent text-white' : 'bg-white/40 text-[#1A1A1A] border-black/10'}`}>
                                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSelected ? 'border border-white/40' : ''}`} style={{ backgroundColor: dotColor }}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest truncate ${isSelected ? 'text-white' : ''}`}>{styleId}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* FIXED FOOTER WITH GRADIENT */}
                <div className="absolute inset-x-0 bottom-0 h-[120px] pointer-events-none flex flex-col justify-end px-6 pb-6 z-[200]">
                    {/* GRADIENT MASK on Parchment */}
                    <div className="absolute inset-0 pointer-events-none -z-10" style={{ ...parchmentBg, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 45%, black 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 45%, black 100%)' }} />
                    <div className="flex gap-4 pointer-events-auto relative z-10">
                        <button onClick={() => {
                            setDraft({ text: currentSearch.text, dates: [], timeframe: 'any', minRating: 0, sortBy: 'NEWEST', locationFilter: 'ALL', closestOnly: false, petFriendlyOnly: false, selectedStyles: [] });
                            if (availableAvatars && availableAvatars.length > 0) {
                                setActiveAvatars([availableAvatars[0].id]);
                            }
                        }} className="flex-1 py-4 rounded-full bg-white/40 border border-black/10 text-[#1A1A1A] text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                            Reset All
                        </button>
                        <button onClick={() => onApply(draft)} className="flex-1 py-4 rounded-full bg-[#E2725B] text-white text-[12px] font-black uppercase tracking-widest shadow-[0_4px_12px_-2px_rgba(226,114,91,0.5)] active:scale-95 transition-all flex justify-center items-center gap-2 border border-white/20">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
