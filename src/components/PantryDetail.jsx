import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Receipt, Mic, MapPin, CloudSun, Clock, Star, Plus, Check } from 'lucide-react';

/**
 * Project: PlatePartner - Restoration Phase (v14.1)
 * Component: Pantry Detail (The "Your Plate" Master Editor)
 * Logic: Matches exact mockup hierarchy including Ghost Toasts and Styles.
 */

const CUISINES = [
    { id: "American", color: "#1D4ED8", sub: "Burgers, BBQ, Diner" },
    { id: "Italian", color: "#15803D", sub: "Pizza, Pasta, European" },
    { id: "Mexican", color: "#EA580C", sub: "Tacos, Burritos, Latin" },
    { id: "Asian", color: "#DC2626", sub: "Sushi, Ramen, Stir-Fry" },
    { id: "Indian", color: "#D97706", sub: "Curry, Tikka, Naan" },
    { id: "Seafood", color: "#06B6D4", sub: "Fish, Crab, Oysters" },
    { id: "Fast Food", color: "#CA8A04", sub: "Drive-Thru, Quick Bites" },
    { id: "Sandwiches", color: "#854D0E", sub: "Subs, Wraps, Paninis" },
    { id: "Healthy", color: "#65A30D", sub: "Salads, Vegan, Bowls" },
    { id: "Cafe & Dessert", color: "#DB2777", sub: "Coffee, Pastries" }
];

const PantryDetail = ({ meal, onClose, onSave, onDelete }) => {
    const [dish, setDish] = useState(meal?.dish || "");
    const [place, setPlace] = useState(meal?.place || meal?.location || "");
    const [rating, setRating] = useState(meal?.rating || 0);
    const [notes, setNotes] = useState(meal?.notes || "");
    const [selectedStyle, setSelectedStyle] = useState(meal?.style || "");
    const [owners, setOwners] = useState(['JD']); // Defaulting to JD per mockup

    const innerFold = "shadow-[inset_2px_4px_12px_rgba(0,0,0,0.1)]";

    const handleSave = () => {
        onSave({
            ...meal,
            dish,
            place,
            rating,
            notes,
            style: selectedStyle,
            timestamp: meal?.timestamp || Date.now()
        });
    };

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-[800] parchment-root flex flex-col"
        >
            {/* 1. HEADER */}
            <header className="px-6 pt-12 pb-4 flex justify-between items-center border-b border-black/10 shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 text-black/40"><X size={24} /></button>
                <h2 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A]">Your Plate</h2>
                <button onClick={handleSave} className="bg-[#4F7942] text-white px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md">SAVE</button>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-8 pb-32">

                {/* 2. GHOST EVENT TOAST (Only if Location exists but no Dish) */}
                {!meal?.dish && meal?.location && (
                    <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-[1.5rem] p-4 flex flex-col gap-3 shadow-sm animate-in slide-in-from-top-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0"><MapPin size={20} /></div>
                            <div className="flex flex-col pt-0.5">
                                <span className="text-[10px] font-black uppercase text-[#B45309]">Detected Event (3 Pending)</span>
                                <span className="text-[14px] font-black text-[#1A1A1A]">{meal.location}</span>
                                <span className="text-[10px] font-bold text-black/40">Yesterday • 7:15 PM</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-black/10 text-black/40 text-[10px] font-black uppercase bg-white/50">DISCARD</button>
                            <button className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] text-white text-[10px] font-black uppercase shadow-md">APPLY DATA</button>
                        </div>
                    </div>
                )}

                {/* 3. VOICE LOGGING BUTTON */}
                <button className="w-full py-4 rounded-[1.5rem] bg-[#4F7942] text-white shadow-md flex items-center justify-center gap-3 active:scale-95 transition-transform">
                    <Mic size={22} />
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">AUTO-FILL WITH VOICE</span>
                        <span className="text-[8px] font-bold opacity-80 uppercase">Tap to start, describe meal, tap to end</span>
                    </div>
                </button>

                {/* 4. WHO ATE THIS? */}
                <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4 text-center">WHO ATE THIS?</h4>
                    <div className="flex justify-center gap-4">
                        {['JD', 'SM', 'DOG'].map((name) => (
                            <div key={name} className="flex flex-col items-center gap-1.5">
                                <button className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${owners.includes(name) ? 'border-[#E2725B] bg-white scale-110 shadow-md' : 'border-black/5 bg-white/40'}`}>
                                    {name}
                                </button>
                                <span className="text-[8px] font-black text-black/30 uppercase">{name}</span>
                            </div>
                        ))}
                        <button className="w-14 h-14 rounded-full border-2 border-dashed border-black/10 flex items-center justify-center text-black/20"><Plus size={20} /></button>
                    </div>
                </section>

                {/* 5. CORE INPUTS */}
                <section className="space-y-4">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">WHAT WAS EATEN?</h4>
                        <div className={`${innerFold} bg-white/40 rounded-[1rem] border border-black/10 px-4 py-3`}>
                            <input type="text" value={dish} onChange={(e) => setDish(e.target.value)} placeholder="e.g., Spicy Tuna Roll" className="w-full bg-transparent border-none text-sm font-bold outline-none" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">WHERE IS IT FROM?</h4>
                        <div className={`${innerFold} bg-white/40 rounded-[1rem] border border-black/10 px-4 py-3 flex items-center gap-2`}>
                            <MapPin size={16} className="text-black/20" />
                            <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g., Sushi Zen" className="w-full bg-transparent border-none text-sm font-bold outline-none" />
                        </div>
                    </div>
                </section>

                {/* 6. STAR RATINGS */}
                <section className="flex flex-col items-center gap-6 py-2">
                    <div className="text-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3">RATE THIS PLATE</h4>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => <button key={s} onClick={() => setRating(s)} className={`p-2 rounded-2xl border transition-all ${rating >= s ? 'bg-[#D4AF37] text-white' : 'bg-white/40 border-black/5 text-black/5'}`}><Star size={28} fill={rating >= s ? "currentColor" : "none"} /></button>)}
                        </div>
                    </div>
                </section>

                {/* 7. CUISINE STYLE GRID */}
                <section>
                    <div className="text-center mb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40">CATEGORIZE YOUR PLATE</h4>
                        <span className="text-[8px] font-bold text-black/20 uppercase">SELECT ALL THAT APPLY</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {CUISINES.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedStyle(c.id)}
                                className={`p-3 rounded-2xl border text-left flex flex-col transition-all active:scale-95 relative overflow-hidden ${selectedStyle === c.id ? 'bg-white border-black/20 shadow-md scale-[1.02]' : 'bg-white/30 border-black/5'}`}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></div>
                                    <span className="text-[11px] font-black uppercase text-[#1A1A1A]">{c.id}</span>
                                </div>
                                <span className="text-[8px] font-bold text-black/30 leading-tight">e.g., {c.sub}</span>
                                {selectedStyle === c.id && <div className="absolute top-2 right-2 text-[#4F7942]"><Check size={12} strokeWidth={4} /></div>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 8. VIBE NOTES */}
                <section>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">VIBE NOTES & DETAILS</h4>
                    <div className={`${innerFold} bg-white/40 rounded-2xl border border-black/10 p-4 relative`}>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How was the atmosphere? Did you ask for extra sauce?" className="w-full bg-transparent border-none text-sm font-bold placeholder:text-black/20 resize-none outline-none h-32 italic" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-black/30">
                            <Camera size={14} />
                            <span className="text-[9px] font-black uppercase">ADD RECEIPT / MENU PHOTO</span>
                        </div>
                        <div className="absolute bottom-3 right-4 text-[9px] font-bold text-black/20">{notes.length}/500</div>
                    </div>
                </section>
            </div>

            {/* 9. FOOTER CHIPS */}
            <footer className="absolute bottom-0 left-0 w-full p-6 bg-[#E8D4A9] border-t border-black/10 flex flex-col items-center">
                <span className="text-[8px] font-black uppercase text-black/30 mb-3 tracking-widest">AUTO-LOGGING DATA</span>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full shadow-sm text-[#4F7942]"><MapPin size={12} /><span className="text-[9px] font-black uppercase">LOCATION</span></div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full shadow-sm text-[#D4AF37]"><CloudSun size={12} /><span className="text-[9px] font-black uppercase">WEATHER</span></div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full shadow-sm text-[#5B84B1]"><Clock size={12} /><span className="text-[9px] font-black uppercase">TIME</span></div>
                </div>
            </footer>
        </motion.div>
    );
};

export default PantryDetail;