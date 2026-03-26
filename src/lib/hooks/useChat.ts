import { useState } from 'react';
import { mockData } from '@/lib/api/mock-data';

export function useChat() {
    const [messages, setMessages] = useState(mockData.chatHistory);
    return { messages, setMessages };
}
