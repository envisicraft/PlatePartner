import React from 'react';
import { IconX, IconMapPin, IconStar, IconPawPrint, IconCamera, IconReceipt } from '../Icons';
import { formatDate } from './Shared';

export const LocationModalView = ({ locationCard, onClose, availableAvatars }) => {
    const isPetFriendly = locationCard?.petFriendly || false;
    // Mock user rating and community rating difference
    const communityRating = locationCard ? Math.max(1, (locationCard.placeRating - 0.4).toFixed(1)) : 4.5;

    return (
        <div className="absolute inset-0 z-[4000] flex flex-col bg-[#E8D4A9] overflow-hidden" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' }}>
            {/* Header */}
            <div className="px-6 pt-12 pb-4 flex justify-between items-center shrink-0 uppercase relative z-50">
                <button onClick={onClose} className="p-2 -ml-2 text-black/40 active:scale-90 bg-white/50 rounded-full backdrop-blur-md shadow-sm"><IconX size={24} /></button>
            </div>

            {/* Mock Map Background View */}
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600" className="w-full h-[50%] object-cover opacity-80" alt="map" />
                <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-[#E8D4A9] via-transparent to-[#E8D4A9]" />
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 text-[#EF4444] drop-shadow-lg animate-bounce"><IconMapPin fill="#EF4444" stroke="white" size={48} /></div>
            </div>

            {/* Content Bottom Sheet */}
            <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-[#F5EAD4] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10 flex flex-col pt-2 border-t-2 border-white/50">
                <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-4" />

                <div className="px-8 pb-32 overflow-y-auto no-scrollbar flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1 gap-4">
                        <h2 className="text-3xl font-black italic tracking-tighter text-[#1A1A1A] leading-none uppercase">{locationCard?.place}</h2>
                        <div className="bg-[#22C55E] text-white px-3 py-1 rounded-2xl flex flex-col items-center shadow-md">
                            <span className="text-[14px] font-black leading-none">{communityRating}</span>
                            <div className="flex gap-0.5 mt-0.5">{[1, 2, 3, 4, 5].map(s => <IconStar key={s} size={6} fill={s <= Math.round(communityRating) ? "white" : "transparent"} />)}</div>
                            <span className="text-[6px] opacity-80 uppercase mt-0.5 tracking-widest leading-none">Community</span>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center text-[10px] font-black uppercase tracking-widest text-[#E2725B] mb-6">
                        <span>$$ Average</span>
                        <span>•</span>
                        <span>{locationCard?.primaryStyle || 'Restaurant'}</span>
                        {isPetFriendly && (
                            <>
                                <span>•</span>
                                <span className="text-[#92400E] flex items-center gap-1"><IconPawPrint size={10} /> Pet Friendly</span>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <button className="bg-white text-[#1A1A1A] py-3 rounded-[1.5rem] flex flex-col items-center justify-center gap-1.5 border border-black/5 shadow-sm active:scale-95 transition-transform"><IconMapPin size={20} className="text-[#3B82F6]" /><span className="text-[8px] font-black uppercase tracking-widest">Directions</span></button>
                        <button className="bg-white text-[#1A1A1A] py-3 rounded-[1.5rem] flex flex-col items-center justify-center gap-1.5 border border-black/5 shadow-sm active:scale-95 transition-transform"><IconCamera size={20} className="text-[#22C55E]" /><span className="text-[8px] font-black uppercase tracking-widest">Phone</span></button>
                        <button className="bg-white text-[#1A1A1A] py-3 rounded-[1.5rem] flex flex-col items-center justify-center gap-1.5 border border-black/5 shadow-sm active:scale-95 transition-transform"><IconReceipt size={20} className="text-[#E2725B]" /><span className="text-[8px] font-black uppercase tracking-widest">Menu</span></button>
                    </div>

                    <div className="bg-white/40 border border-black/5 p-4 rounded-3xl shadow-inner text-center">
                        <h4 className="text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">Your Rating</h4>
                        <div className="flex gap-2 justify-center mb-1">
                            {[1, 2, 3, 4, 5].map(s => <IconStar key={s} size={28} className={s <= locationCard?.placeRating ? "text-[#F59E0B]" : "text-black/10"} fill={s <= locationCard?.placeRating ? "currentColor" : "none"} />)}
                        </div>
                        <p className="text-[10px] font-bold text-black/60 italic">Last visited: {formatDate(locationCard?.date)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
