import React from 'react';
import { MASTER_CATEGORIES } from '../Shared';

export const CategoryGrid = ({ fd, cuisineMap, onSelectCategory }) => (
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
                    <button key={cat.id} onClick={() => onSelectCategory(cat.id)} className={`relative p-3 rounded-[1.25rem] text-left flex flex-col transition-all active:scale-95 border ${isP ? 'bg-white shadow-md border-white z-10' : isS ? 'bg-white/80 border-[#E2725B] shadow-sm' : 'bg-black/5 border-transparent shadow-inner'}`}>
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
);
