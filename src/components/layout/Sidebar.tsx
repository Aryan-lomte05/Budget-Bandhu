"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ArrowLeftRight,
    Target,
    TrendingUp,
    MessageCircle,
    Settings,
    Sparkles,
    Trophy,
    BookOpen,
    User,
    Users,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Budget", href: "/budget", icon: Target },
    { name: "Goals", href: "/goals", icon: Sparkles },
    { name: "Insights", href: "/insights", icon: TrendingUp },
    { name: "Achievements", href: "/gamification", icon: Trophy },
    { name: "Learn Finance", href: "/literacy", icon: BookOpen },
    { name: "AI Chat", href: "/chat", icon: MessageCircle },
    { name: "Friends", href: "/friends", icon: Users }, // NEW
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "w-64 bg-white border-r border-gray-200 flex flex-col",
                className
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-mint-500 to-skyBlue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">BB</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900">Budget Bandhu</h1>
                        <p className="text-xs text-gray-500">Your Financial Friend</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                isActive
                                    ? "bg-mint-50 text-mint-700 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "text-mint-600")} />
                            <span>{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mint-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Card - Financial Score */}
            <div className="p-4 m-4 bg-gradient-to-br from-mint-500 to-skyBlue-500 rounded-xl text-white">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium opacity-90">Financial Score</span>
                    <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold mb-1">782</div>
                <div className="text-xs opacity-75">🔥 Keep it up! +12 this week</div>
            </div>
        </aside>
    );
}
