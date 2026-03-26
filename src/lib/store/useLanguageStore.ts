/**
 * Language Store - Manages application language state
 * Persists language preference
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'ml' | 'pa';

interface LanguageState {
    currentLanguage: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            currentLanguage: 'en',
            setLanguage: (lang) => set({ currentLanguage: lang }),
        }),
        {
            name: 'budgetbandhu-language',
        }
    )
);

export const LANGUAGES: { code: LanguageCode; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];
