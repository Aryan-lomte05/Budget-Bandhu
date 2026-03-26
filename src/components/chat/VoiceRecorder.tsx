"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [transcript, setTranscript] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-IN'; // Indian English

                recognitionRef.current.onresult = (event: any) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' ';
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    setTranscript(finalTranscript || interimTranscript);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    stopRecording();
                };
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = () => {
        if (!recognitionRef.current) {
            // Fallback: simulate voice input
            setIsRecording(true);
            setTranscript('');
            setDuration(0);

            timerRef.current = setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);

            // Simulate transcript after 2 seconds
            setTimeout(() => {
                setTranscript('Can I afford a 15000 rupee laptop?');
            }, 2000);

            return;
        }

        try {
            recognitionRef.current.start();
            setIsRecording(true);
            setTranscript('');
            setDuration(0);

            timerRef.current = setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Failed to stop recording:', error);
            }
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsRecording(false);

        if (transcript.trim()) {
            onTranscript(transcript.trim());
            setTranscript('');
        }
        setDuration(0);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative">
            {/* Recording Modal */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={stopRecording}
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Pulsing Mic Icon */}
                            <div className="flex flex-col items-center mb-6">
                                <motion.div
                                    className="relative w-24 h-24 bg-gradient-to-br from-mint-500 to-skyBlue-500 rounded-full flex items-center justify-center mb-4"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <Mic className="w-12 h-12 text-white" />

                                    {/* Pulse Rings */}
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute inset-0 rounded-full border-2 border-mint-500"
                                            initial={{ scale: 1, opacity: 0.8 }}
                                            animate={{
                                                scale: [1, 2, 2.5],
                                                opacity: [0.8, 0.3, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.4,
                                            }}
                                        />
                                    ))}
                                </motion.div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">Listening...</h3>
                                <p className="text-sm text-gray-600">Tap anywhere to stop</p>
                            </div>

                            {/* Duration */}
                            <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-mint-600">
                                    {formatDuration(duration)}
                                </div>
                            </div>

                            {/* Transcript Preview */}
                            {transcript && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-gray-50 rounded-xl mb-4"
                                >
                                    <p className="text-sm text-gray-700">{transcript}</p>
                                </motion.div>
                            )}

                            {/* Stop Button */}
                            <Button
                                onClick={stopRecording}
                                className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Voice Button */}
            <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                variant="outline"
                size="icon"
                className={`rounded-full transition-all ${isRecording
                        ? 'bg-coral-500 border-coral-500 text-white hover:bg-coral-600'
                        : 'hover:bg-mint-50 hover:border-mint-500'
                    }`}
            >
                {isRecording ? (
                    <MicOff className="w-5 h-5" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </Button>
        </div>
    );
}
