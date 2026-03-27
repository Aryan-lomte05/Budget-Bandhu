'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Globe, Loader2, Play } from 'lucide-react';
import { useSpeechToText } from '@/lib/hooks/useSpeechToText';
import { mlApi } from '@/lib/api/ml-api';

interface VoiceInputProps {
    onTranscript: (transcript: string, language: string) => void;
    isProcessing?: boolean;
}

export function VoiceInput({ onTranscript, isProcessing = false }: VoiceInputProps) {
    const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
    const [showLanguages, setShowLanguages] = useState(false);
    
    const {
        isRecording,
        transcript,
        error,
        start,
        stop,
        reset
    } = useSpeechToText({
        lang: selectedLanguage,
        continuous: false,
        interimResults: true,
        onEnd: () => {
            if (transcript) {
                onTranscript(transcript, selectedLanguage);
                reset();
            }
        }
    });

    const languages = [
        { code: 'hi-IN', name: 'Hindi' },
        { code: 'mr-IN', name: 'Marathi' },
        { code: 'ta-IN', name: 'Tamil' },
        { code: 'te-IN', name: 'Telugu' },
        { code: 'bn-IN', name: 'Bengali' },
        { code: 'gu-IN', name: 'Gujarati' },
        { code: 'kn-IN', name: 'Kannada' },
        { code: 'ml-IN', name: 'Malayalam' },
        { code: 'pa-IN', name: 'Punjabi' },
        { code: 'en-US', name: 'English' },
    ];

    const currentLangName = languages.find(l => l.code === selectedLanguage)?.name || 'Language';

    return (
        <div className="relative flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
                <button
                    onClick={() => setShowLanguages(!showLanguages)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 hover:text-mm-purple transition-colors bg-gray-50 rounded-lg border border-gray-100"
                >
                    <Globe className="w-3 h-3" />
                    <span>{currentLangName}</span>
                </button>

                <AnimatePresence>
                    {showLanguages && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]"
                        >
                            <div className="max-h-48 overflow-y-auto">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setSelectedLanguage(lang.code);
                                            setShowLanguages(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                                            selectedLanguage === lang.code ? 'text-mm-purple font-bold bg-mm-purple/5' : 'text-gray-600'
                                        }`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mic Button */}
            <div className="relative">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={isRecording ? stop : start}
                    disabled={isProcessing}
                    className={`p-2 rounded-lg transition-all duration-300 relative overflow-hidden ${
                        isRecording 
                        ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                        : isProcessing 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-mm-purple/10 text-mm-purple hover:bg-mm-purple hover:text-white'
                    }`}
                >
                    {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isRecording ? (
                        <Mic className="w-4 h-4 animate-pulse" />
                    ) : (
                        <Mic className="w-4 h-4" />
                    )}
                </motion.button>

                {/* Wave Animation */}
                {isRecording && (
                    <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 flex items-center gap-1 h-4">
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [4, 16, 4],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.5,
                                    delay: i * 0.1,
                                }}
                                className="w-1 bg-red-400 rounded-full"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-50 text-red-500 text-[10px] rounded-lg border border-red-100 whitespace-nowrap">
                    {error}
                </div>
            )}
        </div>
    );
}
