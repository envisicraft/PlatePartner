import React from 'react';
import { IconHubPlateSpoon, IconPawPrint, IconStar, IconMapPin } from '../Icons';
import { CUISINE_MAP } from './Shared';

export const PantryCard = ({ m, onOpen, availableAvatars, isTagged, onToggleTag, onOpenMap }) => {
    const avs = m.userIds.map(uid => availableAvatars?.find(a => a.id === uid)).filter(Boolean);
    const rb = m.rating >= 5 ? 'bg-[#D4AF37]' : m.rating === 4 ? 'bg-[#22C55E]' : m.rating >= 2 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]';
    return (<div onClick={() => onOpen(m)} className={`bg-white/70 rounded-[1.25rem] overflow-hidden border ${isTagged ? 'border-2 border-[#E2725B] ring-2 ring-[#E2725B]/20' : 'border border-black/5'} shadow-md flex flex-col h-[140px] text-center active:scale-95 transition-transform relative shrink-0 cursor-pointer`}>
        <div className="h-[65px] w-full relative shrink-0">
            {m.img && m.img.trim() !== '' ? (
                <img src={m.img} className="w-full h-full object-cover" alt="d" />
            ) : (
                <div className="w-full h-full relative" style={{ backgroundColor: CUISINE_MAP[m.primaryStyle] || '#E8D4A9' }}>
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '10px 10px' }} />
                    <div className="absolute inset-0 flex items-center justify-center"><IconHubPlateSpoon size={24} className="text-white/60 drop-shadow-sm" /></div>
                </div>
            )}
            <div className="absolute top-1 left-1 flex flex-col items-center gap-1">
                <div className="flex -space-x-1.5">{avs.filter(a => a.id !== 'DOG').map((av, i) => (<div key={av.id} className="w-5 h-5 rounded-full border border-white overflow-hidden shadow-sm flex items-center justify-center bg-white/90" style={{ zIndex: 10 - i }}><img src={av.img} className="w-full h-full object-cover" alt="u" /></div>))}</div>
                {(m.petFriendly || m.userIds.includes('DOG')) && <div className="w-5 h-5 rounded-full border border-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center bg-white/90 text-[#92400E] z-10"><IconPawPrint size={10} /></div>}
            </div>
            <div className={`absolute top-1 right-1 px-2 py-1 rounded-md flex items-center gap-0.5 text-white text-[9px] font-black shadow-[0_2px_4px_rgba(0,0,0,0.15)] ${rb} ${m.rating >= 5 ? 'animate-pulse scale-105' : ''}`}>{m.rating} <IconStar size={10} /></div>
            <button onClick={(e) => { e.stopPropagation(); if (onOpenMap) onOpenMap(m); }} className="absolute bottom-1 right-1 p-1.5 bg-white/90 hover:bg-[#E8D4A9] rounded-full shadow-sm z-10 transition-colors active:scale-95"><IconMapPin size={12} className="text-[#4F7942]" /></button>
        </div>
        <div className="p-1.5 flex flex-col flex-grow items-center justify-start overflow-hidden uppercase">
            <h4 className="text-[10px] font-black leading-tight line-clamp-2 text-[#1A1A1A] w-full">{m.dish}</h4>
            <p className="text-[9px] font-bold text-black/40 truncate w-full mt-0.5 mb-1">{m.place}</p>
            <div className="mt-auto flex w-full justify-between items-end pb-0.5">
                {onToggleTag ? (
                    <button onClick={(e) => { e.stopPropagation(); onToggleTag(m.id); }} className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase shadow-sm transition-all ${isTagged ? 'bg-[#E2725B] text-white ring-1 ring-[#E2725B]' : 'bg-black/5 text-black/40 hover:bg-black/10'}`}>{isTagged ? 'HELD' : 'HOLD'}</button>
                ) : <div />}
                <span className="text-[7px] font-black text-[#E2725B] italic tracking-widest pl-1">VIEW/EDIT</span>
            </div>
        </div></div>);
};
