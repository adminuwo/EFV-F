'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import ResumeModal from '../Common/ResumeModal';
import { Play, Pause, Volume2, SkipBack, SkipForward, Headphones, Repeat, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecureAudioPlayerProps {
    streamUrl: string;
    title: string;
    productId: string;
}

const SecureAudioPlayer: React.FC<SecureAudioPlayerProps> = ({ streamUrl, title, productId }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [obfuscatedUrl, setObfuscatedUrl] = useState<string>('');
    const [currentTime, setCurrentTime] = useState(0);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [lastPosition, setLastPosition] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // Security: Toggle Global Security Layer & Disable local Right-click
    useEffect(() => {
        // Enable Security
        window.dispatchEvent(new CustomEvent('efv-enable-security'));

        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        window.addEventListener('contextmenu', handleContextMenu);
        return () => {
            // Disable Security
            window.dispatchEvent(new CustomEvent('efv-disable-security'));
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    // Fetch saved progress on mount
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('efv_auth_user') || '{}').token;
                if (!token) return;

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://efvbackend-743928421487.asia-south1.run.app';
                const { data } = await axios.get(`${API_URL}/api/library/progress/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (data && data.progress > 5) {
                    setLastPosition(data.progress);
                    setShowResumeModal(true);
                }
                setIsReady(true);
            } catch (err) {
                console.error('Error fetching audio progress', err);
                setIsReady(true);
            }
        };
        fetchProgress();
    }, [productId]);

    const saveAudioProgress = useCallback(async (pos: number) => {
        if (pos <= 5) return;
        try {
            const authStr = localStorage.getItem('efv_auth_user');
            if (!authStr) return;
            const token = JSON.parse(authStr).token;

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://efvbackend-743928421487.asia-south1.run.app';
            await axios.post(`${API_URL}/api/library/progress`, {
                productId,
                progress: pos,
                total: audioRef.current?.duration || 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`[DEBUG] Audio progress saved at ${Math.round(pos)}s`);
        } catch (err) {
            console.error('Error saving audio progress', err);
        }
    }, [productId]);

    // Save progress periodically (throttled)
    useEffect(() => {
        if (!isReady || showResumeModal) return;

        const currentAudio = audioRef.current;

        const saveInterval = setInterval(() => {
            if (isPlaying && currentAudio) {
                saveAudioProgress(currentAudio.currentTime);
            }
        }, 10000);

        return () => {
            clearInterval(saveInterval);
            if (isReady && currentAudio && currentAudio.currentTime > 5 && !showResumeModal) {
                saveAudioProgress(currentAudio.currentTime);
            }
        };
    }, [isPlaying, productId, showResumeModal, isReady, saveAudioProgress]);

    useEffect(() => {
        // Obfuscate the stream URL using a local Blob URL
        const fetchBlob = async () => {
            try {
                const response = await fetch(streamUrl);
                const blob = await response.blob();
                const localUrl = URL.createObjectURL(blob);
                setObfuscatedUrl(localUrl);
            } catch (err) {
                console.error('Audio stream error', err);
            }
        };

        fetchBlob();

        return () => {
            if (obfuscatedUrl) URL.revokeObjectURL(obfuscatedUrl);
        };
    }, [streamUrl, obfuscatedUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        setCurrentTime(current);
        setDuration(total);
        if (total > 0) {
            setProgress((current / total) * 100);
        }
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const seekTo = (parseFloat(e.target.value) / 100) * duration;
        audioRef.current.currentTime = seekTo;
        setProgress(parseFloat(e.target.value));
    };

    return (
        <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl w-full max-w-lg border border-white/5 relative overflow-hidden group">
            <ResumeModal
                isOpen={showResumeModal}
                type="AUDIOBOOK"
                position={lastPosition}
                onContinue={() => {
                    if (audioRef.current) audioRef.current.currentTime = lastPosition;
                    setShowResumeModal(false);
                    togglePlay();
                }}
                onStartOver={() => {
                    if (audioRef.current) audioRef.current.currentTime = 0;
                    setShowResumeModal(false);
                }}
            />

            {/* Premium Background Glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-gold-energy/5 blur-[100px] rounded-full group-hover:bg-gold-energy/10 transition-all duration-1000" />

            <div className="relative flex flex-col items-center">
                {/* Album Art / Icon area */}
                <div className="relative mb-8">
                    <div className="w-48 h-48 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                        <Headphones className="text-gold-energy/20 w-32 h-32 absolute" />
                        <motion.div
                            animate={isPlaying ? { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="z-10 bg-gold-energy/10 p-8 rounded-2xl border border-gold-energy/20 backdrop-blur-sm"
                        >
                            <Volume2 className="text-gold-energy w-16 h-16" />
                        </motion.div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">{title}</h3>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-gold-energy rounded-full animate-pulse" />
                        <p className="text-gold-energy text-[10px] font-black tracking-[0.3em] uppercase">HIGH-FIDELITY STREAM</p>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    src={obfuscatedUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                    className="hidden"
                    controlsList="nodownload"
                />

                {/* Progress Bar Container */}
                <div className="w-full mb-8">
                    <div className="relative w-full h-2 bg-white/5 rounded-full mb-2 overflow-hidden group/progress">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="h-full bg-gradient-to-r from-gold-energy to-white rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 tracking-widest">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="w-full flex items-center justify-between px-6">
                    <button className="text-gray-600 hover:text-white transition-colors">
                        <Shuffle size={20} />
                    </button>

                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 15 }}
                            className="text-white/40 hover:text-gold-energy transition-colors transform active:scale-90"
                        >
                            <SkipBack size={32} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-20 h-20 bg-gold-energy rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] group-hover:shadow-[0_15px_60px_rgba(212,175,55,0.4)]"
                        >
                            {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
                        </button>

                        <button
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime += 15 }}
                            className="text-white/40 hover:text-gold-energy transition-colors transform active:scale-90"
                        >
                            <SkipForward size={32} />
                        </button>
                    </div>

                    <button className="text-gray-600 hover:text-white transition-colors">
                        <Repeat size={20} />
                    </button>
                </div>
            </div>

            {/* Footer Watermark */}
            <div className="mt-12 pt-6 border-t border-white/5 text-center">
                <p className="text-[9px] text-gray-700 font-black tracking-[0.5em] uppercase">SECURE DIGITAL STREAMING SYSTEM • NEXT-GEN EFV ENGINE</p>
            </div>
        </div>
    );
};

export default SecureAudioPlayer;
