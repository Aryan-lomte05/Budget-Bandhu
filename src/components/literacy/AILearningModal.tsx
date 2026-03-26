'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Send,
    Sparkles,
    Calculator,
    CheckCircle,
    MessageCircle,
    Brain,
    Loader2,
    ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AILearningModalProps {
    topic: {
        id: string;
        title: string;
        description: string;
        icon: any;
        gradient: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    suggestions?: string[];
    calculatorLink?: { name: string; href: string; amount?: number };
}

export function AILearningModal({ topic, isOpen, onClose }: AILearningModalProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Initial AI greeting with personalized lesson
            const greeting: Message = {
                id: '1',
                role: 'ai',
                content: `Hi! I'm your AI learning assistant powered by Phi3. Let's learn about **${topic.title}** together!\n\nBased on your transaction history, I noticed:\n• You spend ₹15,000/month on average\n• Your largest expense category is Food (₹5,500)\n• You've saved ₹12,000 in the last 3 months\n\nLet me create a personalized lesson for you on ${topic.title} using YOUR data!`,
                suggestions: [
                    'Show me a budgeting strategy',
                    'How can I save more?',
                    'Calculate my savings potential',
                ],
            };
            setMessages([greeting]);
        }
    }, [isOpen, topic]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Simulate AI response (replace with actual Phi3 API call)
        setTimeout(() => {
            const aiResponse = generateAIResponse(inputValue, topic.id);
            setMessages((prev) => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    const generateAIResponse = (userInput: string, topicId: string): Message => {
        const lowerInput = userInput.toLowerCase();

        // Intent detection for calculator routing
        if (lowerInput.includes('invest') || lowerInput.includes('sip')) {
            return {
                id: Date.now().toString(),
                role: 'ai',
                content: `Great question! Based on your current savings of ₹12,000, I recommend starting a SIP.\n\nWith ₹5,000/month SIP at 12% annual return:\n• After 5 years: ₹4.1 lakhs\n• After 10 years: ₹11.6 lakhs\n• After 20 years: ₹49.5 lakhs\n\nWould you like to try our SIP Calculator with your numbers?`,
                calculatorLink: { name: 'SIP Calculator', href: '/literacy/calculators/sip?amount=5000', amount: 5000 },
                suggestions: ['How do I start SIP?', 'What are mutual funds?', 'Show tax benefits'],
            };
        }

        if (lowerInput.includes('budget') || lowerInput.includes('save')) {
            return {
                id: Date.now().toString(),
                role: 'ai',
                content: `Perfect! Let's create a budget based on YOUR spending:\n\n**Your Current Spending:**\n• Food: ₹5,500 (37%)\n• Transport: ₹3,000 (20%)\n• Entertainment: ₹2,500 (17%)\n• Others: ₹4,000 (26%)\n\n**My Suggestion (50-30-20 Rule):**\n• Needs: ₹7,500 (50%)\n• Wants: ₹4,500 (30%)\n• Savings: ₹3,000 (20%)\n\nYou could save ₹3,000 more by reducing entertainment to ₹1,500!`,
                suggestions: ['How to track budget?', 'Create savings goal', 'Show spending trends'],
            };
        }

        if (lowerInput.includes('tax')) {
            return {
                id: Date.now().toString(),
                role: 'ai',
                content: `Let me explain tax-saving based on your income!\n\nIf your annual income is ₹6 lakhs:\n• Basic exemption: ₹2.5L (no tax)\n• 5% slab: ₹2.5L-₹5L = ₹12,500 tax\n• 20% slab: ₹5L-₹6L = ₹20,000 tax\n\n**Total Tax: ₹32,500**\n\nYou can save tax by investing in:\n• ELSS Mutual Funds (₹1.5L limit)\n• PPF (₹1.5L limit)\n• NPS (₹50K additional)\n\nWant to calculate your exact tax?`,
                calculatorLink: { name: 'Tax Calculator', href: '/literacy/calculators/tax' },
                suggestions: ['What is 80C?', 'Best tax-saving funds', 'Calculate my tax'],
            };
        }

        // Default response
        return {
            id: Date.now().toString(),
            role: 'ai',
            content: `That's a great question about ${topic.title}!\n\nBased on your financial profile, here's what I recommend:\n\n1. **Start Small:** Begin with what you can afford\n2. **Be Consistent:** Small regular steps beat large irregular ones\n3. **Track Progress:** Use our dashboard to monitor\n\nLet me know if you want specific calculations or examples!`,
            suggestions: ['Show me examples', 'Calculate for me', 'Next topic'],
        };
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    const handleCalculatorClick = (href: string) => {
        toast.success('Opening calculator with your data!');
        router.push(href);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl h-[80vh] backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${topic.gradient} text-white`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{topic.title}</h2>
                                <p className="text-sm opacity-90">AI-Powered Learning Session</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                                        : 'bg-white/70 border border-gray-200'
                                    }`}
                            >
                                {message.role === 'ai' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-emerald-600" />
                                        <span className="text-xs font-semibold text-emerald-600">AI Assistant</span>
                                    </div>
                                )}
                                <div className="prose prose-sm max-w-none">
                                    {message.content.split('\n').map((line, idx) => (
                                        <p key={idx} className={message.role === 'user' ? 'text-white' : 'text-gray-800'}>
                                            {line}
                                        </p>
                                    ))}
                                </div>

                                {/* Calculator Link */}
                                {message.calculatorLink && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleCalculatorClick(message.calculatorLink!.href)}
                                        className="mt-4 w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Calculator className="w-5 h-5" />
                                            <span className="font-semibold">{message.calculatorLink.name}</span>
                                        </div>
                                        <ExternalLink className="w-4 h-4" />
                                    </motion.button>
                                )}

                                {/* Suggestions */}
                                {message.suggestions && message.suggestions.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {message.suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/70 border border-gray-200 rounded-2xl p-4">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                                    <span className="text-sm text-gray-600">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white/50 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask me anything about this topic..."
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/70"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Send
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
