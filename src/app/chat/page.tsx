"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SuggestedQueries } from '@/components/chat/SuggestedQueries';
import { VoiceRecorder } from '@/components/chat/VoiceRecorder';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ChatMessage } from '@/lib/types/chat';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load Finance Advisor with no SSR
const FinanceAdvisor3D = dynamic(() => import('@/components/chat/FinanceAdvisor3D').then(mod => mod.FinanceAdvisor3D), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900 animate-pulse" />
});
import { Send, Mic, Camera, TrendingUp, PiggyBank, Target } from 'lucide-react';
import { useUserStore } from '@/lib/store/useUserStore';
import { mlApi } from '@/lib/api/ml-api';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';

// Quick Action Items
const quickActions = [
    { id: 'budget', label: 'Check my budget', icon: PiggyBank },
    { id: 'invest', label: 'Investment Tips', icon: TrendingUp, emergency: false },
    { id: 'goals', label: 'My Savings Goals', icon: Target },
];

export default function ChatPage() {
    const router = useRouter();
    const { userId, isLoggedIn } = useUserStore();
    const { currentLanguage, translate } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);
    const [advisorInView, setAdvisorInView] = useState(false);
    const advisorRef = useRef<HTMLDivElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Force login
    useEffect(() => {
        if (!isLoggedIn || !userId) {
            router.push('/auth/login');
        }

        // IntersectionObserver for lazy mounting
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setAdvisorInView(true);
                observer.disconnect();
            }
        }, { rootMargin: '200px' });

        if (advisorRef.current) {
            observer.observe(advisorRef.current);
        }

        return () => observer.disconnect();
    }, [isLoggedIn, userId, router]);

    // Load chat history
    useEffect(() => {
        if (!userId) return; // Wait for login check

        const loadHistory = async () => {
            const activeUserId = userId || 'demo_user';
            try {
                const history = await mlApi.chat.getHistory(activeUserId);
                if (history && history.length > 0) {
                    setMessages(history);
                    return;
                }
            } catch (err) {
                console.error('Failed to load history:', err);
            }

            // Fallback to welcome message if no history
            const welcomeText = "Hey there! 👋 I'm your AI financial buddy powered by **Phi-3.5**. I can help you with budgeting, insights, and more. What would you like to know?";
            const translatedWelcome = await translate(welcomeText);

            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: translatedWelcome,
                timestamp: new Date().toISOString(),
                type: 'text',
            }]);
        };
        loadHistory();
    }, [userId, translate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (text?: string) => {
        const messageText = text || input;
        if (!messageText.trim() || isTyping || !userId) return;

        // 1. Add User Message
        const userMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString(),
            type: 'text',
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // 2. Send to API
            const response = await mlApi.chat.send(userId, messageText, sessionId);

            // Update session ID if returned
            if (response.session_id) {
                setSessionId(response.session_id);
            }

            // 3. Translate Response
            const translatedContent = await translate(response.response);

            // 4. Add Assistant Message
            const aiMessage: ChatMessage = {
                id: `msg_${Date.now()}_ai`,
                role: 'assistant',
                content: translatedContent,
                timestamp: new Date().toISOString(),
                type: 'text',
                metadata: {
                    confidence: response.confidence
                }
            };

            setMessages(prev => [...prev, aiMessage]);

            // Trigger speaking
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = "Sorry, I'm having trouble connecting to the brain. Please try again.";
            const translatedError = await translate(errorMsg);

            setMessages(prev => [...prev, {
                id: `err_${Date.now()}`,
                role: 'assistant',
                content: translatedError,
                timestamp: new Date().toISOString(),
                type: 'text'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleVoiceTranscript = (transcript: string) => {
        setInput(transcript);
        // Optional: auto-send
        // setTimeout(() => handleSend(transcript), 500);
    };

    const handleQuickAction = (actionId: string) => {
        const actionMessages: Record<string, string> = {
            budget: "What's my current budget status?",
            invest: "Give me some investment tips",
            goals: "Show me my savings goals",
        };
        handleSend(actionMessages[actionId] || actionId);
    };

    return (
        <div className="chat-page-bg h-screen overflow-hidden flex flex-col">
            {/* Header / Nav would go here, but focusing on page content */}

            <div className="chat-split-layout flex-1 flex overflow-hidden">
                {/* Left Side - Chat Area */}
                <div className="chat-area flex-1 flex flex-col bg-slate-900/90 backdrop-blur-sm relative">

                    {/* Messages Container */}
                    <div className="chat-messages-container flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${message.role === 'user'
                                        ? 'bg-emerald-600 text-white rounded-tr-none'
                                        : 'bg-slate-800 text-gray-100 rounded-tl-none border border-slate-700'
                                        }`}
                                >
                                    <div dangerouslySetInnerHTML={{
                                        __html: message.content
                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
                                            .replace(/\n/g, '<br/>')
                                    }} />

                                    <div className="flex items-center justify-end mt-2 gap-2 opacity-60">
                                        <span className="text-[10px]">
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-none border border-slate-700">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="chat-quick-actions p-4 flex gap-2 overflow-x-auto">
                        {quickActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleQuickAction(action.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 text-xs sm:text-sm whitespace-nowrap transition-all"
                                disabled={isTyping}
                            >
                                <action.icon className="w-4 h-4" />
                                {action.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area p-4 bg-slate-950 border-t border-slate-800">
                        <div className="chat-input-box flex items-center gap-2 bg-slate-900 rounded-xl p-2 border border-slate-800 focus-within:border-emerald-500/50 transition-colors">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={currentLanguage === 'en' ? "Ask about your finances..." : "अपने वित्त के बारे में पूछें..."} // Simple fallback
                                disabled={isTyping}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500"
                            />

                            <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={isTyping} />

                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="p-2 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-500 mt-2">
                            ⚠️ AI responses are powered by Phi-3.5 and may not always be accurate.
                        </p>
                    </div>
                </div>

                {/* Right Side - Finance Advisor 3D Panel */}
                <div className="chat-advisor-panel hidden md:flex flex-col w-[350px] bg-black border-l border-slate-800 relative">


                    {/* 3D Finance Advisor */}
                    <div ref={advisorRef} className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-slate-900 to-black">
                        {advisorInView && (
                            <Suspense fallback={null}>
                                <FinanceAdvisor3D isThinking={isTyping} isSpeaking={isSpeaking} />
                            </Suspense>
                        )}
                    </div>

                    {/* Status Indicator */}
                    <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isTyping ? 'bg-amber-400 animate-pulse' : isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className="text-slate-300 font-medium font-mono uppercase tracking-wider text-sm">
                                {isTyping ? 'PROCESSING...' : isSpeaking ? 'SPEAKING...' : 'ONLINE'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
