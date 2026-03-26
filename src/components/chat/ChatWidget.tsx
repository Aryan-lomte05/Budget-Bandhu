'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minus, Mic, Bot, User, Trash2 } from 'lucide-react';
import { useUserStore } from '@/lib/store/useUserStore';
import { mlApi } from '@/lib/api/ml-api';
import { ChatMessage } from '@/lib/types/chat';
import { usePathname } from 'next/navigation';

export function ChatWidget() {
    const { userId, isLoggedIn } = useUserStore();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Determine if widget should be shown
    const shouldShow = pathname !== '/chat' && isLoggedIn && !!userId;

    const loadHistory = async () => {
        if (!userId) return;
        try {
            const history = await mlApi.chat.getHistory(userId);
            if (history && history.length > 0) {
                setMessages(history);
            } else {
                setMessages([{
                    id: 'welcome',
                    role: 'assistant',
                    content: "Hi! How can I help you with your budget today?",
                    timestamp: new Date().toISOString(),
                    type: 'text'
                }]);
            }
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    };

    // All hooks must be called before any early return
    useEffect(() => {
        if (isOpen && messages.length === 0 && shouldShow) {
            loadHistory();
        }
    }, [isOpen, shouldShow]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping || !userId) return;

        const userMsg: ChatMessage = {
            id: `widget_${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await mlApi.chat.send(userId, input, sessionId);
            if (res.session_id) setSessionId(res.session_id);

            const aiMsg: ChatMessage = {
                id: `widget_${Date.now()}_ai`,
                role: 'assistant',
                content: res.response,
                timestamp: new Date().toISOString(),
                metadata: { confidence: res.confidence }
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('Chat error:', err);
        } finally {
            setIsTyping(false);
        }
    };

    // Don't render if shouldn't show
    if (!shouldShow) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden ${isMinimized ? 'h-[60px]' : ''}`}
                    >
                        {/* Header */}
                        <div className="bg-mm-purple p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Budget Buddy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                ? 'bg-mm-purple text-white rounded-tr-none'
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none animate-pulse text-xs text-gray-400">
                                                Thinking...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 bg-white border-t border-gray-100">
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-200 focus-within:border-mm-purple/50 transition-colors">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Ask something..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isTyping}
                                            className="p-2 bg-mm-purple rounded-lg text-white disabled:opacity-50"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIsMinimized(false);
                }}
                className="w-14 h-14 bg-mm-purple rounded-full shadow-lg flex items-center justify-center text-white hover:bg-mm-lavender transition-colors relative"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                )}
            </motion.button>
        </div>
    );
}
