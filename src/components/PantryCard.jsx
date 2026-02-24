import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Icons, CuisineStyles } from './UiAssets';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Pantry Card (Flip Logic)
 * Logic: Tap = Tag/Hold. Long-press (600ms) = Flip to reveal Tip.
 */

const PantryCard = ({ item, isHeld, onToggleHold }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const pressTimer = useRef(null);

    // 1. Gesture Logic: Split Tap vs. Long-Press
    const handleStart = () => {
        pressTimer.current = setTimeout(() => {
            setIsFlipped(true);
            pressTimer.current = null;
            if (navigator.vibrate) navigator.vibrate(50); // Silent Resilience haptic
        }, 600);
    };

    const handleEnd = (e) => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
            // If it was a quick release, it's a Tag/Hold toggle
            if (!isFlipped) onToggleHold(item.id);
        }
    };

    const handleCancel = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    return (
        <div
            className={`relative w-full h-full perspective-1000 cursor-pointer transition-all ${isHeld ? 'scale-[1.02]' : ''}`}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleCancel}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            onTouchCancel={handleCancel}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* FRONT: The Standard 5-Star Recommendation */}
                <div className={`absolute inset-0 backface-hidden bg-white border-2 rounded-[2rem] p-6 flex flex-col justify-between
          ${isHeld ? 'border-amber-400 shadow-xl bg-amber-50' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
                    style={{ backfaceVisibility: 'hidden' }}>
                    <div className="flex justify-between items-start">
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest text-white"
                            style={{ backgroundColor: CuisineStyles[item.style]?.color }}>
                            {item.style}
                        </span>
                        {isHeld && <span className="text-amber-500 text-xs font-bold">TAGGED</span>}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 leading-tight mb-2">{item.name}</h4>
                        <div className="flex text-amber-400 text-[10px]">
                            {Array.from({ length: item.rating }).map((_, i) => <span key={i}>{Icons.STAR}</span>)}
                        </div>
                    </div>

                    {/* Tag/Hold Indicator */}
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${isHeld ? 'bg-amber-400 border-amber-400 text-white' : 'border-slate-100'}`}>
                        {isHeld ? '✓' : ''}
                    </div>
                </div>

                {/* BACK: The Future-Me Tip & Detailed DNA */}
                <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2.5rem] p-6 flex flex-col justify-center text-center rotate-y-180"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-4">Future-Me Tip</span>
                    <p className="text-sm text-slate-200 italic font-serif leading-relaxed">
                        "{item.tip || 'No tip recorded yet.'}"
                    </p>
                    <button
                        onClick={() => setIsFlipped(false)}
                        className="mt-6 text-[9px] text-slate-500 font-bold uppercase tracking-widest"
                    >
                        Tap to Flip Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PantryCard;