import React from 'react';

/**
 * Shared UI Library - Dining Architect
 * Official term: Plate Pantry
 */

export const Tooltip = ({ text, children }) => (
    <div className="relative group flex items-center">
        {children}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs p-2 rounded shadow-xl z-50">
            {text}
        </div>
    </div>
);

export const SlideOutMenu = ({ isOpen, onClose, title, children }) => (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-40 border-l border-slate-200`}>
        <div className="p-4 flex justify-between items-center border-b border-slate-100">
            <h2 className="text-xl font-bold font-serif text-slate-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">✕</button>
        </div>
        <div className="p-4 overflow-y-auto h-full pb-20">{children}</div>
    </div>
);

export const Overlay = ({ isVisible, onClick }) => (
    isVisible ? <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-all" onClick={onClick} /> : null
);