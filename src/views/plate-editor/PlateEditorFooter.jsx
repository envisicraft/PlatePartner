import React from 'react';
import { IconMapPin } from '../../Icons';
import { formatDate } from '../Shared';

export const PlateEditorFooter = ({ fd, onOpenMap }) => (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[50]">
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-[#E8D4A9]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)', backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }} />
        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between gap-1.5 z-50 pointer-events-auto">
            <button onClick={() => fd.place && onOpenMap(fd)} className="flex-1 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center truncate active:scale-95 transition-transform">
                <span className="text-[9px] font-black uppercase text-[#1A1A1A] truncate tracking-widest flex items-center gap-1"><IconMapPin size={10} className="text-[#3B82F6]" />{fd.place || 'LOCATION'}</span>
            </button>
            <div className="bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center shrink-0 flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A] leading-none">72° ☀️</span>
                <span className="text-[9px] font-black uppercase text-black/40 leading-none">{formatDate(fd.date)}</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[1rem] shadow-lg border border-black/5 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black uppercase text-[#1A1A1A]">1:30 PM</span>
            </div>
        </div>
    </div>
);
