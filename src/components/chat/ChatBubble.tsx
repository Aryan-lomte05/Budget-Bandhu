"use client";

import { motion } from 'framer-motion';
import { ChatMessage } from '@/lib/types/chat';
import { Bot, User, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
    message: ChatMessage;
    onAction?: (action: string) => void;
}

export function ChatBubble({ message, onAction }: ChatBubbleProps) {
    const isUser = message.role === 'user';

    const getSeverityColor = (severity?: string) => {
        switch (severity) {
            case 'warning': return 'bg-coral-50 border-coral-200';
            case 'success': return 'bg-mint-50 border-mint-200';
            default: return 'bg-skyBlue-50 border-skyBlue-200';
        }
    };

    const getSeverityIcon = (severity?: string) => {
        switch (severity) {
            case 'warning': return <AlertCircle className="w-4 h-4 text-coral-600" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-mint-600" />;
            default: return <TrendingUp className="w-4 h-4 text-skyBlue-600" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser
                    ? 'bg-gradient-to-br from-mint-500 to-skyBlue-500'
                    : 'bg-gradient-to-br from-lavender-500 to-skyBlue-500'
                    }`}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Bot className="w-5 h-5 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                {/* Main Bubble */}
                <div
                    className={`px-4 py-3 rounded-2xl ${isUser
                        ? 'bg-gradient-to-r from-mint-500 to-skyBlue-500 text-white rounded-tr-none'
                        : 'glass border-2 border-white/50 text-gray-900 rounded-tl-none'
                        }`}
                >
                    {message.type === 'text' || !message.type ? (
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    strong: ({ children }) => <strong className={isUser ? 'text-white' : 'text-gray-900'}>{children}</strong>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    ) : null}

                    {/* Insight Card */}
                    {message.type === 'insight' && message.metadata?.insight && (
                        <div className={`p-3 rounded-lg border ${getSeverityColor(message.metadata.insight.severity)}`}>
                            <div className="flex items-start gap-2">
                                {getSeverityIcon(message.metadata.insight.severity)}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        {message.metadata.insight.category}
                                    </p>
                                    <p className="text-sm text-gray-700">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {message.metadata?.actions && message.metadata.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {message.metadata.actions.map((action, index) => (
                            <Button
                                key={index}
                                onClick={() => onAction?.(action.action)}
                                variant="outline"
                                size="sm"
                                className="text-xs hover:bg-mint-50 hover:border-mint-500"
                            >
                                {action.icon && <span className="mr-1">{action.icon}</span>}
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                <span className={`text-xs text-gray-500 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
        </motion.div>
    );
}
