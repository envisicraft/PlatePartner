import React, { useRef, useState } from 'react';
import { Icons } from './UiAssets';

/**
 * Project: Dining Architect - Master Spec v6.0
 * Component: Silent Resilience Photo-Capture
 * Logic: Local capture with invisible background syncing.
 */

const PhotoCapture = ({ onCapture, onCancel, locationName }) => {
    const videoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    // 1. Silent Resilience: Access camera locally
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Camera access deferred: ", err);
        }
    };

    React.useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const takePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

        const photoData = canvas.toDataURL('image/jpeg');
        setHasPhoto(true);

        // Pass to Silent Resilience logic for background syncing
        onCapture(photoData);
    };

    return (
        <div className="fixed inset-0 z-[250] bg-slate-900 flex flex-col items-center justify-center p-6">
            <header className="absolute top-0 w-full p-8 flex justify-between items-center z-10">
                <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Anchoring Memory</span>
                    <h2 className="text-white text-xl font-serif">{locationName}</h2>
                </div>
                <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors">✕</button>
            </header>

            <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                {/* Visual guide for receipt alignment */}
                <div className="absolute inset-8 border border-white/20 rounded-lg pointer-events-none border-dashed" />
            </div>

            <footer className="mt-12 w-full max-w-sm flex flex-col items-center gap-6">
                <button
                    onClick={takePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white/20 p-1 group active:scale-90 transition-transform"
                >
                    <div className="w-full h-full bg-white rounded-full group-hover:bg-amber-50" />
                </button>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    Snap Receipt or Dish
                </p>
            </footer>
        </div>
    );
};

export default PhotoCapture;