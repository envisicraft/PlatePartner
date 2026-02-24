import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons, CuisineStyles } from './UiAssets';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Daily Slate Shortcut
 * Logic: Chronological list of Plate Pantry cards for a specific day.
 */

const DailySlate = ({ isOpen, onClose, day, meals = [] }) => {
    // 1. Vertical Time Logic: Sort chronologically (Morning -> Evening)
    const sortedMeals = [...meals].sort((a, b) => (a.timeValue || 0) - (b.timeValue || 0));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Slate Panel */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative bg-[#FDFCF8] w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        <header className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Daily Slate</span>
                                <h2 className="text-2xl font-bold font-serif text-slate-800">Day {day}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ✕
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {sortedMeals.length > 0 ? (
                                sortedMeals.map((meal) => (
                                    <div key={meal.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            {/* Cuisine Style Pill */}
                                            <span
                                                className="text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest text-white"
                                                style={{ backgroundColor: CuisineStyles[meal.style]?.color || '#CBD5E1' }}
                                            >
                                                {meal.style}
                                            </span>
                                            {/* Rating DNA: 1-5 Stars */}
                                            <div className="flex text-amber-400 text-xs gap-0.5">
                                                {Array.from({ length: meal.rating || 0 }).map((_, i) => (
                                                    <span key={i}>{Icons.STAR}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-bold text-slate-800 mb-1">{meal.location}</h4>

                                        {/* Time Window Marker */}
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mb-4">
                                            {meal.timeValue <= 11 ? 'Morning' : meal.timeValue <= 16 ? 'Midday' : 'Evening'} Entry
                                        </p>

                                        {meal.tip && (
                                            <div className="bg-slate-50 rounded-2xl p-4 border-l-4 border-amber-200">
                                                <p className="text-xs text-slate-500 italic font-serif leading-relaxed">
                                                    "{meal.tip}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center opacity-30">
                                    <p className="text-sm italic">No entries for this day.</p>
                                </div>
                            )}
                        </div>

                        <footer className="p-8 bg-white border-t border-slate-100">
                            <button
                                onClick={onClose}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all"
                            >
                                Return to Sundial
                            </button>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DailySlate;