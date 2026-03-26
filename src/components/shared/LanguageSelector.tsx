'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguageStore, LANGUAGES, LanguageCode } from '@/lib/store/useLanguageStore';

export function LanguageSelector() {
    const { currentLanguage, setLanguage } = useLanguageStore();
    const [isOpen, setIsOpen] = useState(false);

    const currentLang = LANGUAGES.find(l => l.code === currentLanguage);

    return (
        <div className="relative z-50">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-gray-700 transition-colors"
                title="Select Language"
            >
                <Globe className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium hidden sm:block">
                    {currentLang?.nativeName}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[300px] overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-2 space-y-1">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${currentLanguage === lang.code
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="grid">
                                            <span className="font-medium text-sm">
                                                {lang.nativeName}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {lang.name}
                                            </span>
                                        </div>
                                        {currentLanguage === lang.code && (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Add CSS for custom scrollbar in global CSS or similar
// .custom-scrollbar::-webkit-scrollbar { width: 4px; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
