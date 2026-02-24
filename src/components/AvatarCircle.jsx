import React, { useState, useRef } from 'react';
import { Tooltip } from './SharedUi';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Avatar Circle with Long-Press Logic
 * Interaction: Tap = Toggle active status. Long-Press = Manage The Table.
 */

const AvatarCircle = ({ avatar, isActive, onToggle, onLongPress }) => {
    const [isPressing, setIsPressing] = useState(false);
    const pressTimer = useRef(null);

    // 1. Long-Press Logic (Simulation for Web/Mobile)
    const handleStart = (e) => {
        // Prevent context menu on mobile
        if (e.type === 'touchstart') setIsPressing(true);

        pressTimer.current = setTimeout(() => {
            onLongPress(avatar);
            setIsPressing(false);
        }, 600); // 600ms threshold for "Manage" trigger
    };

    const handleEnd = (e) => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            // If it was a short press, trigger the toggle
            if (e.type === 'mouseup' || e.type === 'touchend') {
                if (pressTimer.current) onToggle(avatar.id);
            }
        }
        setIsPressing(false);
    };

    return (
        <Tooltip text={`${avatar.name}: ${avatar.avoids}`}>
            <div
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                onMouseLeave={() => clearTimeout(pressTimer.current)}
                onTouchStart={handleStart}
                onTouchEnd={handleEnd}
                className={`
          w-14 h-14 rounded-full border-2 flex items-center justify-center 
          font-bold text-sm transition-all duration-300 cursor-pointer select-none
          ${isActive
                        ? 'border-amber-400 scale-110 grayscale-0 shadow-lg ring-2 ring-amber-100'
                        : 'border-slate-200 grayscale opacity-40 shadow-none'}
          ${isPressing ? 'scale-95 bg-slate-100' : ''}
        `}
                style={{ backgroundColor: avatar.color }}
            >
                <span className="text-slate-800 tracking-tighter">
                    {avatar.initials}
                </span>
            </div>
        </Tooltip>
    );
};

export default AvatarCircle;