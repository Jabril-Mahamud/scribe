"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { Slider } from "../../components/ui/slider";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";

interface Audio {
  id: number;
  text: string;
  url: string;
  createdAt: string;
}

export function AudioTableClient({ audios }: { audios: Audio[] }) {
    const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
    const [progress, setProgress] = useState<Record<number, number>>({});
    const [duration, setDuration] = useState<Record<number, number>>({});
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRefs = useRef<Record<number, HTMLAudioElement>>({});
    const progressIntervalRef = useRef<Record<number, NodeJS.Timeout>>({});
    const isClient = useRef(false);

    useEffect(() => {
        isClient.current = true;
        const savedVolume = window.localStorage.getItem('audioVolume');
        const savedMuted = window.localStorage.getItem('audioMuted');
        
        if (savedVolume) {
            setVolume(parseFloat(savedVolume));
        }
        if (savedMuted) {
            setIsMuted(savedMuted === 'true');
        }
    }, []);

    useEffect(() => {
        if (isClient.current) {
            window.localStorage.setItem('audioVolume', volume.toString());
            window.localStorage.setItem('audioMuted', isMuted.toString());
        }
    }, [volume, isMuted]);

    useEffect(() => {
        const currentIntervals = progressIntervalRef.current;
        return () => {
            Object.values(currentIntervals).forEach(interval => {
                clearInterval(interval);
            });
        };
    }, []);

    const handleTimeUpdate = useCallback((audioId: number) => {
        const audioElement = audioRefs.current[audioId];
        if (!audioElement) return;

        setProgress(prev => ({
            ...prev,
            [audioId]: (audioElement.currentTime / audioElement.duration) * 100
        }));

        if (audioElement.currentTime >= audioElement.duration) {
            const interval = progressIntervalRef.current[audioId];
            if (interval) clearInterval(interval);
            setCurrentPlaying(null);
        }
    }, []);

    const handlePlayPause = useCallback((audioId: number) => {
        const audioElement = audioRefs.current[audioId];
        if (!audioElement) return;

        if (currentPlaying === audioId) {
            audioElement.pause();
            setCurrentPlaying(null);
            const interval = progressIntervalRef.current[audioId];
            if (interval) clearInterval(interval);
        } else {
            if (currentPlaying !== null) {
                const currentAudio = audioRefs.current[currentPlaying];
                if (currentAudio) currentAudio.pause();
                const currentInterval = progressIntervalRef.current[currentPlaying];
                if (currentInterval) clearInterval(currentInterval);
            }
            audioElement.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            setCurrentPlaying(audioId);
            
            progressIntervalRef.current[audioId] = setInterval(() => {
                handleTimeUpdate(audioId);
            }, 50);
        }
    }, [currentPlaying, handleTimeUpdate]);

    const handleSeek = useCallback((audioId: number, value: number[]) => {
        const audioElement = audioRefs.current[audioId];
        if (!audioElement) return;

        const newTime = (value[0] / 100) * audioElement.duration;
        audioElement.currentTime = newTime;
        setProgress(prev => ({ ...prev, [audioId]: value[0] }));
    }, []);

    const formatTime = useCallback((time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) audio.muted = !isMuted;
        });
    }, [isMuted]);

    const handleVolumeChange = useCallback((value: number[]) => {
        const newVolume = value[0] / 100;
        setVolume(newVolume);
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) audio.volume = newVolume;
        });
    }, []);

    const handleLoadedMetadata = useCallback((audioId: number) => {
        const audioElement = audioRefs.current[audioId];
        if (!audioElement) return;

        setDuration(prev => ({
            ...prev,
            [audioId]: audioElement.duration
        }));
        
        audioElement.volume = volume;
        audioElement.muted = isMuted;
    }, [volume, isMuted]);

    if (audios.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <h2 className="text-2xl font-semibold text-blue-600">No Audio Found</h2>
                <p className="text-gray-600 mt-2">You haven&apos;t uploaded any audio yet.</p>
            </motion.div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-6" role="region" aria-label="Audio playlist">
                <AnimatePresence>
                    {audios.map((audio) => (
                        <motion.div
                            key={audio.id}
                            initial={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0, translateY: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                        {audio.text ?? "Untitled Audio"}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(audio.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => handlePlayPause(audio.id)}
                                                    className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                                                    aria-label={currentPlaying === audio.id ? "Pause" : "Play"}
                                                >
                                                    {currentPlaying === audio.id ? (
                                                        <PauseIcon className="h-5 w-5 text-white" />
                                                    ) : (
                                                        <PlayIcon className="h-5 w-5 text-white" />
                                                    )}
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {currentPlaying === audio.id ? "Pause" : "Play"}
                                            </TooltipContent>
                                        </Tooltip>

                                        <div className="flex-grow">
                                            <Slider
                                                value={[progress[audio.id] ?? 0]}
                                                onValueChange={(value) => handleSeek(audio.id, value)}
                                                max={100}
                                                step={0.1}
                                                className="w-full"
                                                aria-label="Audio progress"
                                            />
                                        </div>

                                        <span className="text-sm text-gray-600 tabular-nums w-20 text-right">
                                            {formatTime((duration[audio.id] ?? 0) * (progress[audio.id] ?? 0) / 100)} / {formatTime(duration[audio.id] ?? 0)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={toggleMute}
                                                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                                >
                                                    {isMuted ? (
                                                        <VolumeXIcon className="h-5 w-5 text-gray-600" />
                                                    ) : (
                                                        <Volume2Icon className="h-5 w-5 text-gray-600" />
                                                    )}
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {isMuted ? "Unmute" : "Mute"}
                                            </TooltipContent>
                                        </Tooltip>

                                        <div className="w-24">
                                            <Slider
                                                value={[volume * 100]}
                                                onValueChange={handleVolumeChange}
                                                max={100}
                                                step={1}
                                                className="w-full"
                                                aria-label="Volume control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <audio
                                    ref={(el) => {
                                        if (el) audioRefs.current[audio.id] = el;
                                    }}
                                    src={audio.url}
                                    onTimeUpdate={() => handleTimeUpdate(audio.id)}
                                    onLoadedMetadata={() => handleLoadedMetadata(audio.id)}
                                    onEnded={() => setCurrentPlaying(null)}
                                    preload="metadata"
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </TooltipProvider>
    );
}

export default AudioTableClient;