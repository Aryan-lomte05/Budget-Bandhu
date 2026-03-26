// Budget Bandhu Color Palette
export const colors = {
    // Primary Colors
    primary: {
        mint: '#10B981',
        mintLight: '#34D399',
        mintDark: '#059669',
        mintBg: '#D1FAE5',
    },

    secondary: {
        skyBlue: '#3B82F6',
        skyBlueLight: '#60A5FA',
        skyBlueDark: '#2563EB',
        skyBlueBg: '#DBEAFE',
    },

    accent: {
        coral: '#F59E0B',
        coralLight: '#FBBF24',
        coralDark: '#D97706',
        coralBg: '#FEF3C7',

        lavender: '#A78BFA',
        lavenderLight: '#C4B5FD',
        lavenderDark: '#8B5CF6',
        lavenderBg: '#EDE9FE',
    },

    // Semantic Colors
    semantic: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },

    // Neutrals
    neutral: {
        white: '#FFFFFF',
        gray50: '#F9FAFB',
        gray100: '#F3F4F6',
        gray200: '#E5E7EB',
        gray300: '#D1D5DB',
        gray400: '#9CA3AF',
        gray500: '#6B7280',
        gray600: '#4B5563',
        gray700: '#374151',
        gray800: '#1F2937',
        gray900: '#111827',
    },

    // Category Colors
    categories: {
        food: '#F59E0B',
        transport: '#3B82F6',
        shopping: '#A78BFA',
        bills: '#10B981',
        entertainment: '#EC4899',
        groceries: '#84CC16',
        healthcare: '#EF4444',
        education: '#8B5CF6',
        emi: '#6366F1',
        insurance: '#14B8A6',
        investments: '#10B981',
        travel: '#06B6D4',
        personal: '#F97316',
        gifts: '#EC4899',
        others: '#6B7280',
    },

    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        premium: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
        success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        danger: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
    },
} as const;

export type ColorPalette = typeof colors;

// Helper functions
export function getCategoryColor(category: string): string {
    return colors.categories[category.toLowerCase() as keyof typeof colors.categories] || colors.categories.others;
}

export function getGradient(type: keyof typeof colors.gradients): string {
    return colors.gradients[type];
}
