import React, { useState, useMemo } from 'react';
import { HomeView, PantryView, YourPlateView } from './Views';
import { IconHome, IconCalendar, IconCamera, IconFilter, IconMenu, IconPencil, IconX, IconChevronDown, IconChevronLeft, IconChevronRight } from './Icons';

const CUISINE_MAP = { "American": "#3B82F6", "Italian": "#22C55E", "Mexican": "#EA580C", "Healthy": "#84CC16", "Asian": "#EF4444", "Seafood": "#06B6D4", "Burger": "#F97316", "Indian": "#D97706", "Fast Food": "#CA8A04", "Sandwiches": "#92400E", "Cafe & Dessert": "#EC4899", "Bakery": "#FBBF24", "Bar/Pub": "#7C3AED", "Breakfast/Brunch": "#FDE047", "Coffee/Tea": "#A8A29E", "Dessert": "#F472B6", "French": "#9333EA", "Mediterranean": "#14B8A6", "Pizza": "#B91C1C", "Salad": "#4ADE80", "Steakhouse": "#7F1D1D", "Vegan/Veg": "#10B981" };
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export default function App() {
    const [view, setView] = useState('home');
    const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 1));
    const [touchStartX, setTouchStartX] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
    const [isPlateEditorOpen, setIsPlateEditorOpen] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [pantrySearch, setPantrySearch] = useState("");
    const [activeAvatars, setActiveAvatars] = useState(['JD']);

    const [avatars, setAvatars] = useState([
        { id: 'JD', img: 'https://i.pravatar.cc/100?u=jd', weight: 0 },
        { id: 'SM', img: 'https://i.pravatar.cc/100?u=sm', weight: 50 },
        { id: 'DOG', img: '', weight: 100 }
    ]);

    const sortedAvatars = useMemo(() => [...avatars].sort((a, b) => a.weight - b.weight), [avatars]);

    const [meals, setMeals] = useState([
        { id: 99, userIds: ['JD'], dish: 'UNFINISHED MEAL', place: 'Morning Cafe', rating: 0, placeRating: 0, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300', date: '2026-02-23', isGhost: true },
        { id: 1, userIds: ['JD', 'SM'], dish: 'TRUFFLE BURGER', place: 'THE GRILL', rating: 5, placeRating: 4, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300', date: '2026-02-23', primaryStyle: "American" },
        { id: 2, userIds: ['JD'], dish: 'SPICY TUNA ROLL', place: 'SUSHI ZEN', rating: 4, placeRating: 3, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=300', date: '2026-02-23', primaryStyle: "Asian" },
        { id: 3, userIds: ['SM'], dish: 'MARGHERITA PIZZA', place: 'NAPOLI BOYS', rating: 3, placeRating: 4, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=300', date: '2026-02-22', primaryStyle: "Italian" },
        { id: 4, userIds: ['JD', 'SM'], dish: 'BRUNCH BOWL', place: 'EARLY BIRD CAFE', rating: 4, placeRating: 5, img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638ca?auto=format&fit=crop&q=80&w=300', date: '2026-02-22', primaryStyle: "Healthy" },
        { id: 5, userIds: ['JD'], dish: 'STREET TACOS', place: 'EL CAMINO', rating: 5, placeRating: 4, img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=300', date: '2026-02-21', primaryStyle: "Mexican" },
        { id: 6, userIds: ['SM'], dish: 'LOBSTER ROLL', place: 'THE DOCK', rating: 4, placeRating: 5, img: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=300', date: '2026-02-18', primaryStyle: "Seafood" },
        { id: 7, userIds: ['JD'], dish: 'BBQ RIBS', place: 'SMOKEHOUSE', rating: 3, placeRating: 3, img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=300', date: '2026-02-15', primaryStyle: "American" },
        { id: 8, userIds: ['SM'], dish: 'VEGAN WRAP', place: 'GREEN BITES', rating: 2, placeRating: 4, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300', date: '2026-02-12', primaryStyle: "Healthy" },
        { id: 9, userIds: ['JD', 'SM'], dish: 'PAD THAI', place: 'NOODLE BOX', rating: 4, placeRating: 4, img: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=300', date: '2026-02-10', primaryStyle: "Asian" },
        { id: 10, userIds: ['JD'], dish: 'CHEESEBURGER', place: 'DINER 66', rating: 5, placeRating: 3, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=300', date: '2026-02-05', primaryStyle: "Burger" }
    ]);

    const ratedMeals = useMemo(() => meals.filter(m => m.rating > 0), [meals]);
    const ghostCount = useMemo(() => meals.filter(m => m.rating === 0).length, [meals]);

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
        const f = ratedMeals.filter(m => m.userIds?.some(aid => activeAvatars.includes(aid)));
        return {
            today: f.filter(m => m.date === '2026-02-23'),
            yesterday: f.filter(m => m.date === '2026-02-22'),
            last7Days: f.filter(m => m.date < '2026-02-22' && m.date >= '2026-02-16'),
            last14Days: f.filter(m => m.date < '2026-02-16' && m.date >= '2026-02-09')
        };
    }, [ratedMeals, activeAvatars]);

    const getPillsForDate = (day) => {
        const dateStr = `${currentMonthPrefix}-${String(day).padStart(2, '0')}`;
        return ratedMeals.filter(m => m.date === dateStr && m.primaryStyle).map(m => m.primaryStyle);
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
        <div className="w-full h-screen bg-[#DBC8A0] flex items-center justify-center p-4 overflow-hidden font-sans">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .inner-fold { box-shadow: inset 2px 4px 12px rgba(0,0,0,0.1); }`}</style>

            {/* PHYSICAL PHONE SHELL */}
            <div className="w-full max-w-[375px] h-[720px] rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-[#1A1A1A] relative flex flex-col" style={parchmentBg}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#1A1A1A] rounded-b-2xl z-[1000]" />

                <div className="flex flex-col h-full bg-transparent pt-10">
                    <main className="flex-1 relative overflow-hidden">
                        {view === 'home' && <HomeView inputValue={inputValue} setInputValue={setInputValue} setView={setView} />}
                        {view === 'pantry' && <PantryView bucketedMeals={bucketedMeals} activeAvatars={activeAvatars} availableAvatars={sortedAvatars} onToggleAvatar={id => setActiveAvatars(prev => prev.includes(id) ? (prev.length > 1 ? prev.filter(a => a !== id) : prev) : [...prev, id])} onOpenCalendar={() => setIsCalendarOpen(true)} pantrySearch={pantrySearch} setPantrySearch={setPantrySearch} onOpenCard={m => { setActiveCard(m); setIsPlateEditorOpen(true); }} onAddNew={() => { setActiveCard(null); setIsPlateEditorOpen(true); }} ghostCount={ghostCount} />}
                    </main>

                    {/* DYNAMIC FOOTER LOGIC - ABSOLUTE TO FLOAT OVER CONTENT */}
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[500]">
                        {view === 'home' ? (
                            <footer className="h-[100px] flex items-end justify-around pb-6 relative pointer-events-auto">
                                {/* GRADIENT BACKDROP */}
                                <div className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 0%, transparent 100%)' }} />
                                <button onClick={() => setView('pantry')} className={`relative p-2 z-10 ${ghostCount > 0 ? 'text-[#EF4444] animate-pulse' : 'text-[#E2725B]'}`}>
                                    {ghostCount > 0 && <div className="absolute top-0 right-0 bg-[#EF4444] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#E8D4A9]">{ghostCount}</div>}
                                    <IconPencil className="rotate-[-15deg]" size={28} />
                                </button>
                                <button className="p-2 text-black/60 z-10"><IconMenu size={28} /></button>
                                <button className="p-2 text-[#4F7942] active:scale-90 transition-transform z-10"><IconCamera size={28} /></button>
                            </footer>
                        ) : (
                            <footer className="h-[120px] flex items-end justify-around pb-8 relative pointer-events-auto">
                                {/* GRADIENT BACKDROP for PANTRY */}
                                <div className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 0%, rgba(232, 212, 169, 1) 35%, rgba(232, 212, 169, 1) 100%)' }} />
                                <button onClick={() => setView('home')} className="p-2 text-[#E2725B] active:scale-90 transition-transform z-10"><IconHome size={24} /></button>
                                <button onClick={() => setIsCalendarOpen(true)} className="p-2 text-black/40 z-10"><IconCalendar size={24} /></button>
                                <button className="p-2 text-black/40 z-10"><IconCamera size={24} /></button>
                                <button className="p-2 text-black/40 z-10"><IconFilter size={24} /></button>
                                <button className="p-2 text-black/40 z-10"><IconMenu size={24} /></button>
                            </footer>
                        )}
                    </div>
                </div>

                {/* OVERLAYS */}
                <div className={`absolute inset-0 z-[1100] transform transition-transform duration-500 ${isPlateEditorOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <YourPlateView activeCard={activeCard} calendarSelectedDate={calendarSelectedDate} onClose={() => setIsPlateEditorOpen(false)} onSave={d => { setMeals(p => { const i = p.findIndex(m => m.id === d.id); if (i > -1) { const n = [...p]; n[i] = d; return n; } return [{ ...d, id: Date.now() }, ...p]; }); setIsPlateEditorOpen(false); }} availableAvatars={sortedAvatars} onAddAvatar={handleAddAvatar} onOpenCalendar={() => setIsCalendarOpen(true)} cuisineMap={CUISINE_MAP} />
                </div>

                <div className={`absolute inset-0 z-[1200] flex flex-col justify-end transition-opacity duration-500 ${isCalendarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)} />
                    <div className={`relative w-full max-h-[90%] overflow-y-auto bg-[#E8D4A9] rounded-t-[3rem] p-6 pb-12 shadow-2xl`} style={parchmentBg}>
                        <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6" />

                        {/* CALENDAR LEDGER */}
                        <div className="grid grid-cols-3 gap-y-2 mb-6 px-2 border-b border-black/5 pb-4">
                            {(() => {
                                const activeStyles = new Set(ratedMeals.filter(m => m.date.startsWith(currentMonthPrefix) && m.primaryStyle).map(m => m.primaryStyle));
                                return Object.entries(CUISINE_MAP).filter(([style]) => activeStyles.has(style)).map(([style, color]) => (
                                    <div key={style} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-black/40">{style}</span>
                                    </div>
                                ));
                            })()}
                        </div>

                        <div className="flex justify-between items-center mb-6 px-2">
                            <button onClick={() => setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))} className="p-2 bg-black/5 rounded-full active:scale-95 transition-transform"><IconChevronLeft size={20} /></button>
                            <div className="relative group flex flex-col items-center">
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
                                <h3 className="text-2xl font-black italic text-[#1A1A1A] flex items-center gap-1.5 uppercase tracking-widest group-hover:opacity-60 transition-opacity">
                                    {calendarInfo.monthName} {calendarInfo.year} <IconChevronDown size={14} className="text-black/30" />
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))} className="p-2 bg-black/5 rounded-full active:scale-95 transition-transform"><IconChevronRight size={20} /></button>
                                <button onClick={() => setIsCalendarOpen(false)} className="p-2 bg-black/5 rounded-full ml-1 active:scale-95 transition-transform"><IconX size={20} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 px-2 mb-6 text-center" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[9px] font-black text-black/30 mb-2">{d}</div>)}
                            {[...Array(calendarInfo.startDay)].map((_, i) => <div key={i} />)}
                            {[...Array(calendarInfo.daysInMonth)].map((_, i) => {
                                const styles = getPillsForDate(i + 1);
                                return (
                                    <button key={i} onClick={() => {
                                        if (isPlateEditorOpen) {
                                            setCalendarSelectedDate({ date: `${currentMonthPrefix}-${String(i + 1).padStart(2, '0')}`, ts: Date.now() });
                                        }
                                        setIsCalendarOpen(false);
                                    }} className="min-h-[62px] flex flex-col items-center py-2 hover:bg-black/5 rounded-xl transition-colors">
                                        <span className="text-[10px] font-black opacity-30 mb-1">{i + 1}</span>
                                        <div className="flex flex-col gap-0.5 w-full px-1">
                                            {styles.map((s, idx) => <div key={idx} className="h-1 w-full rounded-full" style={{ backgroundColor: CUISINE_MAP[s] || '#000' }} />)}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

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

                                const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);

                                return (
                                    <div className="flex flex-col gap-5 px-2">
                                        <div className="w-full h-3 flex rounded-full overflow-hidden shadow-inner border border-black/10">
                                            {sortedStats.map(([style, count]) => (
                                                <div
                                                    key={style}
                                                    style={{
                                                        width: `${(count / totalCount) * 100}%`,
                                                        backgroundColor: CUISINE_MAP[style] || '#000'
                                                    }}
                                                    className="h-full transition-all duration-500"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {sortedStats.map(([style, count]) => {
                                                const percentage = Math.round((count / totalCount) * 100);
                                                return (
                                                    <div key={style} className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-full border border-black/5 shadow-sm text-[10px] font-black uppercase text-[#1A1A1A]">
                                                        <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: CUISINE_MAP[style] || '#000' }} />
                                                        {percentage}% {style}
                                                    </div>
                                                );
                                            })}
                                        </div>
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