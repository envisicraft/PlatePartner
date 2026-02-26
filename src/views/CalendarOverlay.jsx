import React, { useState } from 'react';
import { IconX, IconChevronDown, IconChevronLeft, IconChevronRight, IconSearchGreen } from '../Icons';
import { CUISINE_MAP, MONTHS, PARCHMENT_BG } from './Shared';

export function CalendarOverlay({
    isOpen,
    isPlateEditorOpen,
    currentViewDate,
    setCurrentViewDate,
    calendarInfo,
    currentMonthPrefix,
    ratedMeals,
    activeAvatars,
    taggedIds,
    bucketedMeals,
    pantrySearch,
    setPantrySearch,
    view,
    setView,
    getPillsForDate,
    onClose,
    onDateSelect,
}) {
    const [draftSelectedDates, setDraftSelectedDates] = useState([]);
    const [touchStartX, setTouchStartX] = useState(null);

    const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 50) {
            setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
        } else if (diff < -50) {
            setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
        }
        setTouchStartX(null);
    };

    const parchmentBg = PARCHMENT_BG;

    return (
        <div className={`absolute inset-0 z-[1200] flex flex-col justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-[600ms] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => { onClose(); setDraftSelectedDates([]); }} />
            <div className={`relative w-full max-h-[90%] overflow-y-auto no-scrollbar bg-[#E8D4A9] rounded-t-[3rem] p-6 pt-10 pb-40 shadow-2xl transform transition-transform duration-[600ms] ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} style={parchmentBg}>
                <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6 absolute top-4 left-1/2 -translate-x-1/2" />
                <button onClick={() => { onClose(); setDraftSelectedDates([]); }} className="absolute top-6 right-6 p-2 bg-black/5 text-black/60 rounded-full active:scale-95 transition-transform z-20"><IconX size={20} /></button>

                {/* CALENDAR LEDGER */}
                <div className="grid grid-cols-2 gap-y-2 mb-6 px-2 border-b border-black/5 pb-4">
                    {(() => {
                        const monthMeals = ratedMeals.filter(m => m.date.startsWith(currentMonthPrefix) && m.primaryStyle);
                        const activeStyles = new Set(monthMeals.map(m => m.primaryStyle));
                        const hasHomeMeals = monthMeals.some(m => m.place?.toLowerCase() === 'home');
                        const entries = Object.entries(CUISINE_MAP).filter(([style]) => activeStyles.has(style)).map(([style, color]) => (
                            <div key={style} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <span className="text-[8px] font-black uppercase tracking-widest text-black/60 truncate">{style}</span>
                            </div>
                        ));
                        if (hasHomeMeals) {
                            entries.push(
                                <div key="__HOME__" className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'white', boxShadow: '0 0 0 1px rgba(0,0,0,0.2)' }} />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-black/60 truncate">Home</span>
                                </div>
                            );
                        }
                        return entries;
                    })()}
                </div>

                <div className="flex justify-between items-center mb-6 px-6 relative">
                    <button onClick={() => setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))} className="p-3 bg-black/5 rounded-full active:scale-95 transition-transform"><IconChevronLeft size={20} /></button>
                    <div className="absolute left-1/2 -translate-x-1/2 group flex flex-col items-center">
                        <select
                            value={`${calendarInfo.year}-${currentViewDate.getMonth()}`}
                            onChange={(e) => {
                                const [y, m] = e.target.value.split('-');
                                setCurrentViewDate(new Date(parseInt(y), parseInt(m)));
                            }}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        >
                            {Array.from({ length: 120 }).map((_, i) => {
                                const d = new Date(2026, 1);
                                d.setMonth(d.getMonth() - i);
                                return (
                                    <option key={i} value={`${d.getFullYear()}-${d.getMonth()}`}>
                                        {MONTHS[d.getMonth()]} {d.getFullYear()}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="flex flex-col items-center justify-center text-center group-hover:opacity-60 transition-opacity">
                            <h3 className="text-2xl font-black italic text-[#1A1A1A] leading-[1.1] uppercase tracking-widest text-center flex flex-col items-center mt-3">
                                <span>{calendarInfo.monthName}</span>
                                <span>{calendarInfo.year}</span>
                            </h3>
                            <IconChevronDown size={14} className="text-black/60 mt-1" />
                            <button onClick={(e) => { e.stopPropagation(); setCurrentViewDate(new Date()); }} className="text-[9px] font-black uppercase text-black/50 mt-1.5 active:scale-95 bg-black/5 px-3 py-1 rounded-full tracking-widest border border-black/10 hover:bg-black/10 transition-colors pointer-events-auto relative z-20">JUMP TO TODAY</button>
                        </div>
                    </div>
                    <button onClick={() => setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))} className="p-3 bg-black/5 rounded-full active:scale-95 transition-transform"><IconChevronRight size={20} /></button>
                </div>

                <div className="h-4 w-full shrink-0" /> {/* Extra spacing for Jump To Today */}

                <div className="grid grid-cols-7 gap-x-1 gap-y-0 px-2 mb-6 text-center" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[9px] font-black text-black/30 mb-2">{d}</div>)}
                    {[...Array(calendarInfo.startDay)].map((_, i) => <div key={i} className="border-t border-black/10 min-h-[46px]" />)}
                    {[...Array(calendarInfo.daysInMonth)].map((_, i) => {
                        const styles = getPillsForDate(i + 1);
                        const clickedDate = `${currentMonthPrefix}-${String(i + 1).padStart(2, '0')}`;
                        const fd = draftSelectedDates.includes(clickedDate);
                        return (
                            <button key={i} onClick={() => {
                                if (isPlateEditorOpen) {
                                    onDateSelect(clickedDate);
                                    onClose();
                                } else {
                                    setDraftSelectedDates(prev => prev.includes(clickedDate) ? prev.filter(d => d !== clickedDate) : [...prev, clickedDate]);
                                }
                            }} className={`min-h-[46px] flex flex-col relative overflow-hidden items-center justify-start transition-colors border-t border-black/10 rounded-sm ${fd ? 'bg-[#E2725B]/20 border-[#E2725B]/40 ring-1 ring-[#E2725B] z-10' : 'hover:bg-black/5'}`}>
                                <span className={`relative z-10 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full mt-1 shrink-0 ${fd ? 'bg-[#E2725B] text-white' : (styles.length > 0 ? 'bg-black/5 text-black/70' : 'text-black/70')}`}>
                                    {i + 1}
                                </span>
                                <div className="flex-1 w-full flex flex-col mt-0.5 pb-0.5 min-h-0 gap-[1px]">
                                    {styles.map((s, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-1 w-full min-h-[7px]"
                                            style={{
                                                backgroundColor: CUISINE_MAP[s.style] || '#000',
                                                backgroundImage: [
                                                    s.isHome ? 'linear-gradient(to right, white 15%, transparent 15%)' : null,
                                                    s.hasStripe ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 2px, transparent 2px, transparent 6px)' : null
                                                ].filter(Boolean).join(', ') || 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {!isPlateEditorOpen && draftSelectedDates.length > 0 && (
                    <div className="px-6 pt-2 pb-1 flex flex-col items-center">
                        <button onClick={() => {
                            if (view !== 'pantry') setView('pantry');
                            setPantrySearch({ ...pantrySearch, dates: draftSelectedDates, timeframe: 'dates' });
                            onClose();
                            setDraftSelectedDates([]);
                        }} className="bg-[#E2725B] shadow-md text-white font-black italic tracking-wider text-[9px] uppercase w-full max-w-sm py-1.5 rounded-[2rem] border-2 border-white/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <IconSearchGreen size={10} className="text-white" /> PRESS MORE DATES OR SEARCH NOW ({draftSelectedDates.length})
                        </button>
                        <button onClick={() => setDraftSelectedDates([])} className="text-[9px] font-black uppercase text-black/40 mt-2 tracking-widest bg-white/40 px-2.5 py-0.5 rounded-full border border-black/5">Clear Draft Selection</button>
                    </div>
                )}

                {!isPlateEditorOpen && draftSelectedDates.length === 0 && (pantrySearch.dates?.length > 0 || pantrySearch.timeframe === 'custom') && (
                    <div className="sticky bottom-4 left-0 right-0 px-6 z-20 animate-in fade-in flex flex-col items-center">
                        <button onClick={() => {
                            setPantrySearch({ ...pantrySearch, dates: [], timeframe: 'any', customStartDate: '', customEndDate: '' });
                        }} className="bg-white/80 backdrop-blur-md shadow-xl text-[#1A1A1A] font-black italic tracking-widest text-[11px] uppercase w-full py-3.5 rounded-[2rem] border border-black/10 active:scale-95 transition-transform flex items-center justify-center gap-2 text-center pointer-events-auto">
                            <IconX size={14} className="text-[#EF4444]" /> CLEAR ACTIVE CALENDAR FILTERS
                        </button>
                    </div>
                )}

                <div className="mt-4 border-t border-black/5 pt-6 pb-2 px-2">
                    <h3 className="text-[12px] font-black italic tracking-widest uppercase text-center mb-6 text-black/40">Monthly Style Totals</h3>
                    {(() => {
                        const monthlyMeals = ratedMeals.filter(m => m.date.startsWith(currentMonthPrefix) && m.primaryStyle);
                        const totalCount = monthlyMeals.length;

                        if (totalCount === 0) return <div className="text-center text-[10px] uppercase font-black text-black/30">No data for this month</div>;

                        const stats = monthlyMeals.reduce((acc, m) => {
                            if (!acc[m.primaryStyle]) acc[m.primaryStyle] = { total: 0, home: 0 };
                            acc[m.primaryStyle].total += 1;
                            if (m.place?.toLowerCase() === 'home') acc[m.primaryStyle].home += 1;
                            return acc;
                        }, {});

                        const sortedStats = Object.entries(stats).sort((a, b) => {
                            if (b[1].total !== a[1].total) return b[1].total - a[1].total;
                            const aLatest = monthlyMeals.filter(m => m.primaryStyle === a[0]).sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date;
                            const bLatest = monthlyMeals.filter(m => m.primaryStyle === b[0]).sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date;
                            if (aLatest && bLatest && aLatest !== bLatest) return new Date(bLatest) - new Date(aLatest);
                            return a[0].localeCompare(b[0]);
                        });

                        // Count total home meals across all styles
                        const totalHomeMeals = monthlyMeals.filter(m => m.place?.toLowerCase() === 'home').length;

                        // Build final ranked list including a Home aggregate row
                        const rankedList = sortedStats.map(([style, { total: count, home: homeCount }]) => ({
                            key: style,
                            label: style,
                            count,
                            homeCount,
                            percentage: Math.round((count / totalCount) * 100),
                            color: CUISINE_MAP[style] || '#000',
                            isHomeRow: false
                        }));

                        // Insert the Home row at the correct rank position based on its percentage
                        if (totalHomeMeals > 0) {
                            const homePercentage = Math.round((totalHomeMeals / totalCount) * 100);
                            const homeRow = {
                                key: '__HOME__',
                                label: 'Home',
                                count: totalHomeMeals,
                                homeCount: totalHomeMeals,
                                percentage: homePercentage,
                                color: 'white',
                                isHomeRow: true
                            };
                            // Find insertion position based on count ranking
                            const insertIdx = rankedList.findIndex(r => totalHomeMeals > r.count);
                            if (insertIdx === -1) {
                                rankedList.push(homeRow);
                            } else {
                                rankedList.splice(insertIdx, 0, homeRow);
                            }
                        }

                        return (
                            <div className="flex flex-col gap-3 px-2">
                                {rankedList.map((row) => (
                                    <div key={row.key} className="flex items-center gap-3 w-full">
                                        <span className="w-32 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] truncate text-left shrink-0"><span className="text-[#E2725B]">({row.count})</span> {row.label}</span>
                                        <div className="w-1/2 h-3 bg-black/5 border border-black/5 rounded-full overflow-hidden flex items-center shadow-inner relative mr-auto">
                                            <div
                                                className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-[1000ms] ease-out border border-black/10 shadow-sm"
                                                style={{
                                                    width: `${row.percentage}%`,
                                                    backgroundColor: row.color,
                                                    ...(row.isHomeRow ? { borderColor: 'rgba(0,0,0,0.15)' } : {}),
                                                    ...(!row.isHomeRow && row.homeCount > 0 ? {
                                                        backgroundImage: `linear-gradient(to right, white 15%, ${row.color} 15%)`
                                                    } : {})
                                                }}
                                            />
                                        </div>
                                        <span className="w-8 text-[10px] font-black text-right text-black/60 shrink-0">{row.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
                <div className="h-24 w-full shrink-0 pointer-events-none" /> {/* Forces scroll clearing for sticky buttons */}
            </div>
        </div>
    );
}
