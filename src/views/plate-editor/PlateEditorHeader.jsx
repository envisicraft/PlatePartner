import React from 'react';
import { IconX, IconShare2 } from '../../Icons';

export const PlateEditorHeader = ({ onClose, onSave }) => (
    <div className="px-6 pt-10 pb-4 flex justify-between items-center border-b border-black/5 shrink-0 uppercase relative z-10">
        <div className="flex items-center">
            <button onClick={onClose} className="p-2 -ml-2 text-black/40 active:scale-90"><IconX size={24} /></button>
            <h2 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A] ml-2">Your Plate</h2>
        </div>
        <div className="flex gap-3">
            <button className="p-1.5 text-black/40"><IconShare2 size={20} /></button>
            <button onClick={onSave} className="px-4 py-1.5 bg-[#4F7942] text-white text-[10px] font-black uppercase rounded-full shadow-md active:scale-95">Save</button>
        </div>
    </div>
);
