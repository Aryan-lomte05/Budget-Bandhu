"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConfigStore } from "@/lib/store/useConfigStore";

export function Header() {
    const { isMockMode } = useConfigStore();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search transactions, goals..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                {/* Mock Mode Indicator (subtle) */}
                {isMockMode && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-lavender-50 rounded-lg">
                        <div className="w-2 h-2 bg-lavender-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-lavender-700">Demo Mode</span>
                    </div>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full" />
                </Button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="hidden md:block text-right">
                        <div className="text-sm font-medium text-gray-900">Aryan Lomte</div>
                        <div className="text-xs text-gray-500">aryan@example.com</div>
                    </div>
                    <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-mint-500/20">
                        <AvatarImage src="/avatars/aryan.jpg" />
                        <AvatarFallback className="bg-mint-500 text-white">AK</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
