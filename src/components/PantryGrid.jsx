import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Pencil } from 'lucide-react';

/**
 * Project: PlatePartner - Restoration Phase (v12.2)
 * Component: 2x3 Pantry Grid (The Crystallized Plates)
 * Logic: Integrated tap-to-flip and tap-to-edit logic.
 */

const PantryGrid = ({ pantry, onEditPlate }) => {
    const [displayItems, setDisplayItems] = useState([]);
    const [flippedId, setFlippedId] = useState(null);

    // 1. FILTER: Display only 5-star "Perfect Plates"
    const validPool = useMemo(() => {
        return pantry.filter(item => item.rating === 5);
    }, [pantry]);

    useEffect(() => {
        if (validPool.length > 0 && displayItems.length === 0) {
            setDisplayItems(validPool.slice(0, 6));
        }
    }, [validPool, displayItems.length]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A] opacity-40 italic">Your Top 6</h3>
                <button
                    onClick={() => setDisplayItems([...validPool].sort(() => 0.5 - Math.random()).slice(0, 6))}
                    className="text-[#E2725B] text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all"
                >
                    Reshuffle
                </button>
            </div>

            {/* 2. THE TACTILE 2x3 GRID */}
            <div className="grid grid-cols-2 gap-4 pb-10">
                {displayItems.map((item, idx) => (
                    <div key={item.id || idx} className="relative h-48 perspective-1000">
                        <motion.div
                            onClick={() => setFlippedId(flippedId === item.id ? null : item.id)}
                            animate={{ rotateY: flippedId === item.id ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full relative preserve-3d cursor-pointer"
                            style={{ rotate: idx % 2 === 0 ? '-2deg' : '1.5deg' }}
                        >
                            {/* FRONT: The 5-Star Plate */}
                            <div className="absolute inset-0 backface-hidden bg-white rounded-[2.2rem] p-4 shadow-lg border border-black/5 flex flex-col justify-between overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                                <span className="text-[8px] font-black uppercase tracking-widest text-[#E2725B] relative z-10">
                                    {item.style || "STYLE"}
                                </span>

                                <div className="h-24 w-full bg-black/5 rounded-2xl mb-2 flex items-center justify-center relative overflow-hidden shadow-inner">
                                    {item.img ? (
                                        <img src={item.img} alt={item.dish} className="w-full h-full object-cover opacity-90" />
                                    ) : (
                                        <span className="text-[10px] font-black text-black/10 uppercase tracking-widest">No Image</span>
                                    )}
                                </div>

                                <h4 className="font-black text-[11px] text-[#1A1A1A] leading-tight relative z-10 truncate pr-6">
                                    {item.dish || "Unnamed Plate"}
                                </h4>

                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex gap-0.5 text-[#D4AF37]">
                                        <Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" /><Star size={8} fill="currentColor" />
                                    </div>

                                    {/* 3. EDIT TRIGGER: Tapping this opens full detail */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEditPlate(item); }}
                                        className="p-1.5 rounded-full bg-black/5 text-black/20 hover:text-[#E2725B] hover:bg-[#E2725B]/10 active:scale-90 transition-all"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* BACK: Future-Me Tip */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1A1A1A] rounded-[2.2rem] p-6 flex flex-col items-center justify-center text-center shadow-2xl">
                                <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest mb-3">Future-Me Tip</span>
                                <p className="text-[11px] text-white/90 italic leading-relaxed font-serif">
                                    "{item.tip || item.notes || "No tip saved for this location."}"
                                </p>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PantryGrid;