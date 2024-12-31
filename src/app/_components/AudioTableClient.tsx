"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { Slider } from "../../components/ui/slider";

export function AudioTableClient({ audios }: { audios: any[] }) {
    const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
    const [progress, setProgress] = useState<{ [key: number]: number }>({});
    const [duration, setDuration] = useState<{ [key: number]: number }>({});
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

    const handlePlayPause = (audioId: number) => {
        const audioElement = audioRefs.current[audioId];
        if (currentPlaying === audioId) {
            audioElement.pause();
            setCurrentPlaying(null);
        } else {
            if (currentPlaying !== null) {
                audioRefs.current[currentPlaying]?.pause();
            }
            audioElement.play();
            setCurrentPlaying(audioId);
        }
    };

    const handleTimeUpdate = (audioId: number) => {
        const audioElement = audioRefs.current[audioId];
        setProgress(prev => ({
            ...prev,
            [audioId]: (audioElement.currentTime / audioElement.duration) * 100
        }));
    };

    const handleLoadedMetadata = (audioId: number) => {
        setDuration(prev => ({
            ...prev,
            [audioId]: audioRefs.current[audioId].duration
        }));
    };

    const handleSeek = (audioId: number, value: number[]) => {
        const audioElement = audioRefs.current[audioId];
        const newTime = (value[0] / 100) * audioElement.duration;
        audioElement.currentTime = newTime;
        setProgress(prev => ({ ...prev, [audioId]: value[0] }));
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        Object.values(audioRefs.current).forEach(audio => {
            audio.muted = !isMuted;
        });
    };

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0] / 100;
        setVolume(newVolume);
        Object.values(audioRefs.current).forEach(audio => {
            audio.volume = newVolume;
        });
    };

    if (audios.length === 0) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-blue-600">No Audio Found</h2>
                <p className="text-gray-600 mt-2">You haven't uploaded any audio yet.</p>
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
                        <div className="flex flex-col gap-2">
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
                                <div className="flex-grow">
                                    <Slider 
                                        value={[progress[audio.id] || 0]}
                                        onValueChange={(value) => handleSeek(audio.id, value)}
                                        max={100}
                                        step={0.1}
                                        className="w-full"
                                    />
                                </div>
                                <div className="text-sm text-gray-600 w-24 text-right">
                                    {formatTime(duration[audio.id] * (progress[audio.id] || 0) / 100)} / {formatTime(duration[audio.id] || 0)}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleMute}
                                    className="p-1 rounded-full hover:bg-blue-100"
                                >
                                    {isMuted ? (
                                        <VolumeXIcon className="h-5 w-5 text-blue-700" />
                                    ) : (
                                        <Volume2Icon className="h-5 w-5 text-blue-700" />
                                    )}
                                </button>
                                <div className="w-24">
                                    <Slider
                                        value={[volume * 100]}
                                        onValueChange={handleVolumeChange}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <audio
                            ref={el => el && (audioRefs.current[audio.id] = el)}
                            src={audio.url}
                            onTimeUpdate={() => handleTimeUpdate(audio.id)}
                            onLoadedMetadata={() => handleLoadedMetadata(audio.id)}
                            preload="metadata"
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default AudioTableClient;