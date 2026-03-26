export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    type?: 'text' | 'chart' | 'action' | 'insight';
    metadata?: {
        chart?: {
            type: 'line' | 'bar' | 'pie' | 'donut';
            data: any;
        };
        actions?: Array<{
            label: string;
            action: string;
            icon?: string;
        }>;
        insight?: {
            category: string;
            severity: 'info' | 'warning' | 'success';
        };
        confidence?: number;
    };
}

export interface VoiceState {
    isRecording: boolean;
    transcript: string;
    duration: number;
}
