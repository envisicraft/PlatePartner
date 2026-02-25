import React, { useState, useMemo, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getAllPlates, savePlate, deletePlate } from './logic/db';
import { seedDatabase } from './logic/seed';
import { syncVaultToCloud } from './logic/syncEngine';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from './firebase';
import { HomeView, PantryView, YourPlateView, LoginView, CompareView, LocationModalView } from './Views';
import { IconHome, IconCalendar, IconCamera, IconFilter, IconMenu, IconPencil, IconX, IconChevronDown, IconChevronLeft, IconChevronRight, IconSearchGreen } from './Icons';

const CUISINE_MAP = { "American": "#3B82F6", "Italian": "#22C55E", "Mexican": "#EA580C", "Healthy": "#84CC16", "Asian": "#EF4444", "Seafood": "#06B6D4", "Burger": "#F97316", "Indian": "#D97706", "Fast Food": "#CA8A04", "Sandwiches": "#92400E", "Cafe & Dessert": "#EC4899", "Bakery": "#FBBF24", "Bar/Pub": "#7C3AED", "Breakfast/Brunch": "#FDE047", "Coffee/Tea": "#A8A29E", "Dessert": "#F472B6", "French": "#9333EA", "Mediterranean": "#14B8A6", "Pizza": "#B91C1C", "Salad": "#4ADE80", "Steakhouse": "#7F1D1D", "Vegan/Veg": "#10B981" };
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export default function App() {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [view, setView] = useState('home');
    const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 1));
    const [touchStartX, setTouchStartX] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
    const [isPlateEditorOpen, setIsPlateEditorOpen] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [locationCard, setLocationCard] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [lastView, setLastView] = useState('home');
    const [pantrySearch, setPantrySearch] = useState({ text: '', dates: [] });
    const [draftSelectedDates, setDraftSelectedDates] = useState([]);
    const [activeAvatars, setActiveAvatars] = useState(['JD']);
    const [compareCards, setCompareCards] = useState([]);
    const [taggedIds, setTaggedIds] = useState([]);


    const [avatars, setAvatars] = useState([
        { id: 'JD', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', weight: 0 },
        { id: 'SM', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', weight: 50 },
        { id: 'DOG', img: '', weight: 100 }
    ]);

    const sortedAvatars = useMemo(() => [...avatars].sort((a, b) => a.weight - b.weight), [avatars]);

    useEffect(() => {
        seedDatabase();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
        });

        // The Data Connect Bridge: Poll local Dexie every 10 seconds for offline logs
        const syncInterval = setInterval(syncVaultToCloud, 10000);
        return () => {
            clearInterval(syncInterval);
            unsubscribe();
        };
    }, []);

    const handleLogin = async (providerName) => {
        try {
            if (providerName === 'google') {
                await signInWithPopup(auth, googleProvider);
            } else if (providerName === 'apple') {
                await signInWithPopup(auth, appleProvider);
            } else if (providerName === 'email') {
                alert("Email authentication flow will be implemented shortly.");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleDummyLogin = () => {
        setUser({ uid: 'developer-bypass-123', displayName: 'Developer JD', email: 'dev@platepartner.app' });
    };

    const meals = useLiveQuery(() => getAllPlates()) || [];

    const ratedMeals = useMemo(() => meals.filter(m => m.rating > 0 && !m.isGhost), [meals]);
    const ghostCount = useMemo(() => meals.filter(m => m.rating === 0 || m.isGhost).length, [meals]);
    const pendingMeals = useMemo(() => meals.filter(m => m.rating === 0 || m.isGhost).sort((a, b) => new Date(a.date) - new Date(b.date)), [meals]);

    const handleOpenGhost = () => {
        setActiveCard('resolve_ghosts');
        setIsPlateEditorOpen(true);
    };

    const calendarInfo = useMemo(() => {
        const y = currentViewDate.getFullYear();
        const m = currentViewDate.getMonth();
        return {
            monthName: MONTHS[m],
            year: y,
            daysInMonth: new Date(y, m + 1, 0).getDate(),
            startDay: new Date(y, m, 1).getDay()
        };
    }, [currentViewDate]);

    const currentMonthPrefix = `${calendarInfo.year}-${String(currentViewDate.getMonth() + 1).padStart(2, '0')}`;

    const bucketedMeals = useMemo(() => {
        const q = (pantrySearch?.text || '').toLowerCase();

        // Filter rated meals by active avatars FIRST
        const baseMeals = ratedMeals.filter(m => m.userIds?.some(aid => activeAvatars.includes(aid)));

        const defaultBuckets = {
            today: [], yesterday: [], last7Days: [], last14Days: [], searchResults: [], dateBuckets: {}
        };

        if (pantrySearch?.dates?.length > 0) {
            // Group the meals by each selected date
            [...pantrySearch.dates].sort().reverse().forEach(d => {
                defaultBuckets.dateBuckets[d] = baseMeals.filter(m => m.date === d);
            });
            return { ...defaultBuckets, isSearch: true, isMultiDate: true };
        }

        if (q) {
            defaultBuckets.searchResults = baseMeals.filter(m => {
                return m.dish?.toLowerCase().includes(q) ||
                    m.place?.toLowerCase().includes(q) ||
                    m.primaryStyle?.toLowerCase().includes(q) ||
                    m.notes?.toLowerCase().includes(q);
            });
            return { ...defaultBuckets, isSearch: true, isMultiDate: false };
        }

        return {
            ...defaultBuckets,
            isSearch: false,
            isMultiDate: false,
            today: baseMeals.filter(m => m.date === '2026-02-23'),
            yesterday: baseMeals.filter(m => m.date === '2026-02-22'),
            last7Days: baseMeals.filter(m => m.date < '2026-02-22' && m.date >= '2026-02-16'),
            last14Days: baseMeals.filter(m => m.date < '2026-02-16' && m.date >= '2026-02-09')
        };
    }, [ratedMeals, activeAvatars, pantrySearch]);

    const getPillsForDate = (day) => {
        const dateStr = `${currentMonthPrefix}-${String(day).padStart(2, '0')}`;

        // Determine which plates are currently visible in the Pantry based on search
        let visibleIds = new Set();
        if (bucketedMeals.isSearch && !bucketedMeals.isMultiDate) {
            bucketedMeals.searchResults.forEach(m => visibleIds.add(m.id));
        } else if (bucketedMeals.isMultiDate) {
            Object.values(bucketedMeals.dateBuckets).flat().forEach(m => visibleIds.add(m.id));
        } else {
            // Default views (Today, Yesterday, etc.) - everything is "visible" for calendar purposes unless we strictly enforce 14 days
            ratedMeals.forEach(m => visibleIds.add(m.id));
        }

        const isActivelyFiltering = bucketedMeals.isSearch;

        return ratedMeals
            .filter(m => m.date === dateStr && m.primaryStyle && m.userIds?.some(aid => activeAvatars.includes(aid)))
            .map(m => {
                const isVisible = visibleIds.has(m.id) || taggedIds.includes(m.id);
                return {
                    style: m.primaryStyle,
                    hasStripe: (isActivelyFiltering && isVisible) || taggedIds.includes(m.id)
                };
            });
    };

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

    const toggleTag = (id) => setTaggedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const handleAddAvatar = () => {
        const input = prompt("Enter names (e.g. Michele and Kelly)");
        if (!input) return [];
        const names = input.split(/,|and|&/).map(s => s.trim()).filter(Boolean);
        const newAvs = names.map(n => ({ id: n, img: `https://i.pravatar.cc/100?u=${n.toLowerCase()}`, weight: 50 }));
        setAvatars(prev => [...prev.filter(a => a.id !== 'DOG'), ...newAvs, prev.find(a => a.id === 'DOG')]);
        setActiveAvatars(prev => [...new Set([...prev, ...names])]);
        return names;
    };

    const parchmentBg = { backgroundColor: '#E8D4A9', backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' };

    return (
        <div className="w-full h-screen sm:p-4 bg-[#DBC8A0] flex items-center justify-center overflow-hidden font-sans">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .inner-fold { box-shadow: inset 2px 4px 12px rgba(0,0,0,0.1); }`}</style>

            {/* RESPONSIVE APP: Fullscreen on mobile, S23 Ultra layout on desktop */}
            <div className="w-full h-full sm:max-w-[412px] sm:max-h-[915px] sm:rounded-[2.5rem] overflow-hidden sm:shadow-2xl sm:border-[10px] sm:border-[#1A1A1A] relative flex flex-col" style={parchmentBg}>
                {/* S23 Ultra Hole-punch (Desktop Simulator Only) */}
                <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1A1A1A] rounded-full z-[1000] shadow-sm" />

                {isAuthLoading ? (
                    <div className="flex-1 flex items-center justify-center bg-[#E8D4A9]">
                        <div className="w-8 h-8 rounded-full border-4 border-[#E2725B] border-t-transparent animate-spin" />
                    </div>
                ) : !user ? (
                    <LoginView onLogin={handleLogin} onDummyLogin={handleDummyLogin} />
                ) : (
                    <div className="flex flex-col h-full bg-transparent pt-10">
                        <main className="flex-1 relative overflow-hidden">
                            {view === 'home' && <HomeView inputValue={inputValue} setInputValue={setInputValue} setView={setView} stats={{ totalFills: ratedMeals.length, fiveStars: ratedMeals.filter(m => m.rating === 5).length, userName: user?.displayName?.split(' ')[0] || 'Guest' }} recentMeals={ratedMeals.filter(m => m.userIds?.includes(sortedAvatars[0]?.id))} availableAvatars={sortedAvatars} onOpenCard={m => { setActiveCard(m); setIsPlateEditorOpen(true); }} onOpenMap={setLocationCard} onCompare={() => { setCompareCards(ratedMeals.filter(m => taggedIds.includes(m.id))); setLastView(view); setView('compare'); }} taggedIds={taggedIds} onToggleTag={toggleTag} />}
                            {view === 'pantry' && <PantryView heldMeals={ratedMeals.filter(m => taggedIds.includes(m.id))} bucketedMeals={bucketedMeals} activeAvatars={activeAvatars} availableAvatars={sortedAvatars} onToggleAvatar={id => setActiveAvatars(prev => prev.includes(id) ? (prev.length > 1 ? prev.filter(a => a !== id) : prev) : [...prev, id])} onAddAvatar={handleAddAvatar} onOpenCalendar={() => setIsCalendarOpen(true)} pantrySearch={pantrySearch} setPantrySearch={setPantrySearch} onOpenCard={m => { setActiveCard(m); setIsPlateEditorOpen(true); }} onOpenMap={setLocationCard} onAddNew={() => { setActiveCard(null); setIsPlateEditorOpen(true); }} onOpenGhost={handleOpenGhost} ghostCount={ghostCount} taggedIds={taggedIds} onToggleTag={toggleTag} onCompare={() => { setCompareCards(ratedMeals.filter(m => taggedIds.includes(m.id))); setLastView(view); setView('compare'); }} />}
                            {view === 'compare' && <CompareView deckCards={compareCards} onBack={setView} onOpenCard={m => { setActiveCard(m); setIsPlateEditorOpen(true); }} onOpenMap={setLocationCard} availableAvatars={sortedAvatars} />}
                        </main>

                        {/* DYNAMIC FOOTER LOGIC - ABSOLUTE TO FLOAT OVER CONTENT */}
                        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[500]">
                            {view === 'home' ? (
                                <footer className="h-[120px] flex items-end justify-around pb-8 relative pointer-events-none">
                                    {/* GRADIENT BACKDROP */}
                                    <div className="absolute inset-0 pointer-events-none -z-10" style={{ ...parchmentBg, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 10%, black 40%, black 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 10%, black 40%, black 100%)' }} />
                                    <button onClick={handleOpenGhost} className={`relative pointer-events-auto p-2 z-10 ${ghostCount > 0 ? 'text-[#EF4444] animate-pulse' : 'text-black/60 active:scale-90 transition-transform'}`}>
                                        {ghostCount > 0 && <div className="absolute top-0 right-0 bg-[#EF4444] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#E8D4A9]">{ghostCount}</div>}
                                        <IconPencil className="rotate-[-15deg]" size={28} />
                                    </button>
                                    <button className="pointer-events-auto p-2 text-black/60 z-10"><IconMenu size={32} /></button>
                                    <button onClick={() => { setActiveCard(null); setIsPlateEditorOpen(true); }} className="pointer-events-auto p-2 text-[#4F7942] active:scale-90 transition-transform z-10"><IconCamera size={32} /></button>
                                </footer>
                            ) : (
                                <footer className="h-[90px] flex items-end justify-around pb-5 relative pointer-events-none">
                                    {/* GRADIENT BACKDROP for PANTRY */}
                                    <div className="absolute inset-0 pointer-events-none -z-10" style={{ ...parchmentBg, WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)' }} />
                                    <button onClick={() => setView('home')} className="pointer-events-auto p-2 text-black/40 active:scale-90 transition-transform z-10"><IconHome size={24} /></button>
                                    <button onClick={() => setIsCalendarOpen(true)} className="pointer-events-auto p-2 text-black/40 z-10"><IconCalendar size={24} /></button>
                                    <button onClick={() => { setActiveCard(null); setIsPlateEditorOpen(true); }} className="pointer-events-auto p-2 text-black/40 z-10"><IconCamera size={24} /></button>
                                    <button onClick={() => setPantrySearch({ text: '', dates: [] })} className="pointer-events-auto p-2 text-black/40 z-10"><IconFilter size={24} /></button>
                                    <button className="pointer-events-auto p-2 text-black/40 z-10"><IconMenu size={24} /></button>
                                </footer>
                            )}
                        </div>
                    </div>
                )}

                {/* OVERLAYS */}
                <div className={`absolute inset-0 z-[1100] transform transition-transform duration-[600ms] ease-out ${isPlateEditorOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <YourPlateView activeCard={activeCard === 'resolve_ghosts' ? null : activeCard} pendingQueue={activeCard === 'resolve_ghosts' ? pendingMeals : []} calendarSelectedDate={calendarSelectedDate} onClose={() => setIsPlateEditorOpen(false)} onSave={async (d, consumedGhostId, hasMore) => { await savePlate(d); if (consumedGhostId) await deletePlate(consumedGhostId); if (!hasMore) setIsPlateEditorOpen(false); }} onDiscardGhost={async (ghostId, hasMore) => { await deletePlate(ghostId); if (!hasMore) setIsPlateEditorOpen(false); }} availableAvatars={sortedAvatars} onAddAvatar={handleAddAvatar} onOpenCalendar={() => setIsCalendarOpen(true)} cuisineMap={CUISINE_MAP} onOpenMap={setLocationCard} />
                </div>

                {locationCard && <LocationModalView locationCard={locationCard} onClose={() => setLocationCard(null)} availableAvatars={sortedAvatars} />}

                <div className={`absolute inset-0 z-[1200] flex flex-col justify-end ${isCalendarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-[600ms] ${isCalendarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCalendarOpen(false)} />
                    <div className={`relative w-full max-h-[90%] overflow-y-auto no-scrollbar bg-[#E8D4A9] rounded-t-[3rem] p-6 pb-12 shadow-2xl transform transition-transform duration-[600ms] ease-out ${isCalendarOpen ? 'translate-y-0' : 'translate-y-full'}`} style={parchmentBg}>
                        <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6" />
                        <button onClick={() => { setIsCalendarOpen(false); setDraftSelectedDates([]); }} className="absolute top-6 right-6 p-2 bg-black/5 text-black/60 rounded-full active:scale-95 transition-transform"><IconX size={20} /></button>

                        {/* CALENDAR LEDGER */}
                        <div className="grid grid-cols-2 gap-y-2 mb-6 px-2 border-b border-black/5 pb-4">
                            {(() => {
                                const activeStyles = new Set(ratedMeals.filter(m => m.date.startsWith(currentMonthPrefix) && m.primaryStyle).map(m => m.primaryStyle));
                                return Object.entries(CUISINE_MAP).filter(([style]) => activeStyles.has(style)).map(([style, color]) => (
                                    <div key={style} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-black/60 truncate">{style}</span>
                                    </div>
                                ));
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
                                </div>
                            </div>
                            <button onClick={() => setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))} className="p-3 bg-black/5 rounded-full active:scale-95 transition-transform"><IconChevronRight size={20} /></button>
                        </div>

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
                                            setCalendarSelectedDate({ date: clickedDate, ts: Date.now() });
                                            setIsCalendarOpen(false);
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
                                                        ...(s.hasStripe ? {
                                                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 2px, transparent 2px, transparent 6px)'
                                                        } : {})
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {!isPlateEditorOpen && draftSelectedDates.length > 0 && (
                            <div className="sticky bottom-4 left-0 right-0 px-6 z-20 animate-in slide-in-from-bottom flex flex-col items-center">
                                <button onClick={() => {
                                    if (view !== 'pantry') setView('pantry');
                                    setPantrySearch({ text: '', dates: draftSelectedDates });
                                    setIsCalendarOpen(false);
                                    setDraftSelectedDates([]);
                                }} className="bg-[#E2725B] shadow-xl text-white font-black italic tracking-widest text-[12px] uppercase w-full py-4 rounded-[2rem] border-2 border-white/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                                    <IconSearchGreen size={16} className="text-white" /> SEARCH {draftSelectedDates.length} DATES
                                </button>
                                <button onClick={() => setDraftSelectedDates([])} className="text-[10px] font-black uppercase text-black/40 mt-3 tracking-widest bg-white/40 px-3 py-1 rounded-full border border-black/5">Clear Selection</button>
                            </div>
                        )}

                        <div className="mt-4 border-t border-black/5 pt-6 pb-2 px-2">
                            <h3 className="text-[12px] font-black italic tracking-widest uppercase text-center mb-6 text-black/40">Monthly Style Totals</h3>
                            {(() => {
                                const monthlyMeals = ratedMeals.filter(m => m.date.startsWith(currentMonthPrefix) && m.primaryStyle);
                                const totalCount = monthlyMeals.length;

                                if (totalCount === 0) return <div className="text-center text-[10px] uppercase font-black text-black/30">No data for this month</div>;

                                const stats = monthlyMeals.reduce((acc, m) => {
                                    acc[m.primaryStyle] = (acc[m.primaryStyle] || 0) + 1;
                                    return acc;
                                }, {});

                                const sortedStats = Object.entries(stats).sort((a, b) => {
                                    if (b[1] !== a[1]) return b[1] - a[1];
                                    const aLatest = monthlyMeals.filter(m => m.primaryStyle === a[0]).sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date;
                                    const bLatest = monthlyMeals.filter(m => m.primaryStyle === b[0]).sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date;
                                    if (aLatest && bLatest && aLatest !== bLatest) return new Date(bLatest) - new Date(aLatest);
                                    return a[0].localeCompare(b[0]);
                                });

                                return (
                                    <div className="flex flex-col gap-3 px-2">
                                        {sortedStats.map(([style, count]) => {
                                            const percentage = Math.round((count / totalCount) * 100);
                                            return (
                                                <div key={style} className="flex items-center gap-3 w-full">
                                                    <span className="w-32 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] truncate text-left shrink-0"><span className="text-[#E2725B]">({count})</span> {style}</span>
                                                    <div className="w-1/2 h-3 bg-black/5 border border-black/5 rounded-full overflow-hidden flex items-center shadow-inner relative mr-auto">
                                                        <div className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-[1000ms] ease-out border border-black/10 shadow-sm" style={{ width: `${percentage}%`, backgroundColor: CUISINE_MAP[style] || '#000' }} />
                                                    </div>
                                                    <span className="w-8 text-[10px] font-black text-right text-black/60 shrink-0">{percentage}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}