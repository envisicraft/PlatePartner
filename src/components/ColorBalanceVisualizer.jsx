import React from 'react';
import { CuisineStyles, Icons } from './UiAssets';
import { getForbiddenCuisines } from '../logic/VarietyRule';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: History "Color Balance" Visualizer
 * Logic: Aggregates 30-day cuisine distribution and highlights 14-day variety locks.
 */

const ColorBalanceVisualizer = ({ history }) => {
    // 1. Logic: Identify "Forbidden" styles (14-day Variety Rule)
    const forbiddenStyles = getForbiddenCuisines(history);

    // 2. Aggregate 30-day totals for the "Color Balance" check
    const distribution = history.reduce((acc, meal) => {
        acc[meal.style] = (acc[meal.style] || 0) + 1;
        return acc;
    }, {});

    const maxCount = Math.max(...Object.values(distribution), 1);

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Variety DNA</span>
                    <h3 className="text-2xl font-bold font-serif text-slate-800 mt-1">Color Balance</h3>
                </div>
                <span className="text-xl text-slate-300">{Icons.HISTORY}</span>
            </header>

            <div className="space-y-6">
                {Object.entries(CuisineStyles).map(([key, style]) => {
                    const count = distribution[key] || 0;
                    const isLocked = forbiddenStyles.includes(key);
                    const barWidth = (count / maxCount) * 100;

                    return (
                        <div key={key} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-2">
                                    {/* Visual Style: Thin horizontal color-coded pill */}
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: style.color }}
                                    />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                                        {style.label}
                                    </span>
                                    {isLocked && (
                                        <span className="text-[9px] text-red-400 font-bold uppercase ml-2 opacity-60">Locked</span>
                                    )}
                                </div>
                                <span className="text-[10px] font-serif text-slate-400 italic">{count} Meals</span>
                            </div>

                            {/* Distribution Bar */}
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${barWidth}%`,
                                        backgroundColor: style.color,
                                        opacity: isLocked ? 0.3 : 1
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <footer className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-500 leading-relaxed font-serif italic">
                    Just a note: "Locked" styles will be strictly excluded from your Smart Dice and Reshuffle grids until the 14-day window clears.
                </p>
            </footer>
        </div>
    );
};

export default ColorBalanceVisualizer;