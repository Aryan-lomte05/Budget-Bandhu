// src/lib/api/client.ts
import axios from 'axios';
import { useConfigStore } from '@/lib/store/useConfigStore';
import { mockData } from './mock-data';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Smart fetch wrapper with mock mode
export async function smartFetch<T>(
    endpoint: string,
    options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        mockKey?: keyof typeof mockData;
        mockDelay?: number; // Simulate API latency
    }
): Promise<T> {
    const { isMockMode } = useConfigStore.getState();

    // MOCK MODE - Return fake data
    if (isMockMode && options?.mockKey) {
        console.log(`🎭 [MOCK] Fetching ${endpoint} from mock data`);

        // Simulate API delay for realism
        await new Promise(resolve =>
            setTimeout(resolve, options.mockDelay || 300)
        );

        return mockData[options.mockKey] as T;
    }

    // REAL MODE - Hit actual API
    console.log(`🌐 [REAL] Fetching ${endpoint} from API`);

    try {
        const response = await apiClient.request<T>({
            url: endpoint,
            method: options?.method || 'GET',
            data: options?.data,
        });

        return response.data;
    } catch (error) {
        console.error(`❌ API Error on ${endpoint}:`, error);
        throw error;
    }
}
