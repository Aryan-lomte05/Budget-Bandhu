import { useState, useCallback } from 'react';

export function useBalloons() {
    const [isActive, setIsActive] = useState(false);

    const launch = useCallback((duration: number = 6000) => {
        setIsActive(true);

        // Auto-stop after duration
        setTimeout(() => {
            setIsActive(false);
        }, duration);
    }, []);

    const stop = useCallback(() => {
        setIsActive(false);
    }, []);

    return {
        isActive,
        launch,
        stop,
    };
}
