import React from 'react';
import { IconHubPlateSpoon } from '../Icons';

export const LoginView = ({ onLogin, onDummyLogin }) => {
    const parchmentBg = { backgroundColor: '#E8D4A9', backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundRepeat: 'repeat' };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-between pb-10 pt-16 px-6 animate-in slide-in-from-bottom duration-700 z-[2000]" style={parchmentBg}>
            <div className="w-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-white/50 bg-white/30 flex items-center justify-center mb-6 shadow-inner">
                    <IconHubPlateSpoon size={36} className="text-white drop-shadow-md" />
                </div>
                <h1 className="text-[2rem] font-black tracking-tighter italic text-[#1A1A1A] uppercase mb-1">PlatePartner</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E2725B] italic text-center mb-8">
                    YOUR FIVE-STAR JOURNEY
                </p>

                <div className="w-full aspect-[2/1] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white/80 mb-8 relative">
                    <img
                        src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400"
                        alt="Delicious meal"
                        className="w-full h-full object-cover contrast-125 saturate-150"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="w-full h-px bg-black/10 mb-8" />

                <div className="flex flex-col gap-3 w-full max-w-[300px]">
                    <button
                        onClick={() => onLogin('apple')}
                        className="w-full py-4 rounded-[1.5rem] bg-black text-white shadow-md flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.641-.026 2.669-1.48 3.675-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.246-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" /></svg>
                        <span className="text-[12px] font-black uppercase tracking-widest">Sign in with Apple</span>
                    </button>

                    <button
                        onClick={() => onLogin('google')}
                        className="w-full py-4 rounded-[1.5rem] bg-white text-[#1A1A1A] shadow-md flex items-center justify-center gap-3 border border-black/5 active:scale-95 transition-transform"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="none" d="M1 1h22v22H1z" /></svg>
                        <span className="text-[12px] font-black uppercase tracking-widest">Sign in with Google</span>
                    </button>

                    <button
                        onClick={() => onLogin('email')}
                        className="w-full py-4 rounded-[1.5rem] bg-[#E2725B] text-white shadow-md flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                        <span className="text-[12px] font-black uppercase tracking-widest">Continue with Email</span>
                    </button>
                </div>

            </div>

            <div className="flex flex-col gap-2 w-full max-w-[300px]">
                <button
                    onClick={() => alert("Registration flow will be implemented here.")}
                    className="w-full py-3 rounded-[1.5rem] bg-transparent text-[#E2725B] font-black uppercase tracking-widest text-[11px] active:opacity-70 transition-opacity"
                >
                    Create New Account
                </button>

                {/* Developer Bypass - Hidden from final users, but useful for testing */}
                <button
                    onClick={onDummyLogin}
                    className="w-full py-2 rounded-[1.5rem] mt-4 opacity-20 hover:opacity-100 bg-black/10 text-[#1A1A1A] font-black uppercase tracking-widest text-[9px] transition-all"
                >
                    Developer Default Login Bypass
                </button>
            </div>
        </div>
    );
};
