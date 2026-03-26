import { useConfigStore } from '@/lib/store/useConfigStore';

export function useMockMode() {
    const { isMockMode, toggleMockMode } = useConfigStore();
    return { isMockMode, toggleMockMode };
}
