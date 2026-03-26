/**
 * User Store - Manages current user ID and auth state
 * For connecting frontend to ML API
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, mlApi } from '../api/ml-api';

interface UserState {
    // State
    userId: string | null;
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User) => void;
    login: (mobile_number: string, password: string) => Promise<boolean>;
    register: (data: { name: string; mobile_number: string; password: string; income?: number }) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Initial state
            userId: null,
            user: null,
            isLoggedIn: false,
            isLoading: false,

            // Set user
            setUser: (user) => set({
                user,
                userId: user.id,
                isLoggedIn: true
            }),

            // Login with mobile number
            login: async (mobile_number, password) => {
                set({ isLoading: true });
                try {
                    const result = await mlApi.user.login(mobile_number, password);
                    set({
                        user: result.user,
                        userId: result.user.id,
                        isLoggedIn: true,
                        isLoading: false
                    });
                    return true;
                } catch (error) {
                    console.error('[UserStore] Login failed:', error);
                    set({ isLoading: false });
                    return false;
                }
            },

            // Register
            register: async (data) => {
                set({ isLoading: true });
                try {
                    const user = await mlApi.user.register(data);
                    set({
                        user,
                        userId: user.id,
                        isLoggedIn: true,
                        isLoading: false
                    });
                    return true;
                } catch (error) {
                    console.error('[UserStore] Register failed:', error);
                    set({ isLoading: false });
                    return false;
                }
            },

            // Logout
            logout: () => set({
                user: null,
                userId: null,
                isLoggedIn: false
            }),

            // Refresh user data
            refreshUser: async () => {
                const { userId } = get();
                if (!userId) return;

                try {
                    const user = await mlApi.user.getProfile(userId);
                    set({ user });
                } catch (error) {
                    console.error('[UserStore] Refresh failed:', error);
                }
            },
        }),
        {
            name: 'budgetbandhu-user',
            partialize: (state) => ({
                userId: state.userId,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);
