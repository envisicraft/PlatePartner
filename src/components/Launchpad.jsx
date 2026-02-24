import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

/**
 * Project: PlatePartner - Restoration Phase (v11.4)
 * Component: Launchpad (The Cockpit)
 * Logic: PC-Friendly Long-Press, Toggles, and Pulsing Sweep Trigger.
 */

const Launchpad = ({ avatars, onToggleAvatar, onLongPressAvatar, activeAvatars, unfinishedCount, onSweepClick }) => {
    const timerRef = useRef(null);
    const isLongPress = useRef(false);

    // 1. THE LONG-PRESS TIMER (600ms) for Member DNA editing
    const startPress = (avatar) => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            onLongPressAvatar(avatar);
        }, 600);
    };

    const endPress = (avatar) => {
        clearTimeout(timerRef.current);
        // Only toggle if it WASN'T a long press
        if (!isLongPress.current) {
            onToggleAvatar(avatar.id);
        }
    };

    // 2. CLIPBOARD ASSISTANCE: Copies active table rules
    const handleOrderNow = () => {
        if (activeAvatars.length === 0) return;
        const allAvoids = [...new Set(activeAvatars.flatMap(a => a.avoids))];
        const allCautions = [...new Set(activeAvatars.flatMap(a => a.cautions))];

        let text = "PLATEPARTNER DIETARY SUMMARY:\n";
        if (allCautions.length > 0) text += `⚠️ RED FLAGS: ${allCautions.join(', ')}\n`;
        if (allAvoids.length > 0) text += `🚫 YELLOW FLAGS: ${allAvoids.join(', ')}`;

        navigator.clipboard.writeText(text).then(() => {
            alert("Dietary rules copied to clipboard!");
        });
    };

    return (
        <div className="flex flex-col gap-5 px-2">

            {/* TACTILE AVATAR ROW */}
            <div className="flex gap-4 items-center justify-center py-1">

                {/* RESTORED PULSING PENCIL: Positioned within the Launchpad area */}
                <div className="relative mr-2">
                    <button
                        onClick={onSweepClick}
                        className={`p-2.5 rounded-full transition-all active:scale-90 ${unfinishedCount > 0 ? 'animate-pulse-custom text-[#E2725B] bg-white/40 shadow-sm border border-[#E2725B]/20' : 'text-black/20 hover:text-black/40'}`}
                    >
                        <Pencil size={20} fill={unfinishedCount > 0 ? "none" : "currentColor"} />
                        {unfinishedCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-[#E8D4A9] shadow-sm">
                                {unfinishedCount}
                            </span>
                        )}
                    </button>
                </div>

                {avatars.map((avatar) => (
                    <motion.div
                        key={avatar.id}
                        whileTap={{ scale: 0.9 }}
                        onMouseDown={() => startPress(avatar)}
                        onMouseUp={() => endPress(avatar)}
                        onMouseLeave={() => clearTimeout(timerRef.current)}
                        onTouchStart={() => startPress(avatar)}
                        onTouchEnd={() => endPress(avatar)}
                        className={`
                            w-11 h-11 rounded-full flex items-center justify-center 
                            text-[10px] font-black border-2 cursor-pointer transition-all duration-300
                            ${avatar.active
                                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg scale-110'
                                : 'bg-white/40 border-black/10 text-black/30'}
                        `}
                    >
                        {avatar.initials}
                    </motion.div>
                ))}
            </div>

            {/* MASTER ORDER BUTTON: Matches the JD Mockup aesthetic */}
            <button
                onClick={handleOrderNow}
                disabled={activeAvatars.length === 0}
                className={`w-full py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all
                    ${activeAvatars.length > 0
                        ? 'bg-[#E2725B] text-white'
                        : 'bg-black/5 text-black/20 shadow-none cursor-not-allowed'}`}
            >
                Generate Rules →
            </button>

            <p className="text-[8px] text-center text-black/30 font-black uppercase tracking-widest leading-none">
                {activeAvatars.length} Active • Long-Press circle to edit DNA
            </p>
        </div>
    );
};

export default Launchpad;