import { useState, useCallback } from 'react';

export function useFireworks() {
    const [isActive, setIsActive] = useState(false);

    const launch = useCallback((duration: number = 5000) => {
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
