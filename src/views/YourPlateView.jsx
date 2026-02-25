import React, { useState, useEffect } from 'react';
import { IconX, IconShare2, IconMapPin, IconSparkles, IconPawPrint, IconCalendar, IconPlus, IconMicSpark } from '../Icons';
import { MASTER_CATEGORIES, NumberedStar } from './Shared';

export const YourPlateView = ({ activeCard, calendarSelectedDate, onClose, onSave, onDiscardGhost, pendingQueue = [], availableAvatars, onAddAvatar, onOpenCalendar, cuisineMap, onOpenMap }) => {
    const defaultState = { userIds: ['JD'], rating: 0, placeRating: 0, primaryStyle: null, secondaryStyles: [], petFriendly: false, notes: '', dish: '', place: '', date: 'Today' };
    const [fd, sfd] = useState(defaultState);
    const [isSearch, setIsSearch] = useState(false);
    const [hasAppliedGhost, setHasAppliedGhost] = useState(false);

    const currentGhost = !activeCard && pendingQueue.length > 0 ? pendingQueue[0] : null;

    useEffect(() => {
        setHasAppliedGhost(false);
        if (activeCard) {
            sfd({ ...defaultState, ...activeCard });
            // If it's a ghost card being reopened, hide the apply data banner since they already did it
            if (activeCard.isGhost && activeCard.place) {
                setHasAppliedGhost(true);
            }
        } else if (currentGhost) {
            sfd({
                ...defaultState,
                place: currentGhost.place || '',
                date: currentGhost.date || 'Today',
                dish: currentGhost.dish === 'Unknown Dish' ? '' : (currentGhost.dish || ''),
                img: currentGhost.img,
            });
        } else {
            sfd(defaultState);
        }
    }, [activeCard, currentGhost?.id]);

    useEffect(() => { if (calendarSelectedDate?.date) sfd(prev => ({ ...prev, date: calendarSelectedDate.date })); }, [calendarSelectedDate]);
    const handleCat = (cat) => sfd(prev => { if (prev.primaryStyle === cat) return { ...prev, primaryStyle: null }; if (!prev.primaryStyle) return { ...prev, primaryStyle: cat }; if (prev.secondaryStyles.includes(cat)) return { ...prev, secondaryStyles: prev.secondaryStyles.filter(c => c !== cat) }; return { ...prev, secondaryStyles: [...prev.secondaryStyles, cat] }; });

    const handleSaveWithPetCheck = () => {
        let finalData = { ...fd };
        if (finalData.petFriendly && !finalData.userIds.includes('DOG')) {
            if (window.confirm("You marked this plate as Pet Friendly. Would you like to add your pet to the avatars?")) {
                finalData.userIds = [...finalData.userIds, 'DOG'];
                sfd(finalData); // Update state instantly so UI reflects it before closing
            }
        }
        onSave(finalData, currentGhost?.id, pendingQueue.length > 1);
    };

    return (<div className="flex flex-col h-full animate-in slide-in-from-bottom duration-[600ms] relative bg-[#E8D4A9]">
        <div className="px-6 pt-10 pb-4 flex justify-between items-center border-b border-black/5 shrink-0 uppercase relative z-10"><div className="flex items-center"><button onClick={onClose} className="p-2 -ml-2 text-black/40 active:scale-90"><IconX size={24} /></button><h2 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A] ml-2">Your Plate</h2></div><div className="flex gap-3"><button className="p-1.5 text-black/40"><IconShare2 size={20} /></button><button onClick={handleSaveWithPetCheck} className="px-4 py-1.5 bg-[#4F7942] text-white text-[10px] font-black uppercase rounded-full shadow-md active:scale-95">Save</button></div></div>
        <div className="flex-1 overflow-y-auto no-scrollbar pt-6 px-6 space-y-8 uppercase pb-32">
            {/* VALIDATION BANNER */}
            {fd.rating === 0 && (
                <div className="w-full bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-[2rem] p-4 flex flex-col gap-1 shadow-inner relative overflow-hidden items-center justify-center text-center animate-in slide-in-from-top fade-in duration-300">
                    <span className="text-[12px] font-black uppercase tracking-widest text-[#EF4444] leading-tight">Rate Plate Required</span>
                    <span className="text-[9px] font-bold text-[#EF4444]/80 uppercase tracking-widest">A plate rating (1-5 stars) is needed to complete this card</span>
                </div>
            )}

            {/* DETECTED EVENT BANNER - Populated by Ghost Queue */}
            {currentGhost && !activeCard && !hasAppliedGhost && (
                <div className="w-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-[2rem] p-4 flex flex-col gap-3 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-md shrink-0">
                            <IconMapPin size={20} />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#D97706] leading-none mb-1">Unfinished Card Entries ({pendingQueue.length} Pending)</span>
                            <h3 className="text-[16px] font-black text-[#1A1A1A] leading-tight capitalize">{currentGhost.place || 'Unknown Place'}</h3>
                            <span className="text-[10px] font-bold text-black/50 mt-0.5 capitalize">{currentGhost.date} • Pending Review</span>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full mt-1 relative z-10">
                        <button onClick={() => onDiscardGhost(currentGhost.id, pendingQueue.length > 1)} className="flex-1 py-2.5 rounded-xl bg-white/60 text-[#D97706] font-black uppercase text-[10px] tracking-widest shadow-sm active:scale-95 transition-transform">Discard</button>
                        <button onClick={() => setHasAppliedGhost(true)} className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] text-white font-black uppercase text-[10px] tracking-widest shadow-md active:scale-95 transition-transform">Apply Data</button>
                    </div>
                </div>
            )}
            <button className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-[#4F7942] to-[#65A30D] text-white shadow-md flex items-center justify-center gap-3"><IconSparkles size={18} /><div className="flex flex-col items-start text-left"><span className="text-[11px] font-black mb-1">Auto-Fill with Voice</span><span className="text-[8px] font-bold opacity-80 uppercase">Describe meal, venue, vibe</span></div><div className="ml-auto bg-white/20 p-2 rounded-full"><IconMicSpark /></div></button>
            <div className="space-y-6">
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">Who?</h4><div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">{availableAvatars.map(av => { const isActive = fd.userIds.includes(av.id); return (<button key={av.id} onClick={() => sfd({ ...fd, userIds: isActive ? fd.userIds.filter(u => u !== av.id) : [...fd.userIds, av.id] })} className="flex flex-col items-center gap-1 shrink-0 active:scale-90"><div className={`w-12 h-12 rounded-full border-2 p-0.5 transition-all ${isActive ? 'border-[#EF4444]' : 'border-transparent grayscale opacity-30'}`}>{av.id === 'DOG' ? <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner"><IconPawPrint className="text-black/80" size={30} /></div> : <img src={av.img} className="w-full h-full rounded-full object-cover" alt="u" />}</div><span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100 text-[#1A1A1A]' : 'opacity-30'}`}>{av.id}</span></button>); })} <button onClick={() => { const names = onAddAvatar(); if (names?.length) sfd(prev => ({ ...prev, userIds: [...new Set([...prev.userIds, ...names])] })); }} className="flex flex-col items-center gap-1 shrink-0 active:scale-90"><div className="w-12 h-12 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center bg-white/30 text-black/40"><IconPlus size={20} /></div><span className="text-[9px] font-black uppercase opacity-40">Add</span></button></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">What meal was eaten?</h4><div className="bg-white/40 rounded-2xl border border-black/10 p-3 shadow-inner"><input type="text" placeholder="e.g. Steak and Mashed Potatoes" className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-bold uppercase" value={fd.dish} onChange={e => sfd({ ...fd, dish: e.target.value })} /></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">When?</h4><div className="flex gap-2">{['Today', 'Yesterday'].map(d => <button key={d} onClick={() => sfd({ ...fd, date: d })} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${fd.date === d ? 'bg-[#EF4444] text-white shadow-md' : 'bg-white/40 border-black/10 text-black/60'}`}>{d}</button>)}<button onClick={onOpenCalendar} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${fd.date !== 'Today' && fd.date !== 'Yesterday' ? 'bg-[#EF4444] text-white shadow-md' : 'bg-white/40 border-black/10 text-black/60'}`}>{fd.date !== 'Today' && fd.date !== 'Yesterday' ? fd.date : 'Past Date'}<IconCalendar size={14} /></button></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">What was the name of the place you ate this?</h4><div className="bg-white/40 rounded-2xl border border-black/10 p-3 shadow-inner flex items-center gap-2 mb-2"><IconMapPin size={14} className="text-black/30" /><input type="text" placeholder="Location..." className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-bold uppercase" value={fd.place} onChange={e => { sfd({ ...fd, place: e.target.value }); setIsSearch(e.target.value.length > 2); }} /></div><div onClick={() => fd.place && onOpenMap(fd)} className="w-full h-24 bg-[#E8D4A9] border border-black/10 rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden mb-2 cursor-pointer active:scale-95 transition-transform" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }}><div className="absolute inset-0 bg-[#3B82F6]/5 mix-blend-multiply" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] text-[#EF4444]"><IconMapPin fill="currentColor" size={24} /></div><span className="absolute bottom-2 text-[8px] font-black uppercase text-black/40 z-10 tracking-widest">{fd.place || 'TAP TO OPEN MAP'}</span></div>{isSearch && (<div className="rounded-2xl overflow-hidden border border-black/10 shadow-inner relative h-48 bg-[#DBC8A0] flex flex-col mb-4"><div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" /><div className="flex-1 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-[#EF4444] animate-bounce"><IconMapPin fill="currentColor" size={32} /></div><span className="absolute top-2 right-2 text-[8px] font-black uppercase bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm text-black/60">Drag to reposition fingers</span></div><div className="bg-white/95 backdrop-blur-md p-1 flex flex-col gap-1 z-10 shrink-0 border-t border-black/5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"><button onClick={() => { sfd({ ...fd, place: 'Sushi Zen' }); setIsSearch(false); }} className="font-black uppercase text-left w-full hover:bg-black/5 p-2 rounded transition-colors text-[#1A1A1A] text-[10px] flex items-center gap-2"><IconMapPin size={14} className="text-[#4F7942]" /> Sushi Zen <span className="text-[8px] opacity-40 ml-auto">(0.2mi)</span></button><button onClick={() => { sfd({ ...fd, place: 'Sushi Zen Express' }); setIsSearch(false); }} className="font-black uppercase text-left w-full hover:bg-black/5 p-2 rounded transition-colors text-black/50 text-[10px] flex items-center gap-2"><IconMapPin size={14} /> Sushi Zen Express <span className="text-[8px] opacity-40 ml-auto">(0.5mi)</span></button><div className="h-px bg-black/10 w-full my-0.5" /><button className="text-[9px] text-[#E2725B] uppercase font-black text-center p-2.5 w-full active:scale-95">Not here? Type city to redraw</button></div></div>)}</div>
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
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[50]">
            <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-[#E8D4A9]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)', backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }} />
            <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between gap-1.5 z-50 pointer-events-auto">
                <button onClick={() => fd.place && onOpenMap(fd)} className="flex-1 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center truncate active:scale-95 transition-transform">
                    <span className="text-[9px] font-black uppercase text-[#1A1A1A] truncate tracking-widest flex items-center gap-1"><IconMapPin size={10} className="text-[#3B82F6]" />{fd.place || 'LOCATION'}</span>
                </button>
                <div className="bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center shrink-0 flex-col gap-0.5">
                    <span className="text-[10px] font-black uppercase text-[#1A1A1A] leading-none">72° ☀️</span>
                    <span className="text-[9px] font-black uppercase text-black/40 leading-none">{fd.date === 'Today' || fd.date === 'Yesterday' ? fd.date : fd.date.split('-').slice(1).join('/')}</span>
                </div>
                <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black uppercase text-[#1A1A1A]">1:30 PM</span>
                </div>
            </div>
        </div>
    </div>)
};
