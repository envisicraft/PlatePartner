import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Mic, X } from 'lucide-react';

/**
 * Project: PlatePartner - Restoration Phase (v10.3)
 * Component: Morning Whisper (The Tailed Companion Bubble)
 * Logic: Animated ChefBot with original ChatTail SVG assets.
 */

const ChefBotIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 text-[#1A1A1A] animate-[bounce_3s_infinite_ease-in-out]">
        <g fill="white" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M 25 60 C 12 60, 12 75, 25 75" />
            <path d="M 75 60 C 88 60, 88 75, 75 75" />
            <rect x="25" y="45" width="50" height="35" rx="8" />
            <rect x="28" y="32" width="44" height="13" />
            <path d="M 28 32 C 15 32, 15 18, 30 18 C 35 6, 48 6, 50 14 C 52 6, 65 6, 70 18 C 85 18, 85 32, 72 32 Z" />
        </g>
        <circle cx="40" cy="62" r="4" fill="currentColor" />
        <circle cx="60" cy="62" r="4" fill="currentColor" />
        <path d="M 45 72 Q 50 78 55 72" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const ChatTail = () => (
    <svg viewBox="0 0 20 20" className="absolute -bottom-1 -left-2 w-6 h-6 text-white z-0" style={{ filter: "drop-shadow(-2px 4px 4px rgba(0,0,0,0.05))" }} fill="currentColor">
        <path d="M20 0 V20 Q10 20 0 20 Q10 10 20 0 Z" />
    </svg>
);

const MorningWhisper = ({ isVisible, visits, onVault, onIgnore }) => {
    const [rating, setRating] = useState(0);
    const [tip, setTip] = useState('');

    if (!isVisible || visits.length === 0) return null;
    const activeVisit = visits[0];

    const innerFold = "shadow-[inset_2px_4px_12px_rgba(0,0,0,0.1)]";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[500] bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-[320px] relative"
                >
                    {/* The Companion Icon Stack */}
                    <div className="flex gap-3 items-end mb-1 relative z-20">
                        <div className="w-12 h-12 shrink-0 relative z-10 drop-shadow-md rounded-full bg-gradient-to-br from-[#E8D4A9] to-white/60 border border-white/60 flex items-center justify-center overflow-hidden">
                            <ChefBotIcon />
                        </div>

                        {/* The Speech Bubble */}
                        <div className="relative z-10 bg-white p-5 pb-6 rounded-[2rem] rounded-bl-[4px] shadow-2xl border border-black/5 text-[#1A1A1A] w-full">
                            <ChatTail />

                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E2725B] block mb-2">Morning Reflection</span>
                            <p className="text-[14px] font-bold leading-tight mb-4">
                                How was your meal at <span className="text-[#4F7942] italic">{activeVisit.location}</span>?
                            </p>

                            {/* Tactile Star Input */}
                            <div className="flex gap-2 mb-6 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`transition-all transform active:scale-75 ${rating >= star ? 'text-[#D4AF37]' : 'text-black/5'}`}
                                    >
                                        <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>

                            <div className={`${innerFold} bg-black/5 rounded-2xl p-3 mb-6`}>
                                <textarea
                                    placeholder="Any tips for your future self?"
                                    value={tip}
                                    onChange={(e) => setTip(e.target.value)}
                                    className="w-full bg-transparent border-none text-[12px] font-bold placeholder:text-black/20 resize-none outline-none h-16 italic"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    disabled={rating === 0}
                                    onClick={() => onVault(activeVisit.id, rating, tip)}
                                    className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg disabled:opacity-20 transition-all active:scale-95"
                                >
                                    Vault Memory
                                </button>

                                <button
                                    onClick={() => onIgnore(activeVisit)}
                                    className="w-full py-2 text-black/30 font-black text-[9px] uppercase tracking-widest hover:text-black/60"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MorningWhisper;