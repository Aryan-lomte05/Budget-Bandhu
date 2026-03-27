import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechToTextOptions {
    lang?: string;
    continuous?: boolean;
    interimResults?: boolean;
    onResult?: (transcript: string) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
}

export function useSpeechToText({
    lang = 'en-US',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
    onEnd
}: UseSpeechToTextOptions = {}) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetSilenceTimer = useCallback(() => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }, 5000); // 5 seconds of silence
    }, []);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setError('Speech Recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;

        recognition.onresult = (event: any) => {
            resetSilenceTimer();
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript);
            if (onResult) onResult(currentTranscript);
        };

        recognition.onstart = () => {
            setIsRecording(true);
            resetSilenceTimer();
        };

        recognition.onerror = (event: any) => {
            console.error('Speech Recognition Error:', event.error);
            setError(event.error);
            setIsRecording(false);
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
            if (onError) onError(event.error);
        };

        recognition.onend = () => {
            setIsRecording(false);
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
            if (onEnd) onEnd();
        };

        recognitionRef.current = recognition;

        return () => {
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        };
    }, [lang, continuous, interimResults, resetSilenceTimer, onEnd, onError, onResult]);

    const start = useCallback(() => {
        if (!recognitionRef.current) return;
        setError(null);
        setTranscript('');
        try {
            recognitionRef.current.start();
            setIsRecording(true);
        } catch (err: any) {
            console.error('Failed to start recognition:', err);
            setError(err.message);
        }
    }, []);

    const stop = useCallback(() => {
        if (!recognitionRef.current) return;
        recognitionRef.current.stop();
        setIsRecording(false);
    }, []);

    const reset = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        isRecording,
        transcript,
        error,
        start,
        stop,
        reset
    };
}
