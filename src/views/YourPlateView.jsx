import React, { useState, useEffect } from 'react';
import { IconX, IconShare2, IconMapPin, IconSparkles, IconPawPrint, IconCalendar, IconPlus, IconMicSpark, IconCamera, IconReceipt } from '../Icons';
import { MASTER_CATEGORIES, NumberedStar, formatDate } from './Shared';
import { PlateEditorHeader } from './plate-editor/PlateEditorHeader';
import { GhostEventBanner } from './plate-editor/GhostEventBanner';
import { CategoryGrid } from './plate-editor/CategoryGrid';
import { PlateEditorFooter } from './plate-editor/PlateEditorFooter';

export const YourPlateView = ({ activeCard, calendarSelectedDate, onClose, onSave, onDiscardGhost, pendingQueue = [], availableAvatars, onAddAvatar, onOpenCalendar, cuisineMap, onOpenMap }) => {
    const defaultState = { userIds: ['JD'], rating: 0, placeRating: 0, primaryStyle: null, secondaryStyles: [], petFriendly: false, notes: '', dish: '', place: '', date: 'Today', hasAppliedData: false, isGhost: false };
    const [fd, sfd] = useState(defaultState);
    const [isSearch, setIsSearch] = useState(false);

    const currentGhost = !activeCard && pendingQueue.length > 0 ? pendingQueue[0] : null;
    const ghostSource = activeCard?.isGhost ? activeCard : currentGhost;

    const getAiEnrichedData = (source) => {
        const placeName = source?.place?.toLowerCase() || '';
        const isCafe = placeName.includes('cafe') || placeName.includes('coffee');
        const isSushi = placeName.includes('sushi');
        const isBurger = placeName.includes('burger');

        let aiStyle = null;
        let aiSecondary = [];
        let aiNotes = '';
        let aiPetFriendly = false;

        if (isCafe) {
            aiStyle = 'Coffee/Tea'; aiSecondary = ['Breakfast/Brunch', 'Cafe & Dessert'];
            aiNotes = 'AI Insight: Highly pet-friendly patio. Known for lattes and avocado toast.';
            aiPetFriendly = true;
        } else if (isSushi) {
            aiStyle = 'Asian'; aiSecondary = ['Seafood'];
            aiNotes = 'AI Insight: Authentic omakase. Intimate vibe. Not very dog friendly.';
        } else if (isBurger) {
            aiStyle = 'Burger'; aiSecondary = ['American', 'Fast Food'];
            aiNotes = 'AI Insight: Casual spot, burgers average $15. Great local beer selection.';
        } else if (placeName) {
            aiStyle = 'American'; aiNotes = 'AI Insight: Popular spot for dinner, moderately priced.';
        }

        return {
            place: source?.place || '',
            date: source?.date || 'Today',
            dish: source?.dish === 'Unknown Dish' ? '' : (source?.dish || ''),
            img: source?.img || null,
            primaryStyle: aiStyle,
            secondaryStyles: aiSecondary,
            notes: aiNotes,
            petFriendly: aiPetFriendly,
        };
    };

    useEffect(() => {
        if (activeCard) {
            sfd({
                ...defaultState,
                ...activeCard,
                place: activeCard.hasAppliedData ? activeCard.place : '',
                dish: activeCard.hasAppliedData ? activeCard.dish : (activeCard.dish === 'Unknown Dish' ? '' : activeCard.dish),
                date: activeCard.hasAppliedData ? activeCard.date : 'Today',
            });
        } else if (currentGhost) {
            sfd({
                ...defaultState,
                ...currentGhost,
                isGhost: true,
                id: currentGhost.id,
                place: currentGhost.place || '',
                dish: currentGhost.dish === 'Unknown Dish' ? '' : (currentGhost.dish || ''),
                date: currentGhost.date || 'Today',
            });
        } else {
            sfd(defaultState);
        }
    }, [activeCard, currentGhost?.id]);

    useEffect(() => { if (calendarSelectedDate?.date) sfd(prev => ({ ...prev, date: calendarSelectedDate.date })); }, [calendarSelectedDate]);
    const handleCat = (cat) => sfd(prev => { if (prev.primaryStyle === cat) return { ...prev, primaryStyle: null }; if (!prev.primaryStyle) return { ...prev, primaryStyle: cat }; if (prev.secondaryStyles.includes(cat)) return { ...prev, secondaryStyles: prev.secondaryStyles.filter(c => c !== cat) }; return { ...prev, secondaryStyles: [...prev.secondaryStyles, cat] }; });

    const handleApplyData = () => {
        if (!ghostSource) return;
        const aiData = getAiEnrichedData(ghostSource);
        sfd(prev => ({
            ...prev,
            ...aiData,
            primaryStyle: prev.primaryStyle || aiData.primaryStyle,
            secondaryStyles: prev.secondaryStyles.length ? prev.secondaryStyles : aiData.secondaryStyles,
            notes: prev.notes || aiData.notes,
            petFriendly: prev.petFriendly || aiData.petFriendly,
            userIds: (prev.petFriendly || aiData.petFriendly) && !prev.userIds.includes('DOG') ? [...prev.userIds, 'DOG'] : prev.userIds,
            hasAppliedData: true
        }));
    };

    const handleSaveWithPetCheck = () => {
        let finalData = { ...fd };
        if (finalData.petFriendly && !finalData.userIds.includes('DOG')) {
            if (window.confirm("You marked this plate as Pet Friendly! Would you like to add an avatar for your pet?")) {
                finalData.userIds = [...finalData.userIds, 'DOG'];
                sfd(finalData); // Update state instantly so UI reflects it before closing
            }
        }
        if (!finalData.hasAppliedData && ghostSource) {
            finalData.place = ghostSource.place || '';
            finalData.dish = ghostSource.dish === 'Unknown Dish' ? '' : (ghostSource.dish || '');
            finalData.date = ghostSource.date || 'Today';
            finalData.img = ghostSource.img;
        }
        onSave(finalData, currentGhost?.id, pendingQueue.length > 1);
    };

    return (<div className="flex flex-col h-full animate-in slide-in-from-bottom duration-[600ms] relative bg-[#E8D4A9]">
        <PlateEditorHeader onClose={onClose} onSave={handleSaveWithPetCheck} />
        <div className="flex-1 overflow-y-auto no-scrollbar pt-6 px-6 space-y-8 uppercase pb-32">
            {/* VALIDATION BANNER */}
            {fd.rating === 0 && fd.hasAppliedData && (
                <div className="w-full bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-[2rem] p-4 flex flex-col gap-1 shadow-inner relative overflow-hidden items-center justify-center text-center animate-in slide-in-from-top fade-in duration-300">
                    <span className="text-[12px] font-black uppercase tracking-widest text-[#EF4444] leading-tight">Rate Plate Required</span>
                    <span className="text-[9px] font-bold text-[#EF4444]/80 uppercase tracking-widest">A plate rating (1-5 stars) is needed to complete this card</span>
                </div>
            )}

            {/* QUICK MEDIA ACTIONS */}
            <div className="flex gap-3 relative z-10 w-full">
                <button className="flex-1 bg-white/60 border border-black/10 rounded-[1.25rem] py-3.5 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm"><IconCamera size={26} className="text-[#4F7942]" /><span className="text-[10px] font-black uppercase text-black/60 tracking-widest">Add Photo</span></button>
                <button className="flex-1 bg-white/60 border border-black/10 rounded-[1.25rem] py-3.5 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm"><IconReceipt size={26} className="text-[#3B82F6]" /><span className="text-[10px] font-black uppercase text-black/60 tracking-widest">Scan Receipt</span></button>
            </div>

            {/* DETECTED EVENT BANNER - Populated by Ghost Queue */}
            <GhostEventBanner
                ghostSource={ghostSource}
                pendingCount={pendingQueue.length}
                hasAppliedData={fd.hasAppliedData}
                onDiscard={() => onDiscardGhost(ghostSource.id, pendingQueue.length > 1)}
                onApply={handleApplyData}
            />
            <button className="w-full h-[3.25rem] px-5 bg-gradient-to-r from-[#4F7942] to-[#65A30D] rounded-[1.5rem] text-white shadow-md flex items-center gap-3 relative overflow-hidden active:scale-95 transition-transform">
                <IconSparkles size={18} />
                <div className="flex flex-col items-start text-left flex-1">
                    <span className="text-[11px] font-black mb-0.5 uppercase tracking-wide">Auto-Fill with Voice</span>
                    <span className="text-[8px] font-bold opacity-80 uppercase leading-none tracking-widest">Describe meal, venue, vibe</span>
                </div>
                <div className="bg-white/20 p-2 rounded-full mr-2 scale-[0.85]">
                    <IconMicSpark />
                </div>
            </button>
            <div className="space-y-6">
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">Who?</h4><div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">{availableAvatars.map(av => { const isActive = fd.userIds.includes(av.id); return (<button key={av.id} onClick={() => sfd({ ...fd, userIds: isActive ? fd.userIds.filter(u => u !== av.id) : [...fd.userIds, av.id] })} className="flex flex-col items-center gap-1 shrink-0 active:scale-90"><div className={`w-12 h-12 rounded-full border-2 p-0.5 transition-all ${isActive ? 'border-[#EF4444]' : 'border-transparent grayscale opacity-30'}`}>{av.id === 'DOG' ? <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner"><IconPawPrint className="text-black/80" size={30} /></div> : <img src={av.img} className="w-full h-full rounded-full object-cover" alt="u" />}</div><span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100 text-[#1A1A1A]' : 'opacity-30'}`}>{av.id}</span></button>); })} <button onClick={() => { const names = onAddAvatar(); if (names?.length) sfd(prev => ({ ...prev, userIds: [...new Set([...prev.userIds, ...names])] })); }} className="flex flex-col items-center gap-1 shrink-0 active:scale-90"><div className="w-12 h-12 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center bg-white/30 text-black/40"><IconPlus size={20} /></div><span className="text-[9px] font-black uppercase opacity-40">Add</span></button></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">What meal was eaten?</h4><div className="bg-white/40 rounded-2xl border border-black/10 p-3 shadow-inner"><input type="text" placeholder="e.g. Steak and Mashed Potatoes" className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-bold uppercase" value={fd.dish} onChange={e => sfd({ ...fd, dish: e.target.value })} /></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">When?</h4><div className="flex gap-2">{['Today', 'Yesterday'].map(d => <button key={d} onClick={() => sfd({ ...fd, date: d })} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${fd.date === d ? 'bg-[#EF4444] text-white shadow-md' : 'bg-white/40 border-black/10 text-black/60'}`}>{d}</button>)}<button onClick={onOpenCalendar} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${fd.date !== 'Today' && fd.date !== 'Yesterday' ? 'bg-[#EF4444] text-white shadow-md' : 'bg-white/40 border-black/10 text-black/60'}`}>{fd.date !== 'Today' && fd.date !== 'Yesterday' ? formatDate(fd.date) : 'Past Date'}<IconCalendar size={14} /></button></div></div>
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">What was the name of the place you ate this?</h4><div className="bg-white/40 rounded-2xl border border-black/10 p-3 shadow-inner flex items-center gap-2 mb-2"><IconMapPin size={14} className="text-black/30" /><input type="text" placeholder="Location..." className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-bold uppercase" value={fd.place} onChange={e => { sfd({ ...fd, place: e.target.value }); setIsSearch(e.target.value.length > 2); }} /></div><div onClick={() => fd.place && onOpenMap(fd)} className="w-full h-24 bg-[#E8D4A9] border border-black/10 rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden mb-2 cursor-pointer active:scale-95 transition-transform" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }}><div className="absolute inset-0 bg-[#3B82F6]/5 mix-blend-multiply" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] text-[#EF4444]"><IconMapPin fill="currentColor" size={24} /></div><span className="absolute bottom-2 text-[8px] font-black uppercase text-black/40 z-10 tracking-widest">{fd.place || 'TAP TO OPEN MAP'}</span></div>{isSearch && (<div className="rounded-2xl overflow-hidden border border-black/10 shadow-inner relative h-48 bg-[#DBC8A0] flex flex-col mb-4"><div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" /><div className="flex-1 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-[#EF4444] animate-bounce"><IconMapPin fill="currentColor" size={32} /></div><span className="absolute top-2 right-2 text-[8px] font-black uppercase bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm text-black/60">Drag to reposition fingers</span></div><div className="bg-white/95 backdrop-blur-md p-1 flex flex-col gap-1 z-10 shrink-0 border-t border-black/5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"><button onClick={() => { sfd({ ...fd, place: 'Sushi Zen' }); setIsSearch(false); }} className="font-black uppercase text-left w-full hover:bg-black/5 p-2 rounded transition-colors text-[#1A1A1A] text-[10px] flex items-center gap-2"><IconMapPin size={14} className="text-[#4F7942]" /> Sushi Zen <span className="text-[8px] opacity-40 ml-auto">(0.2mi)</span></button><button onClick={() => { sfd({ ...fd, place: 'Sushi Zen Express' }); setIsSearch(false); }} className="font-black uppercase text-left w-full hover:bg-black/5 p-2 rounded transition-colors text-black/50 text-[10px] flex items-center gap-2"><IconMapPin size={14} /> Sushi Zen Express <span className="text-[8px] opacity-40 ml-auto">(0.5mi)</span></button><div className="h-px bg-black/10 w-full my-0.5" /><button className="text-[9px] text-[#E2725B] uppercase font-black text-center p-2.5 w-full active:scale-95">Not here? Type city to redraw</button></div></div>)}</div>
                <div className="bg-white/40 border border-black/5 rounded-3xl p-5 flex flex-col items-center gap-6"><div><h4 className="text-[10px] font-black text-black/40 mb-3 uppercase text-center tracking-widest">Rate Plate</h4><div className="flex gap-2 justify-center">{[1, 2, 3, 4, 5].map(s => <NumberedStar key={s} value={s} rating={fd.rating} onClick={v => sfd({ ...fd, rating: v })} size={42} />)}</div></div><div className="h-px w-full bg-black/5" /><div className="text-center"><h4 className="text-[10px] font-black text-black/40 mb-3 uppercase tracking-widest">Rate Place</h4><div className="flex gap-2 justify-center">{[1, 2, 3, 4, 5].map(s => <NumberedStar key={s} value={s} rating={fd.placeRating} onClick={v => sfd({ ...fd, placeRating: v })} size={32} />)}</div></div></div>
                <div className="flex justify-between items-center bg-white/40 border border-black/5 rounded-2xl p-4">
                    <div className="flex items-center gap-2"><IconPawPrint size={20} className={fd.petFriendly ? "text-[#92400E]" : "text-black/20"} /><span className="text-[11px] font-black uppercase text-black/40 tracking-widest">Pet Friendly</span></div>
                    <button onClick={() => sfd({ ...fd, petFriendly: !fd.petFriendly })} className={`w-12 h-6 rounded-full p-0.5 transition-colors shadow-inner border border-black/5 ${fd.petFriendly ? 'bg-[#22C55E]' : 'bg-black/10'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${fd.petFriendly ? 'translate-x-6' : ''}`} />
                    </button>
                </div>
                <CategoryGrid fd={fd} cuisineMap={cuisineMap} onSelectCategory={handleCat} />
                <div><h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">Vibe Notes</h4><textarea className="w-full h-24 bg-white/40 rounded-2xl border border-black/10 p-3 inner-fold text-[12px] font-bold resize-none focus:ring-0 border-none outline-none uppercase" placeholder="Atmosphere..." value={fd.notes} onChange={e => sfd({ ...fd, notes: e.target.value })} /></div>
                <button className="w-full py-3 rounded-2xl bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 text-[10px] font-black uppercase tracking-widest active:scale-95">Delete Plate</button>
            </div>
        </div>

        <PlateEditorFooter fd={fd} onOpenMap={onOpenMap} />
    </div>)
};
