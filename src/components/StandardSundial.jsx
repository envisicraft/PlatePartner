import React, { useMemo } from 'react';
import { FilterX } from 'lucide-react';

/**
 * Project: PlatePartner - Restoration Phase (v12.5)
 * Component: Standard Sundial (High-Visibility Dots)
 * Logic: Bold colors and interactive legend for filtering.
 */

const STYLE_COLORS = {
    American: '#1D4ED8',
    Italian: '#15803D',
    Mexican: '#EA580C',
    Asian: '#DC2626',
    Indian: '#D97706',
    Seafood: '#06B6D4',
    Healthy: '#65A30D',
    'Cafe & Dessert': '#DB2777',
    DEFAULT: '#1A1A1A15'
};

const StandardSundial = ({ history = [], activeStyle, onFilterStyle }) => {
    const innerFold = "shadow-[inset_2px_4px_12px_rgba(0,0,0,0.15)]";

    const gridData = useMemo(() => {
        const days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - (29 - i));
            return date;
        });

        return days.map(date => {
            const dayTs = date.getTime();
            const nextDayTs = dayTs + 86400000;
            const meal = history.find(m => m.timestamp >= dayTs && m.timestamp < nextDayTs);
            return {
                style: meal ? meal.style : null,
                name: meal ? (meal.dish || meal.location) : null
            };
        });
    }, [history]);

    return (
        <section className={`bg-white/30 rounded-[2.5rem] p-6 border border-black/5 ${innerFold} relative`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A] opacity-60">Standard Sundial</h3>
                    <p className="text-[9px] font-bold text-[#1A1A1A] opacity-30 uppercase tracking-widest mt-1">30-Day Chronological Balance</p>
                </div>
                {activeStyle && (
                    <button onClick={() => onFilterStyle(null)} className="flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] text-white rounded-full animate-in zoom-in">
                        <span className="text-[7px] font-black uppercase tracking-widest">{activeStyle}</span>
                        <FilterX size={8} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-10 gap-2">
                {gridData.map((day, idx) => (
                    <button
                        key={idx}
                        onClick={() => day.style && onFilterStyle(day.style === activeStyle ? null : day.style)}
                        disabled={!day.style}
                        className={`aspect-square w-full rounded-md transition-all duration-300 shadow-sm
                            ${activeStyle && day.style !== activeStyle ? 'opacity-10 scale-90' : 'opacity-100'}
                        `}
                        style={{
                            backgroundColor: day.style ? (STYLE_COLORS[day.style] || '#4B5563') : STYLE_COLORS.DEFAULT,
                            border: day.style ? 'none' : '1px dashed rgba(0,0,0,0.05)'
                        }}
                    ></button>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
                {Object.entries(STYLE_COLORS).slice(0, 8).map(([style, color]) => (
                    <button
                        key={style}
                        onClick={() => onFilterStyle(style === activeStyle ? null : style)}
                        className={`flex items-center gap-1.5 transition-all py-1 px-2 rounded-lg
                            ${activeStyle === style ? 'bg-[#1A1A1A] text-white' : 'bg-white/40 opacity-40'}
                        `}
                    >
                        <div className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: color }}></div>
                        <span className="text-[7px] font-black uppercase tracking-widest">{style}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default StandardSundial;