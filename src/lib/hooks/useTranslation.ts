import { useState, useCallback } from 'react';
import { mlApi } from '../api/ml-api';
import { useLanguageStore, LanguageCode } from '../store/useLanguageStore';

export function useTranslation() {
    const { currentLanguage, setLanguage } = useLanguageStore();
    const [isTranslating, setIsTranslating] = useState(false);

    /**
     * Translate text to current language
     */
    const translate = useCallback(async (text: string): Promise<string> => {
        if (currentLanguage === 'en') {
            return text; // No translation needed
        }

        setIsTranslating(true);
        try {
            const result = await mlApi.translate.text(text, currentLanguage, 'en');
            return result.translatedText;
        } catch (error) {
            console.error('[Translation] Error:', error);
            return text; // Fallback to original
        } finally {
            setIsTranslating(false);
        }
    }, [currentLanguage]);

    /**
     * Translate multiple texts at once
     */
    const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
        if (currentLanguage === 'en') {
            return texts;
        }

        // Parallel requests for now (can be optimized with batch API if available)
        return Promise.all(texts.map(t => translate(t)));
    }, [currentLanguage, translate]);

    return {
        currentLanguage,
        setLanguage,
        translate,
        translateBatch,
        isTranslating,
    };
}
