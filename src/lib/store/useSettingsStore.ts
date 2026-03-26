import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    joinedDate: string;
    bio: string;
}

interface NotificationSettings {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    budgetAlerts: boolean;
    billReminders: boolean;
    goalMilestones: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
}

interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    showSpending: boolean;
    showGoals: boolean;
    allowDataSharing: boolean;
    allowAnalytics: boolean;
}

interface PreferenceSettings {
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
    dateFormat: string;
    numberFormat: string;
}

interface SecuritySettings {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    sessionTimeout: number;
}

interface SettingsState {
    profile: UserProfile;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    preferences: PreferenceSettings;
    security: SecuritySettings;
    updateProfile: (profile: Partial<UserProfile>) => void;
    updateNotifications: (notifications: Partial<NotificationSettings>) => void;
    updatePrivacy: (privacy: Partial<PrivacySettings>) => void;
    updatePreferences: (preferences: Partial<PreferenceSettings>) => void;
    updateSecurity: (security: Partial<SecuritySettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            profile: {
                name: 'Aryan Lomte',
                email: 'aryan@budgetbandhu.com',
                phone: '+91 98765 43210',
                avatar: '',
                joinedDate: '2025-01-15',
                bio: 'ML Engineer passionate about fintech',
            },
            notifications: {
                pushEnabled: true,
                emailEnabled: true,
                smsEnabled: false,
                budgetAlerts: true,
                billReminders: true,
                goalMilestones: true,
                weeklyReports: true,
                monthlyReports: false,
            },
            privacy: {
                profileVisibility: 'friends',
                showSpending: true,
                showGoals: true,
                allowDataSharing: false,
                allowAnalytics: true,
            },
            preferences: {
                currency: 'INR',
                language: 'en',
                theme: 'light',
                dateFormat: 'DD/MM/YYYY',
                numberFormat: 'en-IN',
            },
            security: {
                twoFactorEnabled: false,
                biometricEnabled: true,
                sessionTimeout: 30,
            },
            updateProfile: (profile) =>
                set((state) => ({ profile: { ...state.profile, ...profile } })),
            updateNotifications: (notifications) =>
                set((state) => ({ notifications: { ...state.notifications, ...notifications } })),
            updatePrivacy: (privacy) =>
                set((state) => ({ privacy: { ...state.privacy, ...privacy } })),
            updatePreferences: (preferences) =>
                set((state) => ({ preferences: { ...state.preferences, ...preferences } })),
            updateSecurity: (security) =>
                set((state) => ({ security: { ...state.security, ...security } })),
        }),
        {
            name: 'settings-storage',
        }
    )
);
