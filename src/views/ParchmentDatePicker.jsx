import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconChevronDown, IconCalendar } from '../Icons';
import { MONTHS, PARCHMENT_BG, formatDate, parseDate } from './Shared';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const ParchmentDatePicker = ({ value, onChange, label }) => {
    const parsed = value ? new Date(value + 'T00:00:00') : new Date();
    const [viewDate, setViewDate] = useState(new Date(parsed.getFullYear(), parsed.getMonth()));
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const prevMonth = () => setViewDate(new Date(year, month - 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1));

    const selectDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        setIsCalendarOpen(false);
    };

    const selectedParts = value ? value.split('-').map(Number) : null;
    const isSelected = (day) => selectedParts && selectedParts[0] === year && selectedParts[1] === month + 1 && selectedParts[2] === day;

    const handleManualInput = (e) => {
        const val = e.target.value;
        // Accept MM/DD/YYYY format
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            const internal = parseDate(val);
            onChange(internal);
            // Jump calendar view to that month
            const parts = internal.split('-').map(Number);
            setViewDate(new Date(parts[0], parts[1] - 1));
        } else {
            // Allow partial typing — try to parse, otherwise just store raw
            onChange(val);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Label + Manual Entry Row */}
            <div className="flex items-center gap-2">
                <div className="flex-1 flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#E2725B] mb-1">{label}</span>
                    <input
                        type="text"
                        placeholder="MM/DD/YYYY"
                        value={value ? formatDate(value) : ''}
                        onChange={handleManualInput}
                        className="bg-white/40 border border-black/10 rounded-xl px-3 py-2 text-[11px] font-bold text-[#1A1A1A] w-full outline-none focus:ring-1 focus:ring-[#E2725B]/30 uppercase placeholder:text-black/20"
                    />
                </div>
                <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={`mt-4 p-2.5 rounded-xl border transition-all active:scale-90 ${isCalendarOpen ? 'bg-[#4F7942] text-white border-[#4F7942] shadow-md' : 'bg-white/40 text-black/40 border-black/10'}`}
                >
                    <IconCalendar size={18} />
                </button>
            </div>

            {/* Expandable Calendar Grid */}
            {isCalendarOpen && (
                <div
                    className="date-range-enter rounded-2xl p-4 border border-black/10 relative overflow-hidden"
                    style={{
                        ...PARCHMENT_BG,
                        boxShadow: '0 6px 16px -3px rgba(0,0,0,0.18), 0 3px 6px -2px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Month/Year Navigation with Quick Jump */}
                    <div className="flex justify-between items-center mb-3">
                        <button onClick={prevMonth} className="p-1.5 bg-black/5 rounded-full active:scale-90 transition-transform">
                            <IconChevronLeft size={14} />
                        </button>
                        <div className="relative group flex flex-col items-center">
                            {/* Hidden select for quick month/year jumping */}
                            <select
                                value={`${year}-${month}`}
                                onChange={(e) => {
                                    const [y, m] = e.target.value.split('-');
                                    setViewDate(new Date(parseInt(y), parseInt(m)));
                                }}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                            >
                                {Array.from({ length: 120 }).map((_, i) => {
                                    const d = new Date(2026, 1);
                                    d.setMonth(d.getMonth() - i);
                                    return (
                                        <option key={i} value={`${d.getFullYear()}-${d.getMonth()}`}>
                                            {MONTHS[d.getMonth()]} {d.getFullYear()}
                                        </option>
                                    );
                                })}
                            </select>
                            <span className="text-[11px] font-black italic uppercase tracking-widest text-[#1A1A1A] group-hover:opacity-60 transition-opacity flex items-center gap-1">
                                {MONTHS[month]} {year}
                                <IconChevronDown size={10} className="text-black/40" />
                            </span>
                        </div>
                        <button onClick={nextMonth} className="p-1.5 bg-black/5 rounded-full active:scale-90 transition-transform">
                            <IconChevronRight size={14} />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-0 text-center mb-1">
                        {DAYS.map((d, i) => (
                            <div key={i} className="text-[8px] font-black text-black/30 py-1">{d}</div>
                        ))}
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-0 text-center">
                        {[...Array(startDay)].map((_, i) => (
                            <div key={`empty-${i}`} className="h-8" />
                        ))}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const selected = isSelected(day);
                            return (
                                <button
                                    key={day}
                                    onClick={() => selectDay(day)}
                                    className={`h-8 w-full flex items-center justify-center rounded-full text-[10px] font-black transition-all active:scale-90 ${selected
                                        ? 'bg-[#E2725B] text-white shadow-md'
                                        : 'text-[#1A1A1A] hover:bg-black/5'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Clear button */}
                    <div className="flex mt-3 pt-2 border-t border-black/5">
                        <button
                            onClick={() => { onChange(''); setIsCalendarOpen(false); }}
                            className="flex-1 py-2 rounded-full bg-black/5 text-[9px] font-black uppercase tracking-widest text-black/50 active:scale-95 transition-transform"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
