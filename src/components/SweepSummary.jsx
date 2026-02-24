import React from 'react';
import { Icons, CuisineStyles } from './UiAssets';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Sweep Summary Report
 * Logic: "Color Balance" check and 30-day activity aggregation.
 */

const SweepSummary = ({ history, vaultedCount, discardedCount, onClose }) => {
    // 1. Logic: Aggregate "Color Balance" (Cuisine Distribution)
    const balance = history.reduce((acc, entry) => {
        acc[entry.style] = (acc[entry.style] || 0) + 1;
        return acc;
    }, {});

    const totalMeals = history.length;

    return (
        <div className="fixed inset-0 z-[200] bg-[#FDFCF8] flex flex-col p-8 animate-in fade-in duration-500">
            <header className="mb-12">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Monthly Check-In Complete</span>
                <h2 className="text-3xl font-bold font-serif text-slate-800 mt-2">The Sweep Summary</h2>
            </header>

            <div className="flex-1 space-y-10">
                {/* 2. Color Balance Section */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color Balance Check</h3>
                        <span className="text-[10px] text-slate-300 italic">30-Day Distribution</span>
                    </div>
                    <div className="space-y-4">
                        {Object.keys(CuisineStyles).map((key) => {
                            const count = balance[key] || 0;
                            const percentage = totalMeals > 0 ? (count / totalMeals) * 100 : 0;
                            return (
                                <div key={key} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                        <span className="text-slate-600">{CuisineStyles[key].label}</span>
                                        <span className="text-slate-400">{count} Meals</span>
                                    </div>
                                    {/* Thin horizontal color-coded pill logic */}
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: CuisineStyles[key].color
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Pantry Impact */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-center">
                        <span className="text-2xl block mb-2">{Icons.STAR}</span>
                        <h4 className="text-2xl font-bold text-slate-800">{vaultedCount}</h4>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Vaulted to Pantry</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-center">
                        <span className="text-2xl block mb-2">🗑️</span>
                        <h4 className="text-2xl font-bold text-slate-400">{discardedCount}</h4>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Discarded Junk</p>
                    </div>
                </section>
            </div>

            <footer className="pt-8">
                <button
                    onClick={onClose}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 active:scale-95 transition-all"
                >
                    Return to The Fork
                </button>
            </footer>
        </div>
    );
};

export default SweepSummary;