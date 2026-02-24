import React, { useState } from 'react';
import { Mic, Send, Sparkles } from 'lucide-react';

/**
 * Project: PlatePartner - Restoration Phase (v12.3)
 * Component: SmartDice (The Mood Box)
 * Logic: High-fidelity search box with tactile button formulas.
 */

const SmartDice = ({ onSearch }) => {
    const [input, setInput] = useState("");
    const innerFold = "shadow-[inset_2px_4px_12px_rgba(0,0,0,0.2)]";

    const handleSend = () => {
        if (!input.trim()) return;
        onSearch?.(input);
        setInput("");
    };

    return (
        <div className={`flex items-start gap-3 ${innerFold} bg-white/40 rounded-[2.5rem] border border-black/10 relative p-4 transition-all focus-within:bg-white/60 focus-within:shadow-md shrink-0`}>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What are you in the mood for?"
                className="flex-grow bg-transparent border-none focus:ring-0 px-2 py-1 text-[14px] font-bold placeholder:text-black/30 placeholder:font-semibold placeholder:leading-relaxed resize-none outline-none h-[80px]"
            />
            <div className="flex flex-col gap-2 shrink-0">
                <button className="w-12 h-10 rounded-[1.2rem] bg-white border border-black/5 shadow-sm flex items-center justify-center text-[#1A1A1A] relative active:scale-95 transition-transform">
                    <Sparkles size={10} className="absolute top-1.5 right-1.5 text-[#E2725B]" />
                    <Mic size={18} />
                </button>
                <button
                    onClick={handleSend}
                    className="w-12 h-10 bg-[#4F7942] rounded-[1.2rem] shadow-md flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default SmartDice;