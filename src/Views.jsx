import React, { useState, useEffect } from 'react';
import {
    IconMicSpark, IconSearchGreen, IconCalendar, IconChevronDown, IconStar,
    IconAwardGold, IconHistoryGreen, IconPawPrint, IconMapPin, IconX,
    IconCamera, IconReceipt, IconShare2, IconSparkles, IconPlus, IconHubBrochure, IconHubPlateSpoon
} from './Icons';

const PROMPT_HOME = "What are you in the mood for?\n- Ask for what I've eaten?\n- Ask what or where to eat?\n- Tap the camera to start a new pantry item...";
const PROMPT_PANTRY = "Search your saved pantry card memories . A dish, food style, a restaurant, a city, or even a note like 'extra spicy.' Or tap the mic to just ask me!";
const MASTER_CATEGORIES = [{ id: "American", subs: "Burgers, BBQ" }, { id: "Asian", subs: "Sushi, Ramen" }, { id: "Bakery", subs: "Bread, Pastry" }, { id: "Bar/Pub", subs: "Wings, Drinks" }, { id: "Breakfast/Brunch", subs: "Eggs, Coffee" }, { id: "Burger", subs: "Classic, Craft" }, { id: "Coffee/Tea", subs: "Cafe, Matcha" }, { id: "Dessert", subs: "Ice Cream, Cake" }, { id: "Fast Food", subs: "Drive-thru" }, { id: "French", subs: "Bistro, Crepes" }, { id: "Healthy", subs: "Salads, Bowls" }, { id: "Indian", subs: "Curry, Naan" }, { id: "Italian", subs: "Pizza, Pasta" }, { id: "Mediterranean", subs: "Greek, Hummus" }, { id: "Mexican", subs: "Tacos, Latin" }, { id: "Pizza", subs: "New York, Napo" }, { id: "Salad", subs: "Garden, Caesar" }, { id: "Seafood", subs: "Fish, Oysters" }, { id: "Steakhouse", subs: "Chops, Grill" }, { id: "Vegan/Veg", subs: "Plant-based" }].sort((a, b) => a.id.localeCompare(b.id));

const NumberedStar = ({ rating, value, onClick, size = 32 }) => {
    const isActive = value <= rating;
    const colors = ["#EF4444", "#F59E0B", "#F59E0B", "#22C55E", "#D4AF37"];
    const activeColor = colors[Math.min(rating - 1, 4)];
    return (<button onClick={() => onClick(value)} className={`relative flex items-center justify-center transition-all active:scale-90 ${isActive ? '' : 'text-black/10'}`} style={{ width: size, height: size, color: isActive ? activeColor : undefined }}><IconStar fill="currentColor" size={size} className="absolute" /><span className={`relative z-10 text-[10px] font-black ${isActive ? 'text-black/70' : 'text-black/30'}`}>{value}</span></button>);
};

const PantryCard = ({ m, onOpen, availableAvatars }) => {
    const avs = m.userIds.map(uid => availableAvatars?.find(a => a.id === uid)).filter(Boolean);
    const rb = m.rating >= 5 ? 'bg-[#D4AF37]' : m.rating === 4 ? 'bg-[#22C55E]' : m.rating >= 2 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]';
    return (<div onClick={() => onOpen(m)} className="bg-white/70 rounded-[1.25rem] overflow-hidden border border-black/5 shadow-md flex flex-col h-[130px] text-center active:scale-95 transition-transform relative shrink-0 cursor-pointer">
        <div className="h-[65px] w-full relative shrink-0"><img src={m.img} className="w-full h-full object-cover" alt="d" /><div className="absolute top-1 left-1 flex -space-x-1.5">{avs.map((av, i) => (<div key={av.id} className="w-5 h-5 rounded-full border border-white overflow-hidden shadow-sm flex items-center justify-center bg-white/90" style={{ zIndex: 10 - i }}>{av.id === 'DOG' ? <IconPawPrint size={12} className="text-[#92400E]" /> : <img src={av.img} className="w-full h-full object-cover" alt="u" />}</div>))}</div>
            <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded flex items-center gap-0.5 text-white text-[8px] font-black shadow-sm ${rb}`}>{m.rating} <IconStar /></div><div className="absolute bottom-1 right-1 p-1 bg-white/90 rounded-full shadow-sm z-10"><IconMapPin size={12} className="text-[#4F7942]" /></div></div>
        <div className="p-1.5 flex flex-col flex-grow items-center justify-start overflow-hidden uppercase"><h4 className="text-[11px] font-black leading-tight line-clamp-2 text-[#1A1A1A] w-full">{m.dish}</h4><p className="text-[9px] font-bold text-black/40 truncate w-full mt-0.5">{m.place}</p><div className="mt-auto text-[7px] font-black text-[#E2725B] italic tracking-widest pb-0.5">VIEW/EDIT</div></div></div>);
};

const ChronoSection = ({ title, meals, onOpenCard, availableAvatars }) => {
    if (meals.length === 0) return null;

    // Sort meals 5-star down to 1-star
    const sortedMeals = [...meals].sort((a, b) => b.rating - a.rating);

    return (
        <div className="px-6 mb-6 shrink-0">
            <div className="flex justify-between items-center mb-3 border-b border-black/5 pb-2 uppercase text-black/30">
                <h3 className="text-[12px] font-black italic tracking-widest">{title}</h3>
                <span className="text-[8px] font-bold text-[#E2725B] uppercase">{meals.length} plates</span>
            </div>
            {/* grid-cols-3 handles the 3 across constraint, and new items naturally wrap to rows below! */}
            <div className="grid grid-cols-3 gap-2">
                {sortedMeals.map(m => <PantryCard key={m.id} m={m} onOpen={onOpenCard} availableAvatars={availableAvatars} />)}
            </div>
        </div>
    );
};

export const YourPlateView = ({ activeCard, calendarSelectedDate, onClose, onSave, availableAvatars, onAddAvatar, onOpenCalendar, cuisineMap }) => {
    const [fd, sfd] = useState(activeCard || { userIds: ['JD'], rating: 0, placeRating: 0, primaryStyle: null, secondaryStyles: [], petFriendly: false, notes: '', dish: '', place: '', date: 'Today' });
    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => { if (activeCard) sfd(activeCard); }, [activeCard]);
    useEffect(() => { if (calendarSelectedDate?.date) sfd(prev => ({ ...prev, date: calendarSelectedDate.date })); }, [calendarSelectedDate]);
    const handleCat = (cat) => sfd(prev => { if (prev.primaryStyle === cat) return { ...prev, primaryStyle: null }; if (!prev.primaryStyle) return { ...prev, primaryStyle: cat }; if (prev.secondaryStyles.includes(cat)) return { ...prev, secondaryStyles: prev.secondaryStyles.filter(c => c !== cat) }; return { ...prev, secondaryStyles: [...prev.secondaryStyles, cat] }; });
    return (<div className="flex flex-col h-full animate-in slide-in-from-bottom duration-500 relative bg-[#E8D4A9]">
        <div className="px-6 pt-10 pb-4 flex justify-between items-center border-b border-black/5 shrink-0 uppercase relative z-10"><div className="flex items-center"><button onClick={onClose} className="p-2 -ml-2 text-black/40 active:scale-90"><IconX size={24} /></button><h2 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A] ml-2">Your Plate</h2></div><div className="flex gap-3"><button className="p-1.5 text-black/40"><IconShare2 size={20} /></button><button onClick={() => onSave(fd)} className="px-4 py-1.5 bg-[#4F7942] text-white text-[10px] font-black uppercase rounded-full shadow-md active:scale-95">Save</button></div></div>
        <div className="flex-1 overflow-y-auto no-scrollbar pt-6 px-6 space-y-8 uppercase pb-32">
            <div className="flex gap-4"><button className="flex-1 aspect-square rounded-3xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center gap-2 bg-white/20 active:scale-95"><IconCamera size={20} /><span className="text-[8px] font-black px-2 leading-tight">SNAP OR UPLOAD FOOD PHOTO</span></button><button className="flex-1 aspect-square rounded-3xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center gap-2 bg-white/20 active:scale-95"><IconReceipt size={20} /><span className="text-[8px] font-black px-2 leading-tight">SNAP OR UPLOAD RECEIPT</span></button></div>
            <button className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-[#4F7942] to-[#65A30D] text-white shadow-md flex items-center justify-center gap-3"><IconSparkles size={18} /><div className="flex flex-col items-start text-left"><span className="text-[11px] font-black mb-1">Auto-Fill with Voice</span><span className="text-[8px] font-bold opacity-80 uppercase">Describe meal, venue, vibe</span></div></button>
            <div className="space-y-6">
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">What eaten?</h4><div className="bg-white/40 rounded-2xl border border-black/10 p-3 shadow-inner"><input type="text" placeholder="Spicy Tuna Roll" className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-bold uppercase" value={fd.dish} onChange={e => sfd({ ...fd, dish: e.target.value })} /></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">When?</h4><div className="flex gap-2">{['Today', 'Yesterday'].map(d => <button key={d} onClick={() => sfd({ ...fd, date: d })} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${fd.date === d ? 'bg-[#EF4444] text-white shadow-md' : 'bg-white/40 border-black/10 text-black/60'}`}>{d}</button>)}<button onClick={onOpenCalendar} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${fd.date !== 'Today' && fd.date !== 'Yesterday' ? 'bg-[#EF4444] text-white shadow-md' : 'bg-white/40 border-black/10 text-black/60'}`}>{fd.date !== 'Today' && fd.date !== 'Yesterday' ? fd.date : 'Past Date'}<IconCalendar size={14} /></button></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">What was the name of the place you ate this?</h4><div className="bg-white/40 rounded-2xl border border-black/10 p-3 shadow-inner flex items-center gap-2 mb-2"><IconMapPin size={14} className="text-black/30" /><input type="text" placeholder="Location..." className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-bold uppercase" value={fd.place} onChange={e => { sfd({ ...fd, place: e.target.value }); setIsSearch(e.target.value.length > 2); }} /></div>{isSearch && (<div className="rounded-2xl overflow-hidden border border-black/10 shadow-inner relative h-48 bg-[#DBC8A0] flex flex-col mb-4"><div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" /><div className="flex-1 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-[#EF4444] animate-bounce"><IconMapPin fill="currentColor" size={32} /></div><span className="absolute top-2 right-2 text-[8px] font-black uppercase bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm text-black/60">Drag to reposition fingers</span></div><div className="bg-white/95 backdrop-blur-md p-1 flex flex-col gap-1 z-10 shrink-0 border-t border-black/5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"><button onClick={() => { sfd({ ...fd, place: 'Sushi Zen' }); setIsSearch(false); }} className="font-black uppercase text-left w-full hover:bg-black/5 p-2 rounded transition-colors text-[#1A1A1A] text-[10px] flex items-center gap-2"><IconMapPin size={14} className="text-[#4F7942]" /> Sushi Zen <span className="text-[8px] opacity-40 ml-auto">(0.2mi)</span></button><button onClick={() => { sfd({ ...fd, place: 'Sushi Zen Express' }); setIsSearch(false); }} className="font-black uppercase text-left w-full hover:bg-black/5 p-2 rounded transition-colors text-black/50 text-[10px] flex items-center gap-2"><IconMapPin size={14} /> Sushi Zen Express <span className="text-[8px] opacity-40 ml-auto">(0.5mi)</span></button><div className="h-px bg-black/10 w-full my-0.5" /><button className="text-[9px] text-[#E2725B] uppercase font-black text-center p-2.5 w-full active:scale-95">Not here? Type city to redraw</button></div></div>)}</div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">Who?</h4><div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">{availableAvatars.map(av => { const isActive = fd.userIds.includes(av.id); return (<button key={av.id} onClick={() => sfd({ ...fd, userIds: isActive ? fd.userIds.filter(u => u !== av.id) : [...fd.userIds, av.id] })} className="flex flex-col items-center gap-1 shrink-0 active:scale-90"><div className={`w-12 h-12 rounded-full border-2 p-0.5 transition-all ${isActive ? 'border-[#EF4444]' : 'border-transparent grayscale opacity-30'}`}>{av.id === 'DOG' ? <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner"><IconPawPrint className="text-black/80" size={30} /></div> : <img src={av.img} className="w-full h-full rounded-full object-cover" alt="u" />}</div><span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100 text-[#1A1A1A]' : 'opacity-30'}`}>{av.id}</span></button>); })} <button onClick={() => { const names = onAddAvatar(); if (names?.length) sfd(prev => ({ ...prev, userIds: [...new Set([...prev.userIds, ...names])] })); }} className="flex flex-col items-center gap-1 shrink-0 active:scale-90"><div className="w-12 h-12 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center bg-white/30 text-black/40"><IconPlus size={20} /></div><span className="text-[9px] font-black uppercase opacity-40">Add</span></button></div></div>
                <div className="bg-white/40 border border-black/5 rounded-3xl p-5 flex flex-col items-center gap-6"><div><h4 className="text-[10px] font-black text-black/40 mb-3 uppercase text-center tracking-widest">Rate Plate</h4><div className="flex gap-2 justify-center">{[1, 2, 3, 4, 5].map(s => <NumberedStar key={s} value={s} rating={fd.rating} onClick={v => sfd({ ...fd, rating: v })} size={42} />)}</div></div><div className="h-px w-full bg-black/5" /><div className="text-center"><h4 className="text-[10px] font-black text-black/40 mb-3 uppercase tracking-widest">Rate Place</h4><div className="flex gap-2 justify-center">{[1, 2, 3, 4, 5].map(s => <NumberedStar key={s} value={s} rating={fd.placeRating} onClick={v => sfd({ ...fd, placeRating: v })} size={32} />)}</div></div></div>
                <div className="flex justify-between items-center bg-white/40 border border-black/5 rounded-2xl p-4"><div className="flex items-center gap-2"><IconPawPrint size={20} className={fd.petFriendly ? "text-[#92400E]" : "text-black/20"} /><span className="text-[11px] font-black uppercase text-black/40 tracking-widest">Pet Friendly</span></div><button onClick={() => sfd({ ...fd, petFriendly: !fd.petFriendly })} className={`w-12 h-6 rounded-full p-0.5 transition-colors ${fd.petFriendly ? 'bg-[#22C55E]' : 'bg-black/10'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${fd.petFriendly ? 'translate-x-6' : ''}`} /></button></div>
                <div>
                    <div className="text-center mb-4">
                        <h4 className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em] mb-1">Categorize Your Plate</h4>
                        <span className="text-[8px] font-black text-[#E2725B] uppercase tracking-widest">Select All That Apply</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {MASTER_CATEGORIES.map(cat => {
                            const isP = fd.primaryStyle === cat.id;
                            const isS = fd.secondaryStyles.includes(cat.id);
                            return (
                                <button key={cat.id} onClick={() => handleCat(cat.id)} className={`relative p-3 rounded-[1.25rem] text-left flex flex-col transition-all active:scale-95 border ${isP ? 'bg-white shadow-md border-white z-10' : isS ? 'bg-white/80 border-[#E2725B] shadow-sm' : 'bg-black/5 border-transparent shadow-inner'}`}>
                                    {isP && <div className="absolute -top-1.5 -right-1.5 bg-[#E2725B] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm shadow-[#E2725B]/30 rotate-3 z-20 pointer-events-none">Primary</div>}
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-2.5 h-2.5 rounded-full shadow-inner shrink-0" style={{ backgroundColor: cuisineMap && cuisineMap[cat.id] ? cuisineMap[cat.id] : '#000' }} />
                                        <span className={`text-[11px] font-black uppercase leading-none tracking-wider ${isP ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/70'}`}>{cat.id}</span>
                                    </div>
                                    <span className={`text-[8px] font-bold tracking-tight leading-none pl-4 mt-0.5 ${isP ? 'text-black/50' : 'text-black/30'}`}>e.g., {cat.subs}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">Vibe Notes</h4><textarea className="w-full h-24 bg-white/40 rounded-2xl border border-black/10 p-3 inner-fold text-[12px] font-bold resize-none focus:ring-0 border-none outline-none uppercase" placeholder="Atmosphere..." value={fd.notes} onChange={e => sfd({ ...fd, notes: e.target.value })} /></div>
                <button className="w-full py-3 rounded-2xl bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 text-[10px] font-black uppercase tracking-widest active:scale-95">Delete Plate</button>
            </div>
        </div>

        {/* BOTTOM PASSIVE CHIPS FOOTER */}
        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between gap-1.5 z-50 pointer-events-none">
            <div className="flex-1 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center truncate">
                <span className="text-[9px] font-black uppercase text-[#1A1A1A] truncate tracking-widest">{fd.place || 'LOCATION'}</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]">72° ☀️</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]">1:30 PM</span>
            </div>
        </div>
    </div>)
};

export const HomeView = ({ inputValue, setInputValue, setView }) => (
    <div className="absolute inset-0 flex flex-col px-6 gap-4 animate-in slide-in-from-right duration-500 pb-48 overflow-y-auto no-scrollbar uppercase">
        <header className="text-center shrink-0 mb-2 mt-4 uppercase"><h1 className="text-3xl font-black tracking-tighter italic text-[#1A1A1A]">PlatePartner</h1><p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E2725B] mt-1.5 italic">A FIVE-STAR JOURNEY</p></header>
        <div className="flex items-start gap-3 bg-white/40 rounded-[2rem] border border-black/10 p-4 inner-fold shrink-0 uppercase"><textarea value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={PROMPT_HOME} className="flex-grow bg-transparent border-none focus:ring-0 text-[12px] font-bold h-[110px] w-full resize-none outline-none placeholder:text-black/30" /><div className="flex flex-col gap-3 justify-between h-[110px] items-center pt-1"><IconMicSpark /><IconSearchGreen /></div></div>
        <div className="w-full p-4 pb-5 rounded-[2.5rem] text-center border-2 border-black/10 bg-white/5 shadow-lg shrink-0 italic font-black uppercase"><h2 className="text-2xl leading-none text-[#1A1A1A]">WELCOME</h2><h2 className="text-2xl leading-none text-[#1A1A1A]">JD</h2><div className="h-px bg-black/10 w-full my-3" /><div className="grid grid-cols-2 gap-0 text-[#1A1A1A]"><div className="flex flex-col items-center"><IconAwardGold size={22} /><span className="text-4xl leading-none mt-1 uppercase">28</span><span className="text-[8px] opacity-40 uppercase">5 Star Plates</span></div><div className="flex flex-col items-center border-l border-black/10"><IconHistoryGreen size={22} /><span className="text-4xl leading-none mt-1 uppercase">114</span><span className="text-[8px] opacity-40 uppercase">Plate Fills</span></div></div></div>
        <div className="grid grid-cols-2 gap-4 mt-auto mb-6 h-28 shrink-0 uppercase">
            <button onClick={() => setView('pantry')} className="relative h-full rounded-[2.5rem] text-white shadow-xl active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-[#E2725B]/90 z-0" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <IconHubBrochure />
                    <span className="font-black text-[10px] uppercase tracking-widest leading-none mt-1 uppercase">Plate Pantry</span>
                </div>
            </button>
            <button onClick={() => setView('pantry')} className="relative h-full rounded-[2.5rem] text-white shadow-xl active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-[#4F7942]/90 z-0" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <IconHubPlateSpoon />
                    <span className="font-black text-[10px] uppercase tracking-widest leading-none mt-1 uppercase">Fill My Plate</span>
                </div>
            </button>
        </div>
    </div>);

export const PantryView = ({ bucketedMeals, activeAvatars, availableAvatars, onToggleAvatar, onOpenCalendar, pantrySearch, setPantrySearch, onOpenCard, onAddNew, ghostCount }) => (
    <div className="absolute inset-0 flex flex-col animate-in slide-in-from-right duration-500 pb-48 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between shrink-0 px-6 pt-8 pb-2 uppercase tracking-widest"><h2 className="text-4xl font-black italic tracking-tighter text-[#1A1A1A]">Plate Pantry</h2><button onClick={onAddNew} className="bg-[#E2725B] text-white px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-md active:scale-95">+ ADD ITEM</button></div>
        {ghostCount > 0 && (<div className="px-6 mt-2 mb-4 shrink-0 animate-in slide-in-from-top duration-500"><div className="w-full p-3 rounded-2xl bg-[#EF4444] text-white shadow-md flex items-center justify-between animate-pulse"><div className="flex items-center gap-2"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-black text-[10px]">{ghostCount}</div><span className="text-[10px] font-black uppercase tracking-widest">Incomplete Plates Waiting</span></div><IconX size={16} /></div></div>)}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-6 shrink-0 mb-2">{availableAvatars.map(av => { const isActive = activeAvatars.includes(av.id); return (<button key={av.id} onClick={() => onToggleAvatar(av.id)} className="flex flex-col items-center gap-1 shrink-0 active:scale-90 transition-transform"><div className={`w-14 h-14 rounded-full border-2 p-0.5 transition-all duration-300 ${isActive ? 'border-[#EF4444]' : 'border-transparent grayscale opacity-30'}`}>{av.id === 'DOG' ? <div className="w-full h-full rounded-full border border-black/5 flex items-center justify-center bg-white shadow-inner overflow-hidden"><IconPawPrint className="text-black/80" size={38} /></div> : <img src={av.img} className="w-full h-full rounded-full object-cover" alt="u" />}</div><span className={`text-[10px] font-black uppercase ${isActive ? 'opacity-100 text-[#1A1A1A]' : 'opacity-30'}`}>{av.id}</span></button>); })}</div>
        <div className="px-6 mb-6 shrink-0"><div className="flex items-start gap-3 bg-white/40 rounded-[2.5rem] border border-black/10 p-5 inner-fold shadow-inner transition-all focus-within:bg-white/60"><textarea value={pantrySearch} onChange={e => setPantrySearch(e.target.value)} placeholder={PROMPT_PANTRY} className="flex-grow bg-transparent border-none focus:ring-0 text-[13px] font-bold leading-tight h-[80px] w-full resize-none outline-none placeholder:text-black/30" /><div className="flex flex-col gap-3 justify-between h-[80px] items-center pt-1"><IconMicSpark /><IconSearchGreen /></div></div></div>
        <div className="flex justify-center px-6 mb-8 shrink-0 uppercase tracking-widest"><button onClick={onOpenCalendar} className="w-[240px] bg-white rounded-[1.5rem] py-3 border border-black/10 shadow-sm flex items-center justify-center gap-3 active:scale-95 transition-all text-[#1A1A1A]"><IconCalendar size={18} /><span className="text-[12px] font-black uppercase tracking-[0.2em]">SHOW RECENT DATES</span><IconChevronDown /></button></div>
        <ChronoSection title="TODAY" meals={bucketedMeals.today} onOpenCard={onOpenCard} availableAvatars={availableAvatars} /><ChronoSection title="YESTERDAY" meals={bucketedMeals.yesterday} onOpenCard={onOpenCard} availableAvatars={availableAvatars} /><ChronoSection title="LAST 7 DAYS" meals={bucketedMeals.last7Days} onOpenCard={onOpenCard} availableAvatars={availableAvatars} /><ChronoSection title="LAST 14 DAYS" meals={bucketedMeals.last14Days} onOpenCard={onOpenCard} availableAvatars={availableAvatars} />
        <div className="pb-24 text-center px-10 shrink-0 uppercase tracking-widest"><button onClick={onOpenCalendar} className="group flex flex-col items-center gap-2 w-full active:scale-95 transition-transform"><div className="w-full h-px bg-black/5 mb-4" /><span className="text-[10px] font-black text-black/20 group-hover:text-[#E2725B] transition-colors italic">Select from History</span><IconCalendar size={18} className="text-black/10 group-hover:text-[#E2725B] transition-colors" /></button></div>
    </div>);