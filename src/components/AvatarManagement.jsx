import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, AlertTriangle, Check, User } from 'lucide-react';

/**
 * Project: PlatePartner - Restoration Phase (v11.3)
 * Component: Avatar Management (Dietary DNA)
 * Logic: High-fidelity restoration of the Dietary Guardrails UI.
 */

const AvatarManagement = ({ avatar, onUpdate, onClose }) => {
    const [initials, setInitials] = useState(avatar.initials);
    const [avoids, setAvoids] = useState(avatar.avoids || []);
    const [cautions, setCautions] = useState(avatar.cautions || []);
    const [newInput, setNewInput] = useState('');

    const innerFold = "shadow-[inset_2px_4px_12px_rgba(0,0,0,0.1)]";

    const handleSave = () => {
        onUpdate({
            ...avatar,
            initials: initials.toUpperCase().slice(0, 2),
            avoids,
            cautions
        });
        onClose();
    };

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-[700] parchment-root p-8 flex flex-col font-serif"
        >
            <div className="flex justify-between items-center mb-10 mt-6">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-[#1A1A1A] leading-none">Member DNA</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E2725B] mt-2">Dietary Architecture</p>
                </div>
                <button onClick={onClose} className="p-3 bg-black/5 rounded-full text-black/40 active:scale-90">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pb-10">
                {/* Initials */}
                <section>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3 block">Member Initials</label>
                    <div className={`${innerFold} bg-white/40 rounded-2xl p-4 w-24 text-center border border-black/5`}>
                        <input
                            type="text"
                            maxLength={2}
                            value={initials}
                            onChange={(e) => setInitials(e.target.value)}
                            className="text-4xl font-black bg-transparent outline-none w-full text-center uppercase text-[#1A1A1A]"
                        />
                    </div>
                </section>

                {/* Cautions: Red Flags */}
                <section>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#EF4444] mb-3 block flex items-center gap-2">
                        <AlertCircle size={14} /> Allergies (Red Flag)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['Peanuts', 'Dairy', 'Gluten', 'Shellfish'].map(c => (
                            <button
                                key={c}
                                onClick={() => setCautions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
                                    ${cautions.includes(c) ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-md' : 'bg-white/40 border-black/10 text-black/40'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Avoids: Yellow Flags */}
                <section>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#B45309] mb-3 block flex items-center gap-2">
                        <AlertTriangle size={14} /> Dislikes (Yellow Flag)
                    </label>
                    <div className={`${innerFold} bg-white/40 rounded-2xl p-3 flex gap-2 border border-black/5 mb-4`}>
                        <input
                            type="text"
                            placeholder="Add Preference..."
                            value={newInput}
                            onChange={(e) => setNewInput(e.target.value)}
                            className="flex-1 bg-transparent border-none text-[12px] font-bold outline-none placeholder:text-black/20"
                        />
                        <button
                            onClick={() => { if (newInput.trim()) { setAvoids([...avoids, newInput]); setNewInput(''); } }}
                            className="bg-[#1A1A1A] text-white p-2 rounded-xl active:scale-90"
                        >
                            <Check size={16} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {avoids.map((a, i) => (
                            <span key={i} className="bg-[#F59E0B]/10 text-[#B45309] px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border border-[#F59E0B]/20 flex items-center gap-2">
                                {a}
                                <X size={10} className="cursor-pointer" onClick={() => setAvoids(avoids.filter((_, idx) => idx !== i))} />
                            </span>
                        ))}
                    </div>
                </section>
            </div>

            <button
                onClick={handleSave}
                className="w-full bg-[#1A1A1A] text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
            >
                Save Member DNA
            </button>
        </motion.div>
    );
};

export default AvatarManagement;