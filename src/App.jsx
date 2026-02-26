import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getAllPlates, savePlate, deletePlate } from './logic/db';
import { useAuth } from './hooks/useAuth';
import { HomeView, PantryView, YourPlateView, LoginView, CompareView, LocationModalView } from './Views';
import { FilterModalView } from './views/FilterModalView';
import { CalendarOverlay } from './views/CalendarOverlay';
import { FooterNav } from './views/FooterNav';
import { CUISINE_MAP, MONTHS, PARCHMENT_BG } from './views/Shared';

export default function App() {
    const { user, isAuthLoading, handleLogin, handleDummyLogin } = useAuth();
    const [view, setView] = useState('home');
    const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 1));
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
    const [isPlateEditorOpen, setIsPlateEditorOpen] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [locationCard, setLocationCard] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [lastView, setLastView] = useState('home');
    const [pantrySearch, setPantrySearch] = useState({ text: '', dates: [] });
    const [activeAvatars, setActiveAvatars] = useState(['JD']);
    const [compareCards, setCompareCards] = useState([]);
    const [taggedIds, setTaggedIds] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [avatars, setAvatars] = useState([
        { id: 'JD', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', weight: 0 },
        { id: 'SM', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', weight: 50 },
        { id: 'DOG', img: '', weight: 100 }
    ]);

    const sortedAvatars = useMemo(() => [...avatars].sort((a, b) => a.weight - b.weight), [avatars]);

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

        let activeDates = pantrySearch?.dates || [];
        if (pantrySearch?.timeframe === 'custom' && (pantrySearch?.customStartDate || pantrySearch?.customEndDate)) {
            const sd = pantrySearch.customStartDate || '1970-01-01';
            const ed = pantrySearch.customEndDate || '2099-12-31';
            activeDates = [...new Set(baseMeals.filter(m => m.date >= sd && m.date <= ed).map(m => m.date))];
        }

        if (activeDates.length > 0) {
            // Group the meals by each selected date
            [...activeDates].sort().reverse().forEach(d => {
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

    const availableStylesInPantry = useMemo(() => {
        return [...new Set(ratedMeals.filter(m => m.primaryStyle).map(m => m.primaryStyle))].sort();
    }, [ratedMeals]);

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
                const isHome = m.place?.toLowerCase() === 'home';
                return {
                    style: m.primaryStyle,
                    hasStripe: (isActivelyFiltering && isVisible) || taggedIds.includes(m.id),
                    isHome
                };
            });
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

    const parchmentBg = PARCHMENT_BG;

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
                            <div className={`absolute inset-0 transform transition-transform duration-[600ms] ease-in-out ${view === 'home' || (view === 'compare' && lastView === 'home') ? 'translate-x-0' : '-translate-x-full'}`}>
                                <HomeView inputValue={inputValue} setInputValue={setInputValue} setView={setView} stats={{ totalFills: ratedMeals.length, fiveStars: ratedMeals.filter(m => m.rating === 5).length, userName: user?.displayName?.split(' ')[0] || 'Guest' }} recentMeals={ratedMeals.filter(m => m.userIds?.includes(sortedAvatars[0]?.id))} availableAvatars={sortedAvatars} onOpenCard={m => { setActiveCard(m); setIsPlateEditorOpen(true); }} onOpenMap={setLocationCard} onCompare={() => { setCompareCards(ratedMeals.filter(m => taggedIds.includes(m.id))); setLastView(view); setView('compare'); }} taggedIds={taggedIds} onToggleTag={toggleTag} />
                            </div>
                            <div className={`absolute inset-0 transform transition-transform duration-[600ms] ease-in-out ${view === 'pantry' || (view === 'compare' && lastView === 'pantry') ? 'translate-x-0' : 'translate-x-full'}`}>
                                <PantryView heldMeals={ratedMeals.filter(m => taggedIds.includes(m.id))} bucketedMeals={bucketedMeals} activeAvatars={activeAvatars} availableAvatars={sortedAvatars} onToggleAvatar={id => setActiveAvatars(prev => prev.includes(id) ? (prev.length > 1 ? prev.filter(a => a !== id) : prev) : [...prev, id])} onAddAvatar={handleAddAvatar} onOpenCalendar={() => setIsCalendarOpen(true)} pantrySearch={pantrySearch} setPantrySearch={setPantrySearch} onOpenCard={m => { setActiveCard(m); setIsPlateEditorOpen(true); }} onOpenMap={setLocationCard} onAddNew={() => { setActiveCard(null); setIsPlateEditorOpen(true); }} onOpenGhost={handleOpenGhost} ghostCount={ghostCount} taggedIds={taggedIds} onToggleTag={toggleTag} onCompare={() => { setCompareCards(ratedMeals.filter(m => taggedIds.includes(m.id))); setLastView(view); setView('compare'); }} />
                            </div>
                            <div className={`absolute inset-0 z-50 transform transition-transform duration-[600ms] ease-out ${view === 'compare' ? 'translate-y-0' : 'translate-y-full'}`}>
                                <CompareView deckCards={compareCards} onBack={setView} onOpenCard={m => { setActiveCard(m); setIsPlateEditorOpen(true); }} onOpenMap={setLocationCard} availableAvatars={sortedAvatars} />
                            </div>
                        </main>

                        <FooterNav
                            view={view}
                            ghostCount={ghostCount}
                            onOpenGhost={handleOpenGhost}
                            onNewPlate={() => { setActiveCard(null); setIsPlateEditorOpen(true); }}
                            onOpenFilter={() => setIsFilterModalOpen(true)}
                            onGoHome={() => setView('home')}
                            onOpenCalendar={() => setIsCalendarOpen(true)}
                        />
                    </div>
                )}

                {/* OVERLAYS */}
                <div className={`absolute inset-0 z-[1100] transform transition-transform duration-[600ms] ease-out ${isPlateEditorOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <YourPlateView activeCard={activeCard === 'resolve_ghosts' ? null : activeCard} pendingQueue={activeCard === 'resolve_ghosts' ? pendingMeals : []} calendarSelectedDate={calendarSelectedDate} onClose={() => setIsPlateEditorOpen(false)} onSave={async (d, consumedGhostId, hasMore) => { await savePlate(d); if (consumedGhostId) await deletePlate(consumedGhostId); if (!hasMore) setIsPlateEditorOpen(false); }} onDiscardGhost={async (ghostId, hasMore) => { await deletePlate(ghostId); if (!hasMore) setIsPlateEditorOpen(false); }} availableAvatars={sortedAvatars} onAddAvatar={handleAddAvatar} onOpenCalendar={() => setIsCalendarOpen(true)} cuisineMap={CUISINE_MAP} onOpenMap={setLocationCard} />
                </div>

                <div className={`absolute inset-0 z-[4000] transform transition-transform duration-[600ms] ease-out ${locationCard ? 'translate-y-0' : 'translate-y-full'}`}>
                    <LocationModalView locationCard={locationCard} onClose={() => setLocationCard(null)} availableAvatars={sortedAvatars} />
                </div>

                {/* FILTER MODAL */}
                <FilterModalView
                    isOpen={isFilterModalOpen}
                    searchState={pantrySearch}
                    onApply={(draft) => { setPantrySearch(draft); setIsFilterModalOpen(false); }}
                    onClose={() => setIsFilterModalOpen(false)}
                    availableStylesInPantry={availableStylesInPantry}
                    availableAvatars={sortedAvatars}
                    activeAvatars={activeAvatars}
                    setActiveAvatars={setActiveAvatars}
                    onOpenCalendar={() => { setIsFilterModalOpen(false); setIsCalendarOpen(true); }}
                />

                <CalendarOverlay
                    isOpen={isCalendarOpen}
                    isPlateEditorOpen={isPlateEditorOpen}
                    currentViewDate={currentViewDate}
                    setCurrentViewDate={setCurrentViewDate}
                    calendarInfo={calendarInfo}
                    currentMonthPrefix={currentMonthPrefix}
                    ratedMeals={ratedMeals}
                    activeAvatars={activeAvatars}
                    taggedIds={taggedIds}
                    bucketedMeals={bucketedMeals}
                    pantrySearch={pantrySearch}
                    setPantrySearch={setPantrySearch}
                    view={view}
                    setView={setView}
                    getPillsForDate={getPillsForDate}
                    onClose={() => setIsCalendarOpen(false)}
                    onDateSelect={(clickedDate) => { setCalendarSelectedDate({ date: clickedDate, ts: Date.now() }); }}
                />
            </div>
        </div>
    );
}