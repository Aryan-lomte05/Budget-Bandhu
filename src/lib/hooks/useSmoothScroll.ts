import { useCallback } from 'react';

export function useSmoothScroll() {
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    const scrollToElement = useCallback((elementId: string, offset: number = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    }, []);

    const scrollToBottom = useCallback(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    }, []);

    return {
        scrollToTop,
        scrollToElement,
        scrollToBottom,
    };
}
