import React from 'react';
import { CheckCircle2, Trash2, X, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../views/Shared';

/**
 * Project: PlatePartner - Restoration Phase (v11.1)
 * Component: The Sweep (Clear Ghost Logs)
 * Logic: High-fidelity restoration of the original "Sweep" UI.
 */

const TheSweep = ({ ghostLogs, onClose, onDeleteLog, onFinalizeLog }) => {
    const raisedStats = "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] border-2 border-black/20 bg-white/5";
    const innerFold = "shadow-[inset_2px_4px_12px_rgba(0,0,0,0.1)]";

    return (
        <div className="h-full w-full parchment-root flex flex-col p-6 animate-in slide-in-from-bottom duration-[600ms]">
            {/* 1. RESTORED HEADER */}
            <header className="flex justify-between items-center mb-8 mt-6">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-[#1A1A1A] leading-none">The Sweep</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E2725B] mt-2">Clear Your Ghost Logs</p>
                </div>
                <button onClick={onClose} className="p-3 bg-black/5 rounded-full text-black/40 active:scale-90 transition-all">
                    <X size={24} />
                </button>
            </header>

            {/* 2. STATS SUMMARY */}
            <div className={`p-4 rounded-[2rem] mb-8 text-center ${raisedStats}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 block mb-1">Pending Memories</span>
                <span className="text-4xl font-black text-[#1A1A1A] italic">{ghostLogs.length}</span>
                <p className="text-[9px] font-bold text-black/60 mt-2 leading-tight uppercase tracking-wider px-4">
                    Identify these visits to keep your 30-day sundial accurate.
                </p>
            </div>

            {/* 3. LOG LIST */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
                {ghostLogs.map((log) => (
                    <div key={log.id} className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-black/5 relative overflow-hidden group">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                        <div className="flex flex-col gap-2 relative z-10 mb-4">
                            <div className="flex items-center gap-2 text-[#4F7942]">
                                <MapPin size={16} />
                                <span className="text-[14px] font-black text-[#1A1A1A]">{log.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-black/30">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(log.date) || 'Today'}</span>
                            </div>
                        </div>

                        {/* HIGH-FIDELITY ACTIONS */}
                        <div className="flex gap-2 relative z-10">
                            <button
                                onClick={() => onDeleteLog(log.id)}
                                className="flex-1 py-3 rounded-2xl border border-black/10 text-black/40 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={14} /> Discard
                            </button>
                            <button
                                onClick={() => onFinalizeLog(log)}
                                className="flex-2 px-6 py-3 rounded-2xl bg-[#4F7942] text-white text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Identify <CheckCircle2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TheSweep;