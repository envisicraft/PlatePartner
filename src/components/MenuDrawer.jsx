import React, { useState, useMemo } from 'react';

/**
 * PlatePartner - Master Spec v66.0 (Hardcoded Visual Restoration)
 */

// --- FAIL-SAFE SVG ICONS ---
const IconMic = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>;
const IconSearchWhite = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>;
const IconHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IconCalendar = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
const IconCamera = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>;
const IconFilter = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>;
const IconX = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconPencil = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>;
const IconChevron = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const IconChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;

// High-Fidelity Hub Icons
const IconBookRestored = () => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const IconPlateRestored = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.1" strokeWidth="1" />
        <path d="M15 8v4M9 8v4M12 8v10M15 12a3 3 0 0 1-6 0" />
    </svg>
);

// --- DATA ---
const AVATARS = [
    { id: 'JD', name: 'JD', img: 'https://i.pravatar.cc/100?u=jd' },
    { id: 'SM', name: 'SM', img: 'https://i.pravatar.cc/100?u=sm' },
    { id: 'DOG', name: 'DOG', img: null }
];

const MASTER_CATEGORIES = [
    { id: "American", color: "#1D4ED8" },
    { id: "Italian", color: "#15803D" },
    { id: "Mexican", color: "#EA580C" }
];

const INITIAL_MEALS = [
    { id: 1, dish: 'Steak Frites', place: 'LE PETIT', date: 15, styles: ['American'], img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=200' },
    { id: 2, dish: 'Lobster Ravioli', place: 'OCEAN CATCH', date: 15, styles: ['Italian'], img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=200' },
    { id: 3, dish: 'Carbonara', place: 'BISTRO 123', date: 14, styles: ['Italian'], img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=200' }
];

const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export default function App() {
    const [view, setView] = useState('home');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState(15);
    const [activeAvatars, setActiveAvatars] = useState(['JD']);
    const [monthOffset, setMonthOffset] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const notificationCount = 3;

    const parchmentBg = {
        backgroundColor: '#E8D4A9',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`,
        backgroundRepeat: 'repeat'
    };

    const calendarInfo = useMemo(() => {
        const baseDate = new Date(2025, 10);
        const targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
        return {
            monthName: MONTHS[targetDate.getMonth()],
            year: targetDate.getFullYear(),
            daysInMonth: new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate(),
            startDay: targetDate.getDay(),
            monthIndex: targetDate.getMonth()
        };
    }, [monthOffset]);

    const activeStyles = Array.from(new Set(INITIAL_MEALS.flatMap(m => m.styles)));

    return (
        <div className="w-full h-screen bg-[#DBC8A0] flex items-center justify-center p-4 font-sans overflow-hidden">
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .inner-fold { box-shadow: inset 2px 4px 12px rgba(0,0,0,0.1); }
        .tactile-shadow { box-shadow: 0 16px 32px -8px rgba(0,0,0,0.45), 0 8px 16px -4px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3); }
        @keyframes pencil-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); filter: drop-shadow(0 0 6px rgba(226, 114, 91, 0.4)); } }
        .animate-pencil-pulse { animation: pencil-pulse 2s infinite ease-in-out; }
      `}</style>

            {/* Main Shell */}
            <div className="w-full max-sm:w-full max-sm:h-full max-w-[375px] h-[720px] rounded-[3.5rem] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] border-[12px] border-[#1A1A1A] relative flex flex-col" style={parchmentBg}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#1A1A1A] rounded-b-2xl z-50" />

                <div className="flex flex-col h-full bg-transparent relative z-10 overflow-hidden pt-10">

                    <div className="shrink-0 px-6 mb-2">
                        <div className="p-1 bg-black/5 rounded-full flex gap-1 z-20 relative">
                            <button className="flex-1 py-1 rounded-full text-[6px] font-black uppercase bg-white">SIM WHISPER</button>
                            <button className="flex-1 py-1 rounded-full text-[6px] font-black uppercase bg-[#E2725B] text-white shadow-sm">SIM GHOST</button>
                        </div>
                        {view === 'home' && (
                            <header className="text-center mt-3 mb-1 animate-in fade-in duration-700">
                                <h1 className="text-3xl font-black tracking-tighter text-[#1A1A1A] leading-tight italic">PlatePartner</h1>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E2725B] mt-0.5 italic leading-none">A FIVE-STAR JOURNEY</p>
                            </header>
                        )}
                    </div>

                    <main className="flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar gap-4 pb-40 relative z-20">
                        {view === 'home' ? (
                            /* --- HOME VIEW --- */
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex items-start gap-3 bg-white/40 rounded-[2rem] border border-black/10 p-4 inner-fold shrink-0">
                                    <textarea
                                        placeholder={"What are you in the mood for?\n- Ask for what I've eaten?\n- Ask what or where to eat?\n- Tap the camera to start a new pantry item from a meal photo or a receipt"}
                                        className="flex-grow bg-transparent border-none focus:ring-0 text-[12px] font-bold h-[100px] w-full resize-none outline-none placeholder:text-black/30 placeholder:font-semibold"
                                    />
                                </div>

                                <div className="w-full p-4 pb-5 rounded-[2.5rem] text-center border-2 border-black/10 bg-white/5 shadow-lg shrink-0">
                                    <div className="flex flex-col items-center mb-1">
                                        <span className="text-2xl font-black text-[#1A1A1A] italic uppercase leading-none">WELCOME</span>
                                        <h2 className="text-2xl font-black text-[#1A1A1A] italic uppercase leading-none">JD</h2>
                                    </div>
                                    <div className="h-px bg-black/10 w-full my-3" />
                                    <div className="grid grid-cols-2 gap-0 text-[#1A1A1A]">
                                        <div className="flex flex-col items-center"><span className="text-3xl font-black">28</span><span className="text-[8px] font-black uppercase opacity-40">5 Star Plates</span></div>
                                        <div className="flex flex-col items-center border-l border-black/10"><span className="text-3xl font-black">114</span><span className="text-[8px] font-black uppercase opacity-40">Plate Fills</span></div>
                                    </div>
                                </div>

                                {/* Hub Icons Explicit Restoration */}
                                <div className="grid grid-cols-2 gap-4 mt-auto mb-14 h-28 shrink-0 relative z-30">
                                    <button onClick={() => setView('pantry')} className="relative h-full rounded-[2.5rem] text-white tactile-shadow active:scale-95 transition-all overflow-hidden" style={parchmentBg}>
                                        <div className="absolute inset-0 bg-[#E2725B]/90 mix-blend-multiply z-0" />
                                        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-1">
                                            <div className="h-[55px] flex items-center justify-center"><IconBookRestored /></div>
                                            <span className="font-black text-[11px] uppercase tracking-widest leading-none mt-1">Plate Pantry</span>
                                        </div>
                                    </button>
                                    <button onClick={() => setView('pantry')} className="relative h-full rounded-[2.5rem] text-white tactile-shadow active:scale-95 transition-all overflow-hidden" style={parchmentBg}>
                                        <div className="absolute inset-0 bg-[#4F7942]/90 mix-blend-multiply z-0" />
                                        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-1">
                                            <div className="h-[55px] flex items-center justify-center"><IconPlateRestored /></div>
                                            <span className="font-black text-[11px] uppercase tracking-widest leading-none mt-1">Fill My Plate</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* --- PANTRY VIEW --- */
                            <div className="flex-1 flex flex-col gap-5 animate-in slide-in-from-right duration-700">
                                {/* Header Row: Title and Add Item locked horizontally */}
                                <div className="flex items-baseline justify-between shrink-0">
                                    <h2 className="text-3xl font-black italic tracking-tighter text-[#1A1A1A]">Plate Pantry</h2>
                                    <button className="bg-[#E2725B] text-white px-3 py-1.5 rounded-full font-black text-[9px] uppercase shadow-md active:scale-95">+ ADD ITEM</button>
                                </div>

                                <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
                                    {AVATARS.map(av => {
                                        const isActive = activeAvatars.includes(av.id);
                                        return (
                                            <button key={av.id} onClick={() => setActiveAvatars(prev => prev.includes(av.id) ? prev.filter(a => a !== av.id) : [...prev, av.id])} className="flex flex-col items-center gap-1.5 shrink-0 transition-transform active:scale-90">
                                                <div className={`w-14 h-14 rounded-full border-2 transition-all duration-300 ${isActive ? 'border-[#E2725B] grayscale-0 opacity-100 scale-105 shadow-md' : 'border-black/5 grayscale opacity-40'} bg-white overflow-hidden`}>
                                                    {av.img ? <img src={av.img} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-black/5 flex items-center justify-center opacity-30 text-xl">🐾</div>}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase transition-colors ${isActive ? 'text-[#1A1A1A]' : 'text-black/30'}`}>{av.id}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-center shrink-0 mt-2">
                                    <button onClick={() => setIsCalendarOpen(true)} className="bg-white rounded-full w-[240px] py-2 border border-black/5 shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all">
                                        <IconCalendar />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">ALL RECENT DATES</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pb-10">
                                    {INITIAL_MEALS.map(m => (
                                        <button key={m.id} className="bg-white/70 rounded-[1.5rem] overflow-hidden border border-black/5 shadow-md flex flex-col h-[135px] text-center active:scale-95 transition-transform group">
                                            <div className="h-20 w-full relative"><img src={m.img} className="w-full h-full object-cover" /></div>
                                            <div className="p-1.5 flex flex-col flex-grow items-center">
                                                <h4 className="text-[9px] font-black text-[#1A1A1A] leading-tight line-clamp-2">{m.dish}</h4>
                                                <p className="text-[7px] font-bold text-black/30 uppercase truncate">{m.place}</p>
                                                <div className="mt-auto text-[7px] font-black text-[#E2725B] uppercase italic bg-black/5 px-2 py-1 rounded-full group-hover:bg-[#E2725B]/10">VIEW/EDIT</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* BOTTOM NAV BAR: Strictly wired for logic */}
                    <footer className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#E8D4A9]/95 to-[#E8D4A9] z-50 flex items-center justify-around pb-8 text-[#1A1A1A]">
                        <div className="flex w-full items-center justify-around px-4 pointer-events-auto">
                            {view === 'home' ? (
                                <div className="flex w-full justify-between items-center px-4">
                                    <button className={`p-2 active:scale-90 animate-pencil-pulse text-[#E2725B] relative`}>
                                        <IconPencil /><div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full border-2 border-[#E8D4A9] flex items-center justify-center text-[10px] font-black text-white shadow-sm">3</div>
                                    </button>
                                    <button className="p-2 active:scale-90 text-black/40"><IconMenu /></button>
                                    <button className="p-2 active:scale-90 text-[#4F7942] transition-transform hover:scale-110"><IconCamera /></button>
                                </div>
                            ) : (
                                <div className="flex w-full justify-around items-center">
                                    <button onClick={() => setView('home')} className="p-2 transition-all active:scale-90 hover:text-[#E2725B]"><IconHome /></button>
                                    <button onClick={() => setIsCalendarOpen(true)} className={`p-2 transition-all active:scale-90 ${isCalendarOpen ? 'text-[#E2725B]' : ''}`}><IconCalendar /></button>
                                    <button className="p-2 active:scale-90"><IconCamera /></button>
                                    <button className="p-2 active:scale-90"><IconFilter /></button>
                                    <button className="p-2 active:scale-90"><IconMenu /></button>
                                </div>
                            )}
                        </div>
                    </footer>
                </div>

                {/* --- DYNAMIC SELECT DATE SHELF --- */}
                <div className={`absolute inset-0 z-[100] flex flex-col justify-end transition-opacity duration-700 ${isCalendarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => { setIsCalendarOpen(false); setIsMonthPickerOpen(false); }} />
                    <div
                        className={`relative w-full bg-[#E8D4A9] rounded-t-[3rem] p-6 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/40 transition-transform duration-700 ease-in-out ${isCalendarOpen ? 'translate-y-0' : 'translate-y-full'}`}
                        style={parchmentBg}
                        onTouchStart={e => setTouchStart(e.touches[0].clientX)}
                        onTouchEnd={e => {
                            if (!touchStart || isMonthPickerOpen) return;
                            const diff = touchStart - e.changedTouches[0].clientX;
                            if (Math.abs(diff) > 50) setMonthOffset(prev => diff > 0 ? prev + 1 : prev - 1);
                            setTouchStart(null);
                        }}
                    >
                        <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6" />
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A]">Select Date</h3>
                            <button onClick={() => { setIsCalendarOpen(false); setIsMonthPickerOpen(false); }} className="p-2 bg-black/5 rounded-full"><IconX /></button>
                        </div>

                        {/* MONTH PICKER Logic */}
                        <div className="flex items-center justify-between mb-4 px-2 relative z-[200]">
                            <button onClick={() => setMonthOffset(prev => prev - 1)} className="p-1 text-[#1A1A1A]/40 hover:text-[#E2725B] transition-colors"><IconChevron /></button>

                            <button
                                onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#1A1A1A] hover:text-[#E2725B] transition-colors"
                            >
                                {calendarInfo.monthName} {calendarInfo.year}
                                <IconChevronDown />
                            </button>

                            <button onClick={() => setMonthOffset(prev => prev + 1)} className="p-1 text-[#1A1A1A]/40 hover:text-[#E2725B] transition-colors rotate-180"><IconChevron /></button>

                            {isMonthPickerOpen && (
                                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 max-h-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-black/5 z-[300] overflow-y-auto no-scrollbar py-2">
                                    {MONTHS.map((m, idx) => (
                                        <button key={m} onClick={() => { setMonthOffset(idx - 10); setIsMonthPickerOpen(false); }} className={`w-full text-center py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-colors ${idx === calendarInfo.monthIndex ? 'text-[#E2725B]' : 'text-black/60'}`}>{m}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 bg-white/20 p-4 rounded-2xl border border-black/5">
                            {activeStyles.map(styleId => (
                                <div key={styleId} className="flex items-center gap-2">
                                    <div className="h-2 w-4 rounded-full shadow-sm" style={{ backgroundColor: MASTER_CATEGORIES.find(c => c.id === styleId)?.color || '#000' }} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/70">{styleId}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {[...Array(calendarInfo.startDay)].map((_, i) => <div key={`empty-${i}`} />)}
                            {[...Array(calendarInfo.daysInMonth)].map((_, i) => {
                                const dayNum = i + 1;
                                const mealsThisDay = monthOffset === 0 ? INITIAL_MEALS.filter(m => m.date === dayNum) : [];
                                return (
                                    <button key={i} onClick={() => { setCurrentDay(dayNum); setIsCalendarOpen(false); }} className={`h-12 rounded-xl flex flex-col items-center justify-between p-1 border transition-all ${dayNum === currentDay && monthOffset === 0 ? 'border-black bg-white/40 shadow-inner' : 'border-transparent hover:bg-black/5'}`}>
                                        <span className="text-[11px] font-bold">{dayNum}</span>
                                        <div className="w-full flex flex-col gap-[2px]">
                                            {mealsThisDay.map((meal, idx) => (
                                                <div key={idx} className="h-[3px] w-full rounded-full" style={{ backgroundColor: MASTER_CATEGORIES.find(c => c.id === meal.styles[0])?.color || '#000' }} />
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}