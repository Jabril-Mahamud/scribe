"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PauseIcon, PlayIcon } from "lucide-react";

export function AudioTableClient({ audios }: { audios: any[] }) {
    const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

    const handlePlayPause = (audioId: number) => {
        const audioElement = audioRefs.current.get(audioId);
        if (!audioElement) return;

        if (currentPlaying === audioId) {
            audioElement.pause();
            setCurrentPlaying(null);
        } else {
            if (currentPlaying !== null) {
                const currentlyPlayingElement = audioRefs.current.get(currentPlaying);
                currentlyPlayingElement?.pause();
            }
            audioElement.play();
            setCurrentPlaying(audioId);
        }
    };

    const handleTimeUpdate = (audioId: number) => {
        const audioElement = audioRefs.current.get(audioId);
        if (audioElement) {
            setCurrentTime(audioElement.currentTime);
        }
    };

    if (audios.length === 0) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-blue-600">No Audio Found</h2>
                <p className="text-gray-600 mt-2">You haven’t uploaded any audio yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {audios.map((audio) => (
                <motion.div
                    key={audio.id}
                    initial={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 shadow-lg rounded-lg p-4 border border-blue-200"
                >
                    <div className="flex flex-col gap-3">
                        <div className="text-lg font-semibold text-blue-900">
                            {audio.text || "Untitled Audio"}
                        </div>
                        <div className="text-sm text-gray-500">
                            Uploaded on:{" "}
                            {new Date(audio.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handlePlayPause(audio.id)}
                                    className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {currentPlaying === audio.id ? (
                                        <PauseIcon className="h-6 w-6 text-white" />
                                    ) : (
                                        <PlayIcon className="h-6 w-6 text-white" />
                                    )}
                                </button>
                                {currentPlaying === audio.id && (
                                    <span className="text-sm text-blue-700">Now Playing</span>
                                )}
                            </div>
                            <audio
                                ref={(el) => el && audioRefs.current.set(audio.id, el)}
                                id={`audio-${audio.id}`}
                                className="w-full"
                                src={audio.url}
                                preload="metadata"
                                onTimeUpdate={() => handleTimeUpdate(audio.id)}
                            ></audio>
                            {currentPlaying === audio.id && (
                                <div className="w-full h-2 bg-blue-200 rounded-full mt-2">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{
                                            width: `${(currentTime / (audioRefs.current.get(audio.id)?.duration || 1)) * 100}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
